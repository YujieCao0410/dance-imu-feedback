#include <bluefruit.h>
#include <Adafruit_BNO08x.h>

#define BNO08X_RESET -1

Adafruit_BNO08x bno08x(BNO08X_RESET);
sh2_SensorValue_t sensorValue;

BLEUart bleuart;

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("SHANK-B BLE + BNO085");

  Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);

  Bluefruit.begin();
  Bluefruit.setTxPower(4);
  Bluefruit.setName("SHANK-B");

  bleuart.begin();

  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.Advertising.addService(bleuart);
  Bluefruit.ScanResponse.addName();

  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);
  Bluefruit.Advertising.setFastTimeout(30);
  Bluefruit.Advertising.start(0);

  Serial.println("BLE UART advertising as SHANK-B");

  if (!bno08x.begin_I2C()) {
    Serial.println("Failed to find BNO08x chip");
    while (1) {
      delay(10);
    }
  }

  Serial.println("BNO08x Found!");

  setReports();

  Serial.println("Sending SHANK quaternion over BLE");
}

void setReports() {
  Serial.println("Setting desired reports");

  if (!bno08x.enableReport(SH2_GAME_ROTATION_VECTOR)) {
    Serial.println("Could not enable game rotation vector");
  }
}

void loop() {
  delay(100);

  if (bno08x.wasReset()) {
    Serial.println("Sensor was reset");
    setReports();
  }

  if (!bno08x.getSensorEvent(&sensorValue)) {
    return;
  }

  if (sensorValue.sensorId == SH2_GAME_ROTATION_VECTOR) {
    float r = sensorValue.un.gameRotationVector.real;
    float i = sensorValue.un.gameRotationVector.i;
    float j = sensorValue.un.gameRotationVector.j;
    float k = sensorValue.un.gameRotationVector.k;

    char dataLine[60];

    snprintf(
      dataLine,
      sizeof(dataLine),
      "SHANK,%.3f,%.3f,%.3f,%.3f\n",
      r,
      i,
      j,
      k
    );

    Serial.print(dataLine);

    if (Bluefruit.connected()) {
      bleuart.print(dataLine);
    }
  }
}
