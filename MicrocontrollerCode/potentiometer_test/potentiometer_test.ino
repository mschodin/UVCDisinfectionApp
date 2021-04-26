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
  
  pot.set(50);
  
}
