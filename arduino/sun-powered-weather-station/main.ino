/*
 * Arduino Nano 33 BLE Sense — Environmental BLE Broadcaster
 * Sensors : HTS221 (temp + humidity) · LPS22HB (pressure)
 * Protocol: Bluetooth LE — Environmental Sensing Service (0x181A)
 * Power    : Optimised for LiPo (nRF52840 low-power sleep between samples)
 *
 * Required libraries (install via Library Manager):
 * - ArduinoBLE      >= 1.3.6
 * - Arduino_HTS221  >= 1.0.0
 * - Arduino_LPS22HB >= 1.0.1
 *
 * Wiring: Nothing extra needed — all sensors are on-board.
 *
 * BLE characteristics (notify + read):
 * Temperature  0x2A6E  int16   resolution 0.01 °C   (value / 100.0)
 * Humidity     0x2A6F  uint16  resolution 0.01 %RH  (value / 100.0)
 * Pressure     0x2A6D  uint32  resolution 0.1  Pa   (value / 10.0 → hPa * 100)
 *
 */
 #define SERIAL_DEBUG
 #include <ArduinoBLE.h>
 #include <Arduino_HTS221.h>
 #include <Arduino_LPS22HB.h>
 #include <mbed.h>           // rtos::ThisThread for efficient sleep
 
 // ─── User-tunable constants ───────────────────────────────────────────────────
 
 // How often sensor readings are taken and pushed to BLE characteristics (ms).
 static constexpr uint32_t READ_INTERVAL_MS = 10000;
 
 // BLE advertising interval in milliseconds.
 static constexpr uint16_t ADV_INTERVAL_MS = 160;

 static constexpr char DEVICE_NAME[] = "EnvSensor";
 
 // Send BLE notifications only when a central is actively connected.
 static constexpr bool USE_NOTIFICATIONS = true;
 
 // ─── BLE service & characteristics ───────────────────────────────────────────
 
 // Standard GATT Environmental Sensing Service
 BLEService envService("181A");
 
 // Standard GATT characteristic UUIDs
 BLEShortCharacteristic  tempChar ("2A6E", BLERead | BLENotify);  // int16, 0.01 °C
 BLEUnsignedShortCharacteristic humChar  ("2A6F", BLERead | BLENotify);  // uint16, 0.01 %RH
 BLEUnsignedIntCharacteristic   pressChar("2A6D", BLERead | BLENotify);  // uint32, 0.1 Pa
 
 // ─── State ────────────────────────────────────────────────────────────────────
 
 static uint32_t lastReadMs = 0;
 static bool     sensorsOk  = false;
 
 // ─── Helpers ─────────────────────────────────────────────────────────────────
 
 // Encode temperature to int16 per GATT spec (unit = 0.01 °C, range −327.68..327.67 °C)
 static inline int16_t encodeTempC(float t) {
   return static_cast<int16_t>(t * 100.0f);
 }
 
 // Encode humidity to uint16 per GATT spec (unit = 0.01 %, range 0..655.35 %)
 static inline uint16_t encodeHumPct(float h) {
   return static_cast<uint16_t>(h * 100.0f);
 }
 
 // Encode pressure to uint32 per GATT spec (unit = 0.1 Pa; hPa → Pa * 10)
 static inline uint32_t encodePressPa(float hpa) {
   return static_cast<uint32_t>(hpa * 1000.0f);  // hPa * 100 (Pa) * 10 = hPa * 1000
 }
 
 // Low-power CPU sleep: lets the nRF52840 idle in WFI / low-power state.
 // The BLE stack and RTC continue running in the background.
 static inline void lowPowerDelay(uint32_t ms) {
   rtos::ThisThread::sleep_for(ms);
 }
 
 // Turn off the on-board RGB LED to save ~1–3 mA.
 static void ledOff() {
   pinMode(LEDR, OUTPUT); digitalWrite(LEDR, HIGH);
   pinMode(LEDG, OUTPUT); digitalWrite(LEDG, HIGH);
   pinMode(LEDB, OUTPUT); digitalWrite(LEDB, HIGH);
 }
 
 // Brief green flash to signal a successful reading (optional visual feedback).
 static void flashGreen() {
   digitalWrite(LEDG, LOW);
   lowPowerDelay(30);
   digitalWrite(LEDG, HIGH);
 }
 
 // ─── Setup ────────────────────────────────────────────────────────────────────
 
 void setup() {
   ledOff();
 
   // Serial for debug — disable in production
 #ifdef SERIAL_DEBUG
   Serial.begin(115200);
   Serial.println("[boot] Serial ready");
 #endif
 
   // ── Sensor init ────────────────────────────────────────────────────────────
   if (!HTS.begin()) {
 #ifdef SERIAL_DEBUG
     Serial.println("[ERROR] HTS221 init failed");
 #endif
     // Blink red to signal sensor failure, then hang
     while (true) {
       digitalWrite(LEDR, LOW);  lowPowerDelay(200);
       digitalWrite(LEDR, HIGH); lowPowerDelay(200);
     }
   }
 
   if (!BARO.begin()) {
 #ifdef SERIAL_DEBUG
     Serial.println("[ERROR] LPS22HB init failed");
 #endif
     while (true) {
       digitalWrite(LEDR, LOW);  lowPowerDelay(400);
       digitalWrite(LEDR, HIGH); lowPowerDelay(400);
     }
   }
 
   sensorsOk = true;
 #ifdef SERIAL_DEBUG
   Serial.println("[boot] Sensors OK");
 #endif
 
   // ── BLE init ───────────────────────────────────────────────────────────────
   if (!BLE.begin()) {
 #ifdef SERIAL_DEBUG
     Serial.println("[ERROR] BLE init failed");
 #endif
     while (true) lowPowerDelay(1000);
   }
 
   BLE.setLocalName(DEVICE_NAME);
   BLE.setDeviceName(DEVICE_NAME);
 
   // Advertise only the Environmental Sensing Service UUID so hubs can filter
   BLE.setAdvertisedService(envService);
 
   // Set advertising interval (unit: 0.625 ms steps; convert from ms)
   uint16_t advSlots = static_cast<uint16_t>(ADV_INTERVAL_MS * 8 / 5);
   BLE.setAdvertisingInterval(advSlots);
 
   // Build service
   envService.addCharacteristic(tempChar);
   envService.addCharacteristic(humChar);
   envService.addCharacteristic(pressChar);
   BLE.addService(envService);
 
   // Seed characteristics with an initial reading before advertising
   readAndUpdateCharacteristics();
 
   BLE.advertise();
 
 #ifdef SERIAL_DEBUG
   Serial.print("[BLE] Advertising as: ");
   Serial.println(DEVICE_NAME);
 #endif
 }
 
 // ─── Main loop ────────────────────────────────────────────────────────────────
 
 void loop() {
   BLEDevice central = BLE.central();
 
   if (central && central.connected()) {
     // Connected — poll frequently to service ATT requests, but still sleep
     // between reads to keep average current low.
     handleConnected(central);
   } else {
     // Advertising with no connection — sleep until next measurement
     uint32_t now = millis();
     if (now - lastReadMs >= READ_INTERVAL_MS) {
       readAndUpdateCharacteristics();
     }
     // WFI sleep: CPU halts, nRF52840 SoftDevice keeps radio ticking
     lowPowerDelay(1000);
   }
 }
 
 // ─── Connected-mode handler ───────────────────────────────────────────────────
 
 void handleConnected(BLEDevice& central) {
 #ifdef SERIAL_DEBUG
   Serial.print("[BLE] Central connected: ");
   Serial.println(central.address());
 #endif
 
   while (central.connected()) {
     uint32_t now = millis();
     if (now - lastReadMs >= READ_INTERVAL_MS) {
       readAndUpdateCharacteristics();
     }
     lowPowerDelay(50);
   }
 
 #ifdef SERIAL_DEBUG
   Serial.println("[BLE] Central disconnected — resuming advertising");
 #endif
 }
  
 void readAndUpdateCharacteristics() {
   if (!sensorsOk) return;
 
   float tempC  = HTS.readTemperature();
   float humPct = HTS.readHumidity();
   float hpa    = BARO.readPressure() * 10.0f;
 
   // Sanity-check: reject obviously invalid readings (sensor glitches)
   if (tempC  < -40.0f || tempC  > 125.0f) return;
   if (humPct <   0.0f || humPct > 100.0f) return;
   if (hpa    < 300.0f || hpa    > 1100.0f) return;
 
   int16_t  encT = encodeTempC(tempC);
   uint16_t encH = encodeHumPct(humPct);
   uint32_t encP = encodePressPa(hpa);
 
   // writeValue() automatically sends a notification if a central is subscribed
   tempChar.writeValue(encT);
   humChar.writeValue(encH);
   pressChar.writeValue(encP);
 
   lastReadMs = millis();
   flashGreen();
 
 #ifdef SERIAL_DEBUG
   Serial.print("[data] T="); Serial.print(tempC,  1); Serial.print(" °C  ");
   Serial.print("H=");        Serial.print(humPct, 1); Serial.print(" %  ");
   Serial.print("P=");        Serial.print(hpa,    2); Serial.println(" hPa");
 #endif
 }