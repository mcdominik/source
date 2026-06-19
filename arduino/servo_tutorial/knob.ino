#include <Servo.h>

Servo myServo;  // Create a servo object

const int potPin = A0;  // Analog pin connected to potentiometer
int val;                // Variable to read the value

void setup() {
  myServo.attach(9);    // Attaches the servo on pin 9
}

void loop() {
  val = analogRead(potPin);            // Read potentiometer (0 to 1023)
  val = map(val, 0, 1023, 0, 180);     // Map the 10-bit analog range to angles (0 to 180)
  myServo.write(val);                  // Write the position to the servo
  delay(15);                           // Delay to let the servo move
}