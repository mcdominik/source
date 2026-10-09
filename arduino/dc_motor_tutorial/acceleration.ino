// Accelerate in 4 steps
// Decelerate in 4 steps


const int ENA = 9;
const int IN1 = 8;
const int IN2 = 7;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // Set forward direction
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

  // Accelerate in 4 steps
  Serial.println("Speed: 25%");
  analogWrite(ENA, 64);
  delay(500);

  Serial.println("Speed: 50%");
  analogWrite(ENA, 128);
  delay(500);

  Serial.println("Speed: 75%");
  analogWrite(ENA, 192);
  delay(500);

  Serial.println("Speed: 100%");
  analogWrite(ENA, 255);
  delay(1000);

  // Decelerate in 4 steps
  Serial.println("Speed: 75%");
  analogWrite(ENA, 192);
  delay(500);

  Serial.println("Speed: 50%");
  analogWrite(ENA, 128);
  delay(500);

  Serial.println("Speed: 25%");
  analogWrite(ENA, 64);
  delay(500);

  Serial.println("Speed: 0%");
  analogWrite(ENA, 0);
  delay(500);
}