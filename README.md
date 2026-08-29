# IMU-Based 3D Knee Angle Feedback System for Learning Dance Bounce Movement

## Overview

This project is a wearable feedback system for dance bounce training.

Two wearable IMU nodes are used:

- `THIGH-B` on the thigh
- `SHANK-B` on the shank

Each node uses:

- Adafruit Feather nRF52840
- BNO085 IMU
- 3.7 V 500 mAh LiPo battery

The two sensors send quaternion data through Bluetooth Low Energy (BLE) to a browser-based Web application.

The Web application:

- connects to both BLE devices;
- receives and reconstructs quaternion data;
- pairs fresh THIGH and SHANK samples;
- performs a 2-second neutral standing calibration;
- estimates Flexion / Extension, Abduction / Adduction, and Internal / External Rotation;
- records a teacher reference;
- compares student movement with the teacher reference;
- gives direct text feedback;
- exports teacher and student CSV data.

---
# Repository Structure
```

dance-imu-feedback/
│
├── README.md
│
├── firmware/
│   ├── bluetooth_test/
│   │   └── BLEtest_bno085_ble/
│   │       └── BLEtest_bno085_ble.ino
│   ├── thigh/
│   │   └── thigh_bno085_ble/
│   │       └── thigh_bno085_ble.ino
│   └── shank/
│       └── shank_bno085_ble/
│           └── shank_bno085_ble.ino
│
├── hardware/
│   ├── hardware_list.md
│   ├── wiring.md
│   ├── sensor_placement.md
│   └── images/
│
└── web/
    └── assets/
        ├── images/
        ├── videos/
        └── code/
            ├── index.html
            ├── style.css
            └── app.js

```

# Before You Start

Read the hardware documents first:

1. `hardware/hardware_list.md`
   - required electronic components;
   - soldering tools;
   - wearable mounting materials;
   - hardware preparation order.

2. `hardware/wiring.md`
   - BNO085-to-Feather I2C wiring;
   - wire colors;
   - initial connection test.

3. `hardware/sensor_placement.md`
   - THIGH and SHANK placement;
   - sensor orientation;
   - wearable assembly;
   - 2-second calibration requirements.

