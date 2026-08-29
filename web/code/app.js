function hideAllPages() {
  const pages = document.querySelectorAll(".page");
  pages.forEach(function (page) {
    page.classList.remove("active");
  });
}

function showHomePage() {
  hideAllPages();
  document.getElementById("home-page").classList.add("active");
}

function showBouncePage() {
  hideAllPages();
  document.getElementById("bounce-page").classList.add("active");
}

function showBounceDownPage() {
  hideAllPages();
  document.getElementById("bounce-down-page").classList.add("active");
  resetStudentExercise();
}

const connectThighButton = document.getElementById("connect-thigh-button");
const connectShankButton = document.getElementById("connect-shank-button");

const thighStatus = document.getElementById("thigh-status");
const shankStatus = document.getElementById("shank-status");

const thighData = document.getElementById("thigh-data");
const shankData = document.getElementById("shank-data");


const startRecordingButton = document.getElementById("start-recording-button");
const stopRecordingButton = document.getElementById("stop-recording-button");
const downloadCsvButton = document.getElementById("download-csv-button");
const recordingStatus = document.getElementById("recording-status");

const startExerciseButton = document.getElementById("start-exercise-button");
const stopExerciseButton = document.getElementById("stop-exercise-button");
const downloadStudentCsvButton = document.getElementById("download-student-csv-button");
const exerciseStatus = document.getElementById("exercise-status");
const exerciseRound = document.getElementById("exercise-round");
const exerciseActionCommand = document.getElementById("exercise-action-command");
const exerciseCorrectionCommand = document.getElementById("exercise-correction-command");
const exerciseSummary = document.getElementById("exercise-summary");
const exerciseFeedbackTitle = document.getElementById("exercise-feedback-title");

const exerciseFlexionFeedback = document.getElementById("exercise-flexion-feedback");
const exerciseAaFeedback = document.getElementById("exercise-aa-feedback");
const exerciseIeFeedback = document.getElementById("exercise-ie-feedback");

const uartServiceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const uartTxCharacteristicUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const bleTextDecoder = new TextDecoder("utf-8");

let thighLineBuffer = "";
let shankLineBuffer = "";
let latestThighQuaternion = null;
let latestShankQuaternion = null;
let thighUpdated = false;
let shankUpdated = false;
let isThighConnected = false;
let isShankConnected = false;


let isRecording = false;
let recordedRows = [];
let recordingStartTime = null;

let isExerciseRunning = false;
let exerciseStartTime = null;
let exerciseTrainingStartTime = null;
let exerciseRows = [];
let exerciseErrorSamples = {
  flexionExtension: [],
  abductionAdduction: [],
  internalExternalRotation: [],
};

let lastRealtimeFeedback = {
  flexionExtension: "",
  abductionAdduction: "",
  internalExternalRotation: "",
};

let lastRealtimeFeedbackTime = {
  flexionExtension: 0,
  abductionAdduction: 0,
  internalExternalRotation: 0,
};

const realtimeFeedbackHoldMs = 800;

const bounceStartFlexionDeg = 10;
const bounceResetFlexionDeg = 10;
const bouncePeakDropDeg = 4;
const minimumBouncePeakDeg = 20;

const teacherBounceRanges = [
  [0, 30],
  [30, 68],
  [68, 100],
];

let bounceTrackingState = "ready";
let currentBouncePeak = null;
let detectedBounceCount = 0;
let lowestPointResults = [];

const teacherReferenceFlexion = [
  7.859, 16.130, 24.206, 33.168, 39.973, 46.464, 51.739, 57.687, 62.048, 65.665,
  68.328, 70.262, 71.341, 71.681, 71.707, 71.319, 69.999, 67.536, 63.854, 58.245,
  51.301, 43.579, 36.448, 26.733, 21.240, 13.731, 8.308, 3.828, 1.766, 0.342,
  0.124, 0.122, 0.387, 1.615, 4.572, 7.504, 9.927, 12.797, 17.461, 24.223,
  29.934, 36.984, 44.005, 50.378, 55.809, 60.251, 63.997, 66.703, 68.633, 69.767,
  69.972, 69.397, 67.429, 64.371, 60.966, 55.395, 48.942, 42.393, 35.966, 29.585,
  22.826, 17.625, 13.719, 9.353, 3.139, 0.533, 0.136, 0.136, 0.281, 0.477,
  0.489, 0.980, 2.206, 5.021, 10.657, 19.814, 29.409, 37.342, 46.500, 54.113,
  59.996, 64.877, 69.201, 71.297, 72.278, 72.650, 73.345, 73.504, 73.526, 73.397,
  71.751, 67.799, 62.299, 55.256, 47.940, 39.923, 27.897, 18.885, 11.458, 6.102,
  1.808
];

