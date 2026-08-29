# Sensor Placement and Wearable Assembly

The system uses two wearable sensor nodes on the right leg:

- THIGH node: mounted on the thigh
- SHANK node: mounted on the shank

Stable and consistent placement is important because movement of the sensor relative to the leg can change the measured orientation.

## 1. Assemble the Wearable Node

For each node:

1. Arrange the components on the flexible plastic sheet from left to right as Feather nRF52840, LiPo battery, and BNO085 IMU. Keep the BNO085 Y-axis pointing upward.
2. Make small holes in the sheet around the boards and use plastic-coated flexible twist wire through the holes to secure the Feather and BNO085 firmly in place.
3. Fix the LiPo battery directly onto the plastic sheet with adhesive tape.
4. Use scissors to cut one rectangular slot on each side of the plastic sheet.
5. Pass the adjustable elastic strap through the right slot, underneath the complete sensor node, and out through the left slot.
6. Wrap the strap around the leg and adjust the tightness so the node is secure but comfortable.
7. Check that the boards, battery, and connecting cable cannot move before starting the exercise.

## 2. THIGH Node Placement

Attach the THIGH node securely to the thigh.

The BNO085 board should be positioned with its component side facing outward, away from the leg, and with the Y-axis pointing upward.

The node should not slide, rotate, or loosen during movement.

## 3. SHANK Node Placement

Attach the SHANK node securely to the shank.

The BNO085 board should also be positioned with its component side facing outward, away from the leg, and with the Y-axis pointing upward.

Use the same general orientation convention as the THIGH node.

## 4. Placement Consistency

For each recording or training session:

- place the THIGH sensor at a consistent location on the thigh;
- place the SHANK sensor at a consistent location on the shank;
- keep the sensor orientation consistent;
- tighten the elastic straps enough to prevent movement without making them unnecessarily uncomfortable;
- do not reposition either sensor after calibration.

## 5. Calibration

After both nodes are secured:

1. Connect both sensors to the Web application.
2. Start the student exercise.
3. Stand straight and remain still for 2 seconds.
4. The system records the neutral thigh-to-shank orientation.
5. Begin the bounce exercise only after calibration is complete.

If a sensor moves or is repositioned after calibration, stop the exercise, secure the sensor again, and repeat the calibration.

## 6. Why Secure Attachment Matters

The prototype originally experienced attachment problems during movement. A loose sensor can change its orientation relative to the body segment and reduce the consistency of the knee-angle estimate.

For this reason, each node is arranged from left to right as Feather nRF52840, LiPo battery, and BNO085 IMU; the Feather and BNO085 are secured with plastic-coated flexible twist wire, the battery is fixed with adhesive tape, and an adjustable elastic strap holds the complete node firmly against the leg.
