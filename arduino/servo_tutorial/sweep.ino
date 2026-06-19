#include <Servo.h>

Servo myServo;  // Create a servo object
int pos = 0;    // Variable to store the servo position

void setup() {
  myServo.attach(9);  // Attaches the servo on pin 9
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (pos = 0; pos <= 180; pos += 1) {
    myServo.write(pos);              // Update servo position
    delay(15);                       // Give the gears time to catch up
  }
  
  // Sweep back from 180 to 0 degrees
  for (pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);              // Update servo position
    delay(15);                       // Give the gears time to catch up
  }
}