const teacherReferenceAbductionAdduction = [
  -1.426, -2.574, -2.585, -2.819, -3.335, -3.673, -3.954, -4.057, -3.966, -4.007,
  -4.047, -4.327, -4.328, -4.441, -4.559, -4.508, -4.286, -3.730, -3.419, -3.153,
  -2.678, -2.374, -1.866, -1.114, -0.995, -1.067, -1.000, -0.550, -0.500, -0.442,
  -0.431, -0.390, -0.331, -0.561, -0.963, -1.133, -1.143, -0.907, -1.403, -1.872,
  -2.453, -2.941, -3.215, -3.395, -3.780, -3.924, -3.999, -4.127, -4.402, -4.653,
  -4.847, -4.757, -4.577, -4.550, -4.322, -3.934, -3.164, -2.469, -1.974, -1.887,
  -1.760, -1.583, -1.431, -1.209, -0.976, -0.763, -0.820, -0.878, -0.910, -0.952,
  -0.872, -0.798, -0.887, -1.030, -1.209, -1.768, -1.770, -2.067, -2.249, -2.735,
  -3.304, -3.462, -3.792, -4.031, -4.555, -4.623, -4.860, -4.923, -5.005, -4.947,
  -4.798, -4.001, -3.167, -2.856, -2.734, -2.336, -1.677, -1.560, -0.951, -0.567,
  -0.392
];

const teacherReferenceInternalExternalRotation = [
  -1.555, -2.126, -2.574, -2.311, -2.121, -0.920, 0.757, 1.866, 2.500, 3.177,
  3.598, 4.095, 3.946, 4.063, 3.927, 3.906, 3.359, 2.787, 2.182, 1.587,
  1.271, 0.947, 0.320, -0.790, -1.076, -1.901, -1.661, -1.389, -1.833, -1.865,
  -1.491, -1.484, -1.422, -1.240, -1.051, -1.075, -1.374, -1.888, -2.381, -2.279,
  -1.878, -0.845, -0.479, 0.197, 0.785, 1.199, 1.923, 2.586, 2.933, 3.036,
  2.979, 3.056, 2.974, 2.571, 1.905, 1.419, 0.909, 0.471, -0.036, -0.081,
  -0.405, -0.553, -0.658, -0.722, -1.591, -1.420, -0.901, -0.830, -0.758, -0.688,
  -0.790, -0.945, -1.285, -1.521, -1.888, -1.999, -2.313, -1.473, -0.930, 0.100,
  1.024, 1.727, 2.503, 2.728, 2.759, 2.722, 2.891, 2.945, 2.959, 3.157,
  2.953, 2.563, 2.106, 1.479, 0.283, -0.576, -1.802, -2.366, -3.141, -3.458,
  -3.551
];

// Right-leg mounting used in this project:
// X = Flexion/Extension
// Y = Internal/External Rotation
// Z = Abduction/Adduction
// Sign convention: AA positive = abduction, AA negative = adduction;
// IE positive = internal rotation, IE negative = external rotation.
const aaDirectionSign = 1;
const ieDirectionSign = 1;
const flexionToleranceDeg = 3;
const aaToleranceDeg = 1.5;
const ieToleranceDeg = 1.5;

const calibrationDurationMs = 2000;
const teacherRoundDurationMs = 10181;
const repsPerRound = 3;
const totalExerciseRounds = 3;

let calibrationSamples = [];
let neutralRelativeQuaternion = null;
let latestStudentAngles = {
  flexionExtension: 0,
  abductionAdduction: 0,
  internalExternalRotation: 0,
};
let latestTeacherAngles = {
  flexionExtension: 0,
  abductionAdduction: 0,
  internalExternalRotation: 0,
};

function setSensorStatus(statusElement, message, statusClass) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.remove("connected", "error");

  if (statusClass) {
    statusElement.classList.add(statusClass);
  }
}

function formatQuaternionData(label, quaternion, rawLine) {
  return `${label} live data\n` +
    `qw: ${quaternion.qw.toFixed(3)}\n` +
    `qx: ${quaternion.qx.toFixed(3)}\n` +
    `qy: ${quaternion.qy.toFixed(3)}\n` +
    `qz: ${quaternion.qz.toFixed(3)}\n\n` +
    `Raw line:\n${rawLine}`;
}


function parseQuaternionLine(line, expectedLabel) {
  const parts = line.trim().split(",");

  if (parts.length !== 5) {
    return null;
  }

  const label = parts[0];

  if (label !== expectedLabel) {
    return null;
  }

  const qw = Number(parts[1]);
  const qx = Number(parts[2]);
  const qy = Number(parts[3]);
  const qz = Number(parts[4]);

  if ([qw, qx, qy, qz].some(Number.isNaN)) {
    return null;
  }

  return { qw, qx, qy, qz };
}

function normalizeQuaternion(q) {
  const norm = Math.hypot(q.qw, q.qx, q.qy, q.qz);

  if (!Number.isFinite(norm) || norm < 0.9 || norm > 1.1) {
    return null;
  }

  return {
    qw: q.qw / norm,
    qx: q.qx / norm,
    qy: q.qy / norm,
    qz: q.qz / norm,
  };
}

function conjugateQuaternion(q) {
  return {
    qw: q.qw,
    qx: -q.qx,
    qy: -q.qy,
    qz: -q.qz,
  };
}

function multiplyQuaternions(a, b) {
  return {
    qw: a.qw * b.qw - a.qx * b.qx - a.qy * b.qy - a.qz * b.qz,
    qx: a.qw * b.qx + a.qx * b.qw + a.qy * b.qz - a.qz * b.qy,
    qy: a.qw * b.qy - a.qx * b.qz + a.qy * b.qw + a.qz * b.qx,
    qz: a.qw * b.qz + a.qx * b.qy - a.qy * b.qx + a.qz * b.qw,
  };
}

