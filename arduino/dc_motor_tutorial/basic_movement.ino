// forward at full speed
// stop
// reverse at full speed
// stop

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
  Serial.println("Forward - full speed");
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 255); // 0 - 255
  delay(3000);

  Serial.println("Stop");
  analogWrite(ENA, 0);
  delay(300);

  Serial.println("Reverse - full speed");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 255);
  delay(3000);

  Serial.println("Stop");
  analogWrite(ENA, 0);
  delay(300);
}