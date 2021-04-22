#include <DigiPotX9Cxxx.h>
DigiPot pot(2,3,4);
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Starting");  
  float voltage;
  
  for (int i=0; i<100; i++) {
    pot.increase(1);
    voltage = 5.0 * analogRead(A0)  / 1024;
    Serial.println(voltage);
    delay(20);
  }
  
  
  for (int i=0; i<100; i++) {
    pot.decrease(1);
    voltage = 5.0 * analogRead(A0) / 1024;
    Serial.println(voltage);
    delay(20);
  }
}
