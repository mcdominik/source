#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Define Custom Characters ---
// Use a 5x8 pixel map. You can find online generators for this.
byte heart[8] = {
  B00000,
  B01010,
  B11111,
  B11111,
  B01110,
  B00100,
  B00000,
  B00000
};

byte smiley[8] = {
  B00000,
  B01010,
  B01010,
  B00000,
  B10001,
  B01110,
  B00000,
  B00000
};


void setup() {
  lcd.init();
  lcd.backlight();

  // Create custom characters
  lcd.createChar(0, heart);
  lcd.createChar(1, smiley);

  lcd.setCursor(3, 0);
  lcd.print("HELLO LCD");
}

void loop() {
  // Show heart
  lcd.setCursor(6, 1);
  lcd.write(0);
  lcd.write(0);
  lcd.write(0);

  delay(2000);

  // Show smiley
  lcd.setCursor(6, 1);
  lcd.write(1);
  lcd.write(1);
  lcd.write(1);

  delay(1500);
}
