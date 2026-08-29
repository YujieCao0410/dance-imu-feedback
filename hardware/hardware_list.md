# Hardware List

This project uses two wearable sensor nodes: one on the thigh and one on the shank. Each node includes an Adafruit Feather nRF52840, BNO085 IMU, 3.7 V 500 mAh LiPo battery, STEMMA QT / Qwiic JST SH 4-pin cable, and wearable mounting materials.

## 1. Electronic Components

| Component | Quantity | Purpose |
|---|---:|---|
| Adafruit Feather nRF52840 | 2 | Microcontroller and BLE communication |
| BNO085 IMU | 2 | Measures orientation and provides quaternion data |
| Lithium Ion Polymer Battery - 3.7 V 500 mAh | 2 | Powers the final wearable sensor nodes |
| USB cable | 2 | Programming, debugging, testing, and charging |
| STEMMA QT / Qwiic JST SH 4-pin Cable with Premium Female Sockets | 2 | Connects each BNO085 IMU to its Feather nRF52840 through the I2C interface |
| Pin headers | As required | Provides soldered connection points for the boards |

## 2. Soldering Tools and Materials

Pin headers must be soldered onto the Feather boards before wiring.

| Tool / Material | Quantity | Purpose |
|---|---:|---|
| Soldering iron | 1 | Soldering pin headers onto the boards |
| Solder | As required | Creates the solder joints |
| Soldering iron stand | 1 | Safely holds the hot soldering iron |
| Cleaning sponge | 1 | Cleans the soldering-iron tip |

## 3. Wearable Mounting Materials

| Material | Quantity | Purpose |
|---|---:|---|
| Flexible plastic sheet | 2 | Base for mounting the electronics |
| Adhesive tape | As required | Fixes the battery onto the plastic sheet |
| Plastic-coated flexible twist wire | As required | Passes through small holes in the plastic sheet to secure the Feather and BNO085 in place |
| Adjustable elastic strap | 2 | Passes through rectangular slots in the plastic sheet and secures each node to the leg |
| Scissors | 1 | Cuts the rectangular slots in the plastic sheet for the elastic strap |

## 4. Final Sensor Node

Each THIGH or SHANK node contains:

- 1 × Adafruit Feather nRF52840
- 1 × BNO085 IMU
- 1 × Lithium Ion Polymer Battery - 3.7 V 500 mAh
- 1 × STEMMA QT / Qwiic JST SH 4-pin Cable with Premium Female Sockets
- pin headers
- flexible plastic sheet
- adhesive tape
- plastic-coated flexible twist wire
- 1 × adjustable elastic strap
- scissors for preparing the plastic sheet

## 5. Hardware Preparation Order

1. Solder the pin headers onto the Feather nRF52840.
2. Connect the BNO085 to the Feather using the STEMMA QT / Qwiic JST SH 4-pin Cable with Premium Female Sockets and I2C wiring.
3. Use USB for firmware upload and testing.
4. Connect the Lithium Ion Polymer Battery - 3.7 V 500 mAh after testing.
5. Place the Feather and BNO085 on the flexible plastic sheet with the BNO085 Y-axis pointing upward. Make small holes in the sheet and use plastic-coated flexible twist wire through the holes to secure both boards.
6. Fix the battery directly onto the plastic sheet with adhesive tape.
7. Use scissors to cut one rectangular slot on each side of the plastic sheet.
8. Pass the adjustable elastic strap through the right slot, underneath the complete sensor node, and out through the left slot.
9. Wrap the strap around the leg and adjust the tightness to secure the node in place.

## 6. Battery Note

The battery can remain connected while the Feather is connected to USB for charging.