```

# Required Software

Install:

- Arduino IDE
- Google Chrome
- Python 3

Arduino requirements:

- Adafruit nRF52 board support
- Bluefruit nRF52 library
- Adafruit BNO08x library

---

# Step 1. Build the Two Wearable Sensor Nodes

Prepare two nodes:

- one THIGH node;
- one SHANK node.

Before wiring the BNO085:

1. Solder the required pin headers onto the Feather boards.
2. Inspect the solder joints.
3. Make sure adjacent pins are not bridged by solder.
4. Connect the BNO085 to the Feather using I2C.

Use the wiring in:

hardware/wiring.md

The I2C connections are:

| Wire Color | BNO085 | Feather nRF52840 |
|---|---|---|
| Red | VIN | 3V |
| Black | GND | GND |
| Yellow | SCL | SCL |
| Blue | SDA | SDA |

Use USB power first during firmware upload and testing.

After the electronics are confirmed to work, use the 3.7 V 500 mAh LiPo battery for the final wearable setup.

Note: It is recommended to clearly label the two sensor nodes so they can be easily identified during setup. For example, in this project, a sticker was placed on the THIGH node to distinguish it from the SHANK node.

---

# Step 2. Test Basic Bluetooth Advertising

Before using the full sensor firmware, verify that the Feather nRF52840 can advertise over BLE.

Open:

firmware/bluetooth_test/BLEtest_bno085_ble/BLEtest_bno085_ble.ino

In Arduino IDE:

1. Connect the Feather nRF52840 to the computer through USB.
2. Select the correct Feather nRF52840 board.
3. Select the correct serial port.
4. Upload the sketch.
5. Open Serial Monitor.
6. Set the baud rate to `115200`.

Expected Serial Monitor output:

Advertising as TEST_IMU

Use Bluefruit Connect or another BLE scanner.

Confirm that the device:

TEST_IMU

appears.

If `TEST_IMU` does not appear, fix the BLE setup before continuing.

---

# Step 3. Upload the THIGH Firmware

Open:

firmware/thigh/thigh_bno085_ble/thigh_bno085_ble.ino

Connect the Feather that will be used as the THIGH node.

Upload the firmware.

The BLE device name is:

THIGH-B

Expected quaternion output format:

THIGH,0.934,0.179,0.110,0.290

Open Serial Monitor at `115200` baud and confirm that the quaternion values update when the sensor moves.

---

# Step 4. Upload the SHANK Firmware

Open:

firmware/shank/shank_bno085_ble/shank_bno085_ble.ino

Connect the Feather that will be used as the SHANK node.

Upload the firmware.

The BLE device name is:

SHANK-B

Expected quaternion output format:

SHANK,0.680,0.149,0.688,-0.205

Open Serial Monitor at `115200` baud and confirm that the quaternion values update when the sensor moves.

---

# Step 5. Verify BLE Data Transmission

Before opening the Web application, test both devices using Bluefruit Connect.

Confirm that:

- both devices can be discovered;
- THIGH and SHANK can be distinguished;
- BLE UART is available;
- quaternion data is received while connected;
- both devices can reconnect after reset.

---

# Step 6. Assemble the Wearable Mounting

After the electronics are working:

1. Arrange the components on the flexible plastic sheet from left to right as Feather nRF52840, LiPo battery, and BNO085 IMU.
2. Keep the BNO085 Y-axis pointing upward.
3. Make small holes in the plastic sheet and use plastic-coated flexible twist wire to secure the Feather and BNO085.
4. Fix the battery directly onto the plastic sheet with adhesive tape.
5. Cut one rectangular slot on each side of the plastic sheet.
6. Pass the adjustable elastic strap through the right slot, underneath the node, and out through the left slot.
7. Wrap the strap around the leg and adjust the tightness so the node is secure but comfortable.

See:

hardware/sensor_placement.md

---

# Step 7. Wear the Sensors

This project uses a single-leg configuration with two wearable sensor nodes.

For the prototype developed in this project, the sensors were worn on the right leg. However, either leg can be used as long as the teacher reference and student test use the same side.

Attach:

- THIGH-B to the thigh;
- SHANK-B to the shank.

The BNO085 component side should face outward, away from the leg, with the Y-axis pointing upward.

Keep the THIGH and SHANK sensor orientations consistent.

The nodes must remain firmly fixed during calibration and movement.

Do not reposition the sensors after calibration.

For future bilateral implementation, two sensor nodes can be used on each leg, for a total of four wearable sensor nodes.

---

# Step 8. Start the Web Application

Open Terminal.

Go to the Web application folder:

cd ~/Desktop/dance-imu-feedback/web/assets/code

Start a local HTTP server:

python3 -m http.server 5500

Open Google Chrome.

Go to:

http://localhost:5500/index.html

Use Google Chrome because the application uses Web Bluetooth.

---

# Step 9. Connect THIGH-B and SHANK-B

On the Web page:

1. Click `Connect THIGH-B`.
2. Select `THIGH-B` from the browser BLE device list.
3. Confirm that THIGH quaternion values appear.

Then:

1. Click `Connect SHANK-B`.
2. Select `SHANK-B`.
3. Confirm that SHANK quaternion values appear.

Note:
If one or both sensors can connect to the web application but no data is displayed, press the reset button on the affected sensor node.

---

# Step 10. Record the Teacher Reference

Go to the Teacher Data Recording section.

1. Make sure both sensors are connected.
2. Click `Start Teacher Recording`.
3. Perform the teacher bounce movement.
4. Record 3 bounce repetitions.

The system stores the teacher FE / AA / IE reference.

The lowest point of each bounce is identified using maximum Flexion / Extension.

The saved teacher reference is used later for student comparison.

---

# Step 11. Start the Student Exercise

Click:

Start Exercise

Then stand straight and remain still for 2 seconds.

This is the neutral standing calibration.

The system records the initial thigh-to-shank orientation and uses it as the local reference.

Do not move during calibration.

---

# Step 12. Perform the Bounce Exercise

After calibration:

1. Follow the Web application instructions.
2. Perform 3 rounds.
3. Perform 3 bounce repetitions in each round.

The system continuously:

- receives THIGH and SHANK quaternion data;
- waits for fresh data from both nodes;
- calculates the relative thigh-to-shank orientation;
- estimates FE, AA, and IE;
- detects the lowest point of the bounce;
- compares the student movement with the teacher reference.

Prototype tolerances:

- FE: ±3°
- AA: ±1.5°
- IE: ±1.5°

---

# Step 13. Read the Feedback

At the detected lowest point, the Web application gives direct correction feedback.

Examples include:
```
Bend more
Bend less
Move your knee in
Move your knee out
Rotate your lower leg in
Rotate your lower leg out
```

Use the feedback to adjust the next repetition.

---

# Step 14. Finish the Exercise

After all 3 rounds are complete, the Web application shows a final movement summary.

The summary reflects the dominant movement difference observed across the exercise.

---

# Step 15. Export Data

Use the download controls in the Web application to export:

- Teacher CSV
- Student CSV

The CSV files contain recorded IMU quaternion data for later analysis.

---

# Troubleshooting

## BNO085 is not detected

Check:

- pin headers are soldered correctly;
- solder joints are not bridged;
- red wire: VIN to 3V;
- black wire: GND to GND;
- yellow wire: SCL to SCL;
- blue wire: SDA to SDA;
- the STEMMA QT / Qwiic cable is firmly connected.

## TEST_IMU does not appear

Check:

- Feather power;
- correct board and serial port;
- BLE test firmware was uploaded;
- Bluetooth is enabled on the scanning device.

## THIGH-B or SHANK-B does not appear

Check:

- correct firmware was uploaded to each node;
- the node is powered;
- the board has not stalled;
- restart or reset the board if needed.

## Quaternion values do not update

Check:

- BNO085 connection;
- I2C wiring;
- Serial Monitor output;
- reset the Feather if the IMU stops updating.

## Web page does not receive data

Check:

- Chrome is being used;
- the page was opened through the local HTTP server;
- THIGH-B is connected;
- SHANK-B is connected;
- both sensor values are updating.

## Sensor moves during exercise

Stop the exercise.

Secure the node again and repeat the 2-second standing calibration before continuing.

---

# Hardware Reference

BNO085 official guide:

https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085

The official guide includes the BNO085 I2C wiring diagram and pin descriptions.

---

# Final System Flow

Solder pin headers
        ↓
Connect BNO085 to Feather
        ↓ 
Test BLE advertising
        ↓
Upload THIGH firmware
        ↓
Upload SHANK firmware
        ↓
Verify quaternion output
        ↓
Verify BLE UART data
        ↓
Assemble wearable nodes
        ↓
Wear THIGH and SHANK sensors
        ↓
Start Web application
        ↓
Connect THIGH-B and SHANK-B
        ↓
Record teacher reference
        ↓
2-second standing calibration
        ↓
3 rounds × 3 bounces
        ↓
Receive movement feedback
        ↓
View final summary
        ↓
Export CSV data