function getRelativeQuaternion(thighQuaternion, shankQuaternion) {
  const thigh = normalizeQuaternion(thighQuaternion);
  const shank = normalizeQuaternion(shankQuaternion);

  if (!thigh || !shank) {
    return null;
  }

  return normalizeQuaternion(
    multiplyQuaternions(conjugateQuaternion(thigh), shank)
  );
}

function averageQuaternions(quaternions) {
  if (quaternions.length === 0) {
    return null;
  }

  const reference = quaternions[0];
  let qw = 0;
  let qx = 0;
  let qy = 0;
  let qz = 0;

  quaternions.forEach(function (q) {
    const dot =
      q.qw * reference.qw +
      q.qx * reference.qx +
      q.qy * reference.qy +
      q.qz * reference.qz;
    const sign = dot < 0 ? -1 : 1;

    qw += sign * q.qw;
    qx += sign * q.qx;
    qy += sign * q.qy;
    qz += sign * q.qz;
  });

  return normalizeQuaternion({
    qw: qw / quaternions.length,
    qx: qx / quaternions.length,
    qy: qy / quaternions.length,
    qz: qz / quaternions.length,
  });
}

function getCalibratedKneeAngles(relativeQuaternion) {
  if (!neutralRelativeQuaternion || !relativeQuaternion) {
    return null;
  }

  const calibrated = normalizeQuaternion(
    multiplyQuaternions(
      conjugateQuaternion(neutralRelativeQuaternion),
      relativeQuaternion
    )
  );

  if (!calibrated) {
    return null;
  }

  const { qw, qx, qy, qz } = calibrated;

  const flexionNumerator = 2 * (qw * qx + qy * qz);
  const flexionDenominator = 1 - 2 * (qx * qx + qy * qy);
  let flexionExtension = Math.atan2(flexionNumerator, flexionDenominator) * 180 / Math.PI;

  const ieInput = 2 * (qw * qy - qz * qx);
  let internalExternalRotation = Math.asin(
    Math.max(-1, Math.min(1, ieInput))
  ) * 180 / Math.PI;

  const aaNumerator = 2 * (qw * qz + qx * qy);
  const aaDenominator = 1 - 2 * (qy * qy + qz * qz);
  let abductionAdduction = Math.atan2(
    aaNumerator,
    aaDenominator
  ) * 180 / Math.PI;

  if (Math.abs(flexionExtension) < 1) {
    flexionExtension = 0;
  }
  if (Math.abs(abductionAdduction) < 1) {
    abductionAdduction = 0;
  }
  if (Math.abs(internalExternalRotation) < 1) {
    internalExternalRotation = 0;
  }

  return {
    flexionExtension,
    abductionAdduction: aaDirectionSign * abductionAdduction,
    internalExternalRotation: ieDirectionSign * internalExternalRotation,
  };
}

function getReferenceValueAtPhase(referenceArray, phasePercent) {
  const clampedPhase = Math.max(0, Math.min(100, phasePercent));
  const exactIndex = clampedPhase / 100 * (referenceArray.length - 1);
  const lowerIndex = Math.floor(exactIndex);
  const upperIndex = Math.min(referenceArray.length - 1, lowerIndex + 1);
  const fraction = exactIndex - lowerIndex;

  return referenceArray[lowerIndex] * (1 - fraction) +
    referenceArray[upperIndex] * fraction;
}

function getTeacherAnglesAtPhase(phasePercent) {
  return {
    flexionExtension: getReferenceValueAtPhase(teacherReferenceFlexion, phasePercent),
    abductionAdduction: getReferenceValueAtPhase(
      teacherReferenceAbductionAdduction,
      phasePercent
    ),
    internalExternalRotation: getReferenceValueAtPhase(
      teacherReferenceInternalExternalRotation,
      phasePercent
    ),
  };
}

function getTeacherLowestPointReference() {
  const lowestPoints = teacherBounceRanges.map(function (range) {
    const startIndex = Math.round(range[0] / 100 * (teacherReferenceFlexion.length - 1));
    const endIndex = Math.round(range[1] / 100 * (teacherReferenceFlexion.length - 1));

    let peakIndex = startIndex;

    for (let index = startIndex + 1; index <= endIndex; index += 1) {
      if (teacherReferenceFlexion[index] > teacherReferenceFlexion[peakIndex]) {
        peakIndex = index;
      }
    }

    return {
      flexionExtension: teacherReferenceFlexion[peakIndex],
      abductionAdduction: teacherReferenceAbductionAdduction[peakIndex],
      internalExternalRotation: teacherReferenceInternalExternalRotation[peakIndex],
    };
  });

  return {
    flexionExtension:
      lowestPoints.reduce(function (sum, point) {
        return sum + point.flexionExtension;
      }, 0) / lowestPoints.length,
    abductionAdduction:
      lowestPoints.reduce(function (sum, point) {
        return sum + point.abductionAdduction;
      }, 0) / lowestPoints.length,
    internalExternalRotation:
      lowestPoints.reduce(function (sum, point) {
        return sum + point.internalExternalRotation;
      }, 0) / lowestPoints.length,
  };
}

