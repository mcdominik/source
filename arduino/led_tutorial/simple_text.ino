#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  // x, y
  lcd.setCursor(3, 0);
  lcd.print("SUBSCRIBE");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Seconds: ");
  lcd.print(millis() / 1000);
  delay(1000);
}
