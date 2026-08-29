#include <bluefruit.h>

void setup() {
  Serial.begin(115200);
  delay(500);

  Bluefruit.begin();
  Bluefruit.setName("TEST_IMU");

  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.ScanResponse.addName();

  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);
  Bluefruit.Advertising.setFastTimeout(30);
  Bluefruit.Advertising.start(0);

  Serial.println("Advertising as TEST_IMU");
}

void loop() {
}