function updateLowestPointFeedback(studentAngles, now) {
  if (bounceTrackingState === "ready") {
    if (studentAngles.flexionExtension >= bounceStartFlexionDeg) {
      bounceTrackingState = "tracking";
      currentBouncePeak = { ...studentAngles };
    }
    return;
  }

  if (bounceTrackingState === "tracking") {
    if (
      !currentBouncePeak ||
      studentAngles.flexionExtension > currentBouncePeak.flexionExtension
    ) {
      currentBouncePeak = { ...studentAngles };
      return;
    }

    const dropFromPeak =
      currentBouncePeak.flexionExtension - studentAngles.flexionExtension;

    if (
      currentBouncePeak.flexionExtension >= minimumBouncePeakDeg &&
      dropFromPeak >= bouncePeakDropDeg
    ) {
      const teacherLowestPoint = getTeacherLowestPointReference();

      const flexionError =
        teacherLowestPoint.flexionExtension - currentBouncePeak.flexionExtension;
      const aaError =
        teacherLowestPoint.abductionAdduction - currentBouncePeak.abductionAdduction;
      const ieError =
        teacherLowestPoint.internalExternalRotation -
        currentBouncePeak.internalExternalRotation;

      lowestPointResults.push({
        bounce: detectedBounceCount + 1,
        student: { ...currentBouncePeak },
        teacher: { ...teacherLowestPoint },
        error: {
          flexionExtension: flexionError,
          abductionAdduction: aaError,
          internalExternalRotation: ieError,
        },
      });

      detectedBounceCount += 1;

      const flexionFeedback = getFlexionFeedback(
        teacherLowestPoint.flexionExtension,
        currentBouncePeak.flexionExtension
      );
      const aaFeedback = getAaFeedback(
        teacherLowestPoint.abductionAdduction,
        currentBouncePeak.abductionAdduction
      );
      const ieFeedback = getIeFeedback(
        teacherLowestPoint.internalExternalRotation,
        currentBouncePeak.internalExternalRotation
      );

      setFeedbackItem(
        exerciseFlexionFeedback,
        flexionFeedback === "BEND MORE"
          ? "Bend more at the lowest point."
          : flexionFeedback === "BEND LESS"
            ? "Bend less at the lowest point."
            : ""
      );

      setFeedbackItem(
        exerciseAaFeedback,
        aaFeedback === "KNEE OUT"
          ? "Move your knee out at the lowest point."
          : aaFeedback === "KNEE IN"
            ? "Move your knee in at the lowest point."
            : ""
      );

      setFeedbackItem(
        exerciseIeFeedback,
        ieFeedback === "ROTATE IN"
          ? "Rotate your lower leg in at the lowest point."
          : ieFeedback === "ROTATE OUT"
            ? "Rotate your lower leg out at the lowest point."
            : ""
      );

      if (!flexionFeedback && !aaFeedback && !ieFeedback) {
        setExerciseText(
          exerciseCorrectionCommand,
          "Good lowest-point position."
        );
      } else {
        setExerciseText(
          exerciseCorrectionCommand,
          `Bounce ${detectedBounceCount}: adjust the lowest-point position using the feedback above.`
        );
      }

      bounceTrackingState = "returning";
      currentBouncePeak = null;
    }

    return;
  }

  if (
    bounceTrackingState === "returning" &&
    studentAngles.flexionExtension <= bounceResetFlexionDeg
  ) {
    bounceTrackingState = "ready";
    currentBouncePeak = null;
  }
}

function setExerciseText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function setFeedbackItem(element, message) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.hidden = !message;
}

function getHeldRealtimeFeedback(key, newMessage, now) {
  if (newMessage) {
    lastRealtimeFeedback[key] = newMessage;
    lastRealtimeFeedbackTime[key] = now;
    return newMessage;
  }

  if (
    lastRealtimeFeedback[key] &&
    now - lastRealtimeFeedbackTime[key] < realtimeFeedbackHoldMs
  ) {
    return lastRealtimeFeedback[key];
  }

  lastRealtimeFeedback[key] = "";
  return "";
}

function resetStudentExercise() {
  isExerciseRunning = false;
  exerciseStartTime = null;
  exerciseTrainingStartTime = null;
  exerciseRows = [];
  exerciseErrorSamples = {
    flexionExtension: [],
    abductionAdduction: [],
    internalExternalRotation: [],
  };
  lastRealtimeFeedback = {
    flexionExtension: "",
    abductionAdduction: "",
    internalExternalRotation: "",
  };
  lastRealtimeFeedbackTime = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  calibrationSamples = [];
  neutralRelativeQuaternion = null;
  thighUpdated = false;
  shankUpdated = false;
  latestStudentAngles = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  latestTeacherAngles = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  bounceTrackingState = "ready";
  currentBouncePeak = null;
  detectedBounceCount = 0;
  lowestPointResults = [];

  if (startExerciseButton) {
    startExerciseButton.disabled = false;
  }

  if (stopExerciseButton) {
    stopExerciseButton.disabled = true;
  }

  if (downloadStudentCsvButton) {
    downloadStudentCsvButton.disabled = true;
  }

  setExerciseText(exerciseFeedbackTitle, "REAL-TIME FEEDBACK");
  setExerciseText(exerciseStatus, "Ready to start.");
  setExerciseText(exerciseRound, "0 / 3");
  setExerciseText(exerciseActionCommand, "STAND READY");
  setExerciseText(exerciseCorrectionCommand, "Press Start Exercise, then stand straight for 2 seconds for calibration.");
  setExerciseText(exerciseSummary, "");
  setFeedbackItem(exerciseFlexionFeedback, "");
  setFeedbackItem(exerciseAaFeedback, "");
  setFeedbackItem(exerciseIeFeedback, "");
}

