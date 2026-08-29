# Wiring

Each BNO085 IMU is connected to one Adafruit Feather nRF52840 using I2C.

The same wiring is used for both the THIGH and SHANK nodes.

## 1. Before Wiring

Before connecting the STEMMA QT / Qwiic JST SH 4-pin cable:

1. Make sure the required pin headers have already been soldered onto the Feather boards.
2. Inspect the solder joints.
3. Make sure adjacent pins are not accidentally bridged by solder.
4. Disconnect power while making or changing the cable connections.

## 2. BNO085 to Feather nRF52840 I2C Connections

Use one STEMMA QT / Qwiic JST SH 4-pin Cable with Premium Female Sockets for each sensor node.

| Wire Color | BNO085 Pin | Feather nRF52840 Pin | Function |
|---|---|---|---|
| Red | VIN | 3V | Power |
| Black | GND | GND | Ground |
| Yellow | SCL | SCL | I2C clock |
| Blue | SDA | SDA | I2C data |

Connection summary:

BNO085 VIN  -- red wire --> Feather 3V
BNO085 GND  -- black wire --> Feather GND
BNO085 SCL  -- yellow wire --> Feather SCL
BNO085 SDA  -- blue wire --> Feather SDA

Do not swap SDA and SCL.

## 3. Initial Connection Test

After wiring one node:

1. Connect the Feather to the computer by USB.
2. Upload the corresponding firmware.
3. Open Serial Monitor at 115200 baud.
4. Confirm that the BNO085 is detected.
5. Confirm that quaternion values are being produced.
6. Move the sensor gently and check that the quaternion values change.

Repeat the same process for the second node.

## 4. Reference

The official Adafruit BNO085 guide shows the same I2C wiring:

- VIN: red wire to board 3V
- GND: black wire to board GND
- SCL: yellow wire to board SCL
- SDA: blue wire to board SDA

Official guide:
https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085