function startStudentExercise() {
  if (isRecording) {
    setExerciseText(exerciseStatus, "Stop teacher recording first.");
    setExerciseText(
      exerciseCorrectionCommand,
      "Teacher recording and student exercise cannot run at the same time."
    );
    return;
  }
  if (
    !isThighConnected ||
    !isShankConnected ||
    !latestThighQuaternion ||
    !latestShankQuaternion
  ) {
    setExerciseText(exerciseStatus, "Connect both sensors first.");
    setExerciseText(exerciseCorrectionCommand, "THIGH and SHANK data are required.");
    return;
  }

  isExerciseRunning = true;
  exerciseStartTime = Date.now();
  exerciseTrainingStartTime = null;
  exerciseRows = [];
  exerciseErrorSamples = {
    flexionExtension: [],
    abductionAdduction: [],
    internalExternalRotation: [],
  };
  lastRealtimeFeedback = {
    flexionExtension: "",
    abductionAdduction: "",
    internalExternalRotation: "",
  };
  lastRealtimeFeedbackTime = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  calibrationSamples = [];
  neutralRelativeQuaternion = null;
  thighUpdated = false;
  shankUpdated = false;
  latestStudentAngles = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  latestTeacherAngles = {
    flexionExtension: 0,
    abductionAdduction: 0,
    internalExternalRotation: 0,
  };
  bounceTrackingState = "ready";
  currentBouncePeak = null;
  detectedBounceCount = 0;
  lowestPointResults = [];

  if (startExerciseButton) {
    startExerciseButton.disabled = true;
  }

  if (stopExerciseButton) {
    stopExerciseButton.disabled = false;
  }

  if (downloadStudentCsvButton) {
    downloadStudentCsvButton.disabled = true;
  }

  setExerciseText(exerciseFeedbackTitle, "REAL-TIME FEEDBACK");
  setExerciseText(exerciseStatus, "Calibrating for 2 seconds...");
  setExerciseText(exerciseRound, "0 / 3");
  setExerciseText(exerciseActionCommand, "STAND STRAIGHT");
  setExerciseText(exerciseCorrectionCommand, "Keep still and stand straight for calibration.");
  setExerciseText(exerciseSummary, "");
  setFeedbackItem(exerciseFlexionFeedback, "");
  setFeedbackItem(exerciseAaFeedback, "");
  setFeedbackItem(exerciseIeFeedback, "");
}

function stopStudentExercise() {
  isExerciseRunning = false;

  if (startExerciseButton) {
    startExerciseButton.disabled = false;
  }

  if (stopExerciseButton) {
    stopExerciseButton.disabled = true;
  }

  if (downloadStudentCsvButton) {
    downloadStudentCsvButton.disabled = exerciseRows.length === 0;
  }

  setExerciseText(exerciseStatus, "Exercise stopped.");
}

function getMovementCue(phasePercent) {
  if (phasePercent < 14) {
    return "DOWN";
  }

  if (phasePercent < 30) {
    return "UP";
  }

  if (phasePercent < 50) {
    return "DOWN";
  }

  if (phasePercent < 68) {
    return "UP";
  }

  if (phasePercent < 87) {
    return "DOWN";
  }

  return "UP";
}

function getFlexionFeedback(teacherAngle, studentAngle) {
  const error = teacherAngle - studentAngle;

  if (Math.abs(error) <= flexionToleranceDeg) {
    return "";
  }

  return error > 0 ? "BEND MORE" : "BEND LESS";
}

function getAaFeedback(teacherAngle, studentAngle) {
  const error = teacherAngle - studentAngle;

  if (Math.abs(error) <= aaToleranceDeg) {
    return "";
  }

  return error > 0 ? "KNEE OUT" : "KNEE IN";
}

function getIeFeedback(teacherAngle, studentAngle) {
  const error = teacherAngle - studentAngle;

  if (Math.abs(error) <= ieToleranceDeg) {
    return "";
  }

  return error > 0 ? "ROTATE IN" : "ROTATE OUT";
}

function finishStudentExercise() {
  isExerciseRunning = false;

  if (startExerciseButton) {
    startExerciseButton.disabled = false;
  }

  if (stopExerciseButton) {
    stopExerciseButton.disabled = true;
  }

  if (downloadStudentCsvButton) {
    downloadStudentCsvButton.disabled = exerciseRows.length === 0;
  }

  function summarizeError(samples, tolerance) {
    const useful = samples.filter(Number.isFinite);
    const outsideTolerance = useful.filter(function (value) {
      return Math.abs(value) > tolerance;
    });

    if (outsideTolerance.length === 0) {
      return {
        hasProblem: false,
        direction: 0,
      };
    }

    let positiveCount = 0;
    let negativeCount = 0;

    outsideTolerance.forEach(function (value) {
      if (value > 0) {
        positiveCount += 1;
      } else if (value < 0) {
        negativeCount += 1;
      }
    });

    return {
      hasProblem: true,
      direction: positiveCount >= negativeCount ? 1 : -1,
    };
  }

  const fe = summarizeError(
    exerciseErrorSamples.flexionExtension,
    flexionToleranceDeg
  );
  const aa = summarizeError(
    exerciseErrorSamples.abductionAdduction,
    aaToleranceDeg
  );
  const ie = summarizeError(
    exerciseErrorSamples.internalExternalRotation,
    ieToleranceDeg
  );

  let flexionSummary = "GOOD - KEEP IT";
  let aaSummary = "GOOD - KEEP IT";
  let ieSummary = "GOOD - KEEP IT";

  if (fe.hasProblem) {
    flexionSummary = fe.direction > 0 ? "BEND MORE" : "BEND LESS";
  }

  if (aa.hasProblem) {
    aaSummary = aa.direction > 0 ? "KNEE OUT" : "KNEE IN";
  }

  if (ie.hasProblem) {
    ieSummary = ie.direction > 0 ? "ROTATE IN" : "ROTATE OUT";
  }

  // Do not update exerciseFeedbackTitle here; leave as "REAL-TIME FEEDBACK"
  setExerciseText(exerciseStatus, "Exercise complete.");
  setExerciseText(
    exerciseRound,
    `${totalExerciseRounds} / ${totalExerciseRounds}`
  );
  setExerciseText(exerciseActionCommand, "");
  setExerciseText(exerciseCorrectionCommand, "");

  setFeedbackItem(
    exerciseFlexionFeedback,
    flexionSummary === "GOOD - KEEP IT"
      ? ""
      : flexionSummary === "BEND MORE"
        ? "Bend your knee more next time."
        : "Bend your knee less next time."
  );

  setFeedbackItem(
    exerciseAaFeedback,
    aaSummary === "GOOD - KEEP IT"
      ? ""
      : aaSummary === "KNEE OUT"
        ? "Move your knee outward next time."
        : "Move your knee inward next time."
  );

  setFeedbackItem(
    exerciseIeFeedback,
    ieSummary === "GOOD - KEEP IT"
      ? ""
      : ieSummary === "ROTATE IN"
        ? "Rotate your lower leg inward next time."
        : "Rotate your lower leg outward next time."
  );

  setExerciseText(
    exerciseCorrectionCommand,
    "You are becoming a better dancer."
  );

  const hasFinalCorrections =
    flexionSummary !== "GOOD - KEEP IT" ||
    aaSummary !== "GOOD - KEEP IT" ||
    ieSummary !== "GOOD - KEEP IT";

  setExerciseText(
    exerciseSummary,
    hasFinalCorrections
      ? `You completed ${totalExerciseRounds} rounds and ${totalExerciseRounds * repsPerRound} bounce repetitions. Keep practicing and use the feedback above to become a better dancer.`
      : `You completed ${totalExerciseRounds} rounds and ${totalExerciseRounds * repsPerRound} bounce repetitions. Great control. Keep practicing to become an even better dancer.`
  );
}

function updateStudentExerciseFromSensors() {
  if (!isExerciseRunning || !latestThighQuaternion || !latestShankQuaternion) {
    return;
  }

  const relativeQuaternion = getRelativeQuaternion(
    latestThighQuaternion,
    latestShankQuaternion
  );

  if (!relativeQuaternion) {
    return;
  }

  const now = Date.now();
  const elapsedMs = now - exerciseStartTime;

  exerciseRows.push({
    timeMs: now,
    elapsedMs,
    thigh: { ...latestThighQuaternion },
    shank: { ...latestShankQuaternion },
  });

  if (!neutralRelativeQuaternion) {
    if (elapsedMs <= calibrationDurationMs) {
      calibrationSamples.push(relativeQuaternion);
      return;
    }

    neutralRelativeQuaternion = averageQuaternions(calibrationSamples);

    if (!neutralRelativeQuaternion) {
      isExerciseRunning = false;
      setExerciseText(exerciseStatus, "Calibration failed.");
      setExerciseText(exerciseCorrectionCommand, "Stand straight and start again.");

      if (startExerciseButton) {
        startExerciseButton.disabled = false;
      }

      if (stopExerciseButton) {
        stopExerciseButton.disabled = true;
      }

      return;
    }

    exerciseTrainingStartTime = now;
    setExerciseText(exerciseStatus, "Exercise started.");
    setExerciseText(exerciseRound, `1 / ${totalExerciseRounds}`);
    setExerciseText(exerciseActionCommand, "DOWN");
    setExerciseText(exerciseCorrectionCommand, "");
    return;
  }

  // --- Begin 3-angle calculation block ---
  const studentAngles = getCalibratedKneeAngles(relativeQuaternion);

  if (!studentAngles || exerciseTrainingStartTime === null) {
    return;
  }

  latestStudentAngles = {
    flexionExtension: studentAngles.flexionExtension,
    abductionAdduction: studentAngles.abductionAdduction,
    internalExternalRotation: studentAngles.internalExternalRotation,
  };

  const trainingElapsedMs = now - exerciseTrainingStartTime;
  const totalExerciseDurationMs = totalExerciseRounds * teacherRoundDurationMs;

  if (trainingElapsedMs >= totalExerciseDurationMs) {
    finishStudentExercise();
    return;
  }

  const currentRound = Math.min(
    totalExerciseRounds,
    Math.floor(trainingElapsedMs / teacherRoundDurationMs) + 1
  );
  const roundElapsedMs = trainingElapsedMs % teacherRoundDurationMs;
  const phasePercent = roundElapsedMs / teacherRoundDurationMs * 100;
  const teacherAngles = getTeacherAnglesAtPhase(phasePercent);

  latestTeacherAngles = teacherAngles;

  exerciseErrorSamples.flexionExtension.push(
    teacherAngles.flexionExtension - latestStudentAngles.flexionExtension
  );
  exerciseErrorSamples.abductionAdduction.push(
    teacherAngles.abductionAdduction - latestStudentAngles.abductionAdduction
  );
  exerciseErrorSamples.internalExternalRotation.push(
    teacherAngles.internalExternalRotation - latestStudentAngles.internalExternalRotation
  );

  setExerciseText(exerciseRound, `${currentRound} / ${totalExerciseRounds}`);
  setExerciseText(
    exerciseActionCommand,
    getMovementCue(phasePercent)
  );

  updateLowestPointFeedback(latestStudentAngles, now);
  // --- End 3-angle calculation block ---
}

function updateRecordingStatus(message, statusClass) {
  if (!recordingStatus) {
    return;
  }

  recordingStatus.textContent = message;
  recordingStatus.classList.remove("active", "finished");

  if (statusClass) {
    recordingStatus.classList.add(statusClass);
  }
}

function recordQuaternionSample(sensorLabel, quaternion) {
  if (!isRecording) {
    return;
  }

  const now = Date.now();
  const elapsedMs = recordingStartTime ? now - recordingStartTime : 0;

  recordedRows.push({
    timeMs: now,
    elapsedMs,
    sensor: sensorLabel,
    qw: quaternion.qw,
    qx: quaternion.qx,
    qy: quaternion.qy,
    qz: quaternion.qz,
  });

  updateRecordingStatus(
    `Teacher recording... ${recordedRows.length} samples saved.`,
    "active"
  );
}

function startRecording() {
  if (isExerciseRunning) {
    updateRecordingStatus(
      "Stop student exercise before starting teacher recording.",
      "finished"
    );
    return;
  }

  recordedRows = [];
  recordingStartTime = Date.now();
  isRecording = true;

  if (startRecordingButton) {
    startRecordingButton.disabled = true;
  }

  if (stopRecordingButton) {
    stopRecordingButton.disabled = false;
  }

  if (downloadCsvButton) {
    downloadCsvButton.disabled = true;
  }

  updateRecordingStatus("Teacher recording... 0 samples saved.", "active");
}

function stopRecording() {
  isRecording = false;

  if (startRecordingButton) {
    startRecordingButton.disabled = false;
  }

  if (stopRecordingButton) {
    stopRecordingButton.disabled = true;
  }

  if (downloadCsvButton) {
    downloadCsvButton.disabled = recordedRows.length === 0;
  }

  updateRecordingStatus(
    `Teacher recording stopped. ${recordedRows.length} samples saved.`,
    "finished"
  );
}

function downloadRecordedCsv() {
  if (recordedRows.length === 0) {
    updateRecordingStatus("No recorded data to download.", "finished");
    return;
  }

  const csvHeader = "time_ms,elapsed_ms,sensor,qw,qx,qy,qz";
  const csvLines = recordedRows.map(function (row) {
    return [
      row.timeMs,
      row.elapsedMs,
      row.sensor,
      row.qw.toFixed(3),
      row.qx.toFixed(3),
      row.qy.toFixed(3),
      row.qz.toFixed(3),
    ].join(",");
  });

  const csvContent = [csvHeader, ...csvLines].join("\n");
  const csvBlob = new Blob([csvContent], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement("a");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  downloadLink.href = csvUrl;
  downloadLink.download = `teacher_bounce_recording_${timestamp}.csv`;
  downloadLink.click();
  URL.revokeObjectURL(csvUrl);

  updateRecordingStatus(
    `Teacher CSV downloaded. ${recordedRows.length} samples saved.`,
    "finished"
  );
}

function downloadStudentCsv() {
  if (exerciseRows.length === 0) {
    setExerciseText(exerciseStatus, "No student data to download.");
    return;
  }

  const csvHeader = "time_ms,elapsed_ms,sensor,qw,qx,qy,qz";
  const csvLines = [];

  exerciseRows.forEach(function (row) {
    csvLines.push([
      row.timeMs,
      row.elapsedMs,
      "THIGH",
      row.thigh.qw.toFixed(6),
      row.thigh.qx.toFixed(6),
      row.thigh.qy.toFixed(6),
      row.thigh.qz.toFixed(6),
    ].join(","));

    csvLines.push([
      row.timeMs,
      row.elapsedMs,
      "SHANK",
      row.shank.qw.toFixed(6),
      row.shank.qx.toFixed(6),
      row.shank.qy.toFixed(6),
      row.shank.qz.toFixed(6),
    ].join(","));
  });

  const csvContent = [csvHeader, ...csvLines].join("\n");
  const csvBlob = new Blob([csvContent], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement("a");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  downloadLink.href = csvUrl;
  downloadLink.download = `student_bounce_recording_${timestamp}.csv`;
  downloadLink.click();
  URL.revokeObjectURL(csvUrl);

  setExerciseText(
    exerciseStatus,
    `Student CSV downloaded. ${exerciseRows.length * 2} sensor samples saved.`
  );
}

function processSensorLine(line, config) {
  const cleanLine = line.trim();

  if (!cleanLine) {
    return;
  }

  const quaternion = parseQuaternionLine(cleanLine, config.dataLabel);

  if (!quaternion) {
    config.dataElement.textContent = `Waiting for ${config.dataLabel} quaternion...\nLast received:\n${cleanLine}`;
    return;
  }

  if (config.dataLabel === "THIGH") {
    latestThighQuaternion = quaternion;
    thighUpdated = true;
  } else if (config.dataLabel === "SHANK") {
    latestShankQuaternion = quaternion;
    shankUpdated = true;
  }

  recordQuaternionSample(config.dataLabel, quaternion);

  if (thighUpdated && shankUpdated) {
    updateStudentExerciseFromSensors();
    thighUpdated = false;
    shankUpdated = false;
  }

  config.dataElement.textContent = formatQuaternionData(
    config.dataLabel,
    quaternion,
    cleanLine
  );
}

function processBleTextChunk(textChunk, config) {
  config.lineBuffer += textChunk;

  while (config.lineBuffer.includes("\n")) {
    const lineEndIndex = config.lineBuffer.indexOf("\n");
    const completeLine = config.lineBuffer.slice(0, lineEndIndex);
    config.lineBuffer = config.lineBuffer.slice(lineEndIndex + 1);
    processSensorLine(completeLine, config);
  }

  return config.lineBuffer;
}

async function connectSensor(config) {
  if (!navigator.bluetooth) {
    setSensorStatus(
      config.statusElement,
      "Web Bluetooth is not supported in this browser",
      "error"
    );
    config.dataElement.textContent = "Use Chrome or Edge on a computer with Bluetooth enabled.";
    return;
  }

  try {
    setSensorStatus(config.statusElement, "Selecting device...", "");

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { name: config.deviceName },
        { namePrefix: config.namePrefix }
      ],
      optionalServices: [uartServiceUuid]
    });

    setSensorStatus(config.statusElement, "Connecting...", "");

    device.addEventListener("gattserverdisconnected", function () {
      setSensorStatus(config.statusElement, "Disconnected", "error");

      if (config.dataLabel === "THIGH") {
        isThighConnected = false;
        latestThighQuaternion = null;
        thighUpdated = false;
      } else if (config.dataLabel === "SHANK") {
        isShankConnected = false;
        latestShankQuaternion = null;
        shankUpdated = false;
      }

      if (isExerciseRunning) {
        stopStudentExercise();
        setExerciseText(exerciseStatus, "Sensor disconnected. Exercise stopped.");
        setExerciseText(exerciseCorrectionCommand, "Reconnect both sensors before starting again.");
        setFeedbackItem(exerciseFlexionFeedback, "");
        setFeedbackItem(exerciseAaFeedback, "");
        setFeedbackItem(exerciseIeFeedback, "");
      }
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(uartServiceUuid);
    const txCharacteristic = await service.getCharacteristic(uartTxCharacteristicUuid);

    await txCharacteristic.startNotifications();

    setSensorStatus(
      config.statusElement,
      `Connected to ${device.name || config.deviceName}`,
      "connected"
    );

    if (config.dataLabel === "THIGH") {
      isThighConnected = true;
      thighUpdated = false;
    } else if (config.dataLabel === "SHANK") {
      isShankConnected = true;
      shankUpdated = false;
    }

    config.dataElement.textContent = `Waiting for ${config.dataLabel} data...`;
    config.lineBuffer = "";

    txCharacteristic.addEventListener("characteristicvaluechanged", function (event) {
      const textChunk = bleTextDecoder.decode(event.target.value);
      config.lineBuffer = processBleTextChunk(textChunk, config);
    });
  } catch (error) {
    setSensorStatus(config.statusElement, "Connection failed", "error");
    config.dataElement.textContent = error.message;
  }
}

if (connectThighButton) {
  connectThighButton.addEventListener("click", function () {
    connectSensor({
      deviceName: "THIGH-B",
      namePrefix: "THIGH",
      dataLabel: "THIGH",
      statusElement: thighStatus,
      dataElement: thighData,
      lineBuffer: thighLineBuffer
    }).then(function () {
      thighLineBuffer = "";
    });
  });
}

if (connectShankButton) {
  connectShankButton.addEventListener("click", function () {
    connectSensor({
      deviceName: "SHANK-B",
      namePrefix: "SHANK",
      dataLabel: "SHANK",
      statusElement: shankStatus,
      dataElement: shankData,
      lineBuffer: shankLineBuffer
    }).then(function () {
      shankLineBuffer = "";
    });
  });
}

if (startRecordingButton) {
  startRecordingButton.addEventListener("click", startRecording);
}

if (stopRecordingButton) {
  stopRecordingButton.addEventListener("click", stopRecording);
}

if (downloadCsvButton) {
  downloadCsvButton.addEventListener("click", downloadRecordedCsv);
}

if (startExerciseButton) {
  startExerciseButton.addEventListener("click", startStudentExercise);
}

if (stopExerciseButton) {
  stopExerciseButton.addEventListener("click", stopStudentExercise);
}

if (downloadStudentCsvButton) {
  downloadStudentCsvButton.addEventListener("click", downloadStudentCsv);
}
