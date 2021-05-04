// UVC Disinfection Microcontroller

// Include Libraries
#include <DigiPotX9Cxxx.h>

// Declare Variables
char inputByte;
double distance = 0.0;
double max_boundary = 0.0;
double min_boundary = 0.0;
double runtime = 0;
bool is_running = false;
long sensor1, inches;
int percent;
bool canceled = false;

// Constant variables
const double max_start_distance = 100;
const double min_start_distance = 1;

#define echoPin 2 // Echo of HC-SR04
#define trigPin 3 // Trig of HC-SR04

DigiPot	pot(6,7,8);

void setup() {
 Serial.begin(9600);
 pinMode(13,OUTPUT);
 pinMode(3,INPUT);
 pinMode(trigPin, OUTPUT);
 pinMode(echoPin, INPUT);
}

// Device waits in idle until start cycle has been received
void loop() {
  while(Serial.available()>0){
    inputByte = Serial.read();
    if(inputByte=='S'){
      run_cycle(); 
    }
  }
}

// Method to start one cleaning cycle
void run_cycle() {
  calculate_distance();
  calculate_boundary();
  Serial.println("checking distance1");
  check_distance();
  Serial.println("Just checked1");
  calculate_runtime();
  
  // Potentiometer Voltage
  float potVoltage;
  // Set Voltage to 5.0 volts -> DIGIPOT_MAX_AMOUNT = 99
  pot.set(14);
  
  Serial.println("isRunning: true");
  Serial.print("runtime:");
  //char rtime[16];
  //itoa(runtime, rtime, 10);
  char rtime[15];
  dtostrf(runtime,5,2,rtime);
  Serial.println(rtime);
  Serial.print("distance: ");
  char dist[15];
  itoa(distance, dist, 10);
  Serial.println(dist);
  is_running = true;

  while(runtime > 0){
    calculate_distance();
    check_distance();
    calculate_percent();
	
    delay(100);
    runtime = runtime - .1;
    if(runtime < 0){
      runtime = 0;
    }
    Serial.print("runtime:");
    char rtime[15];
    dtostrf(runtime,5,2,rtime);
    Serial.println(rtime);
    Serial.print("distance: ");
    dist[15];
    itoa(distance, dist, 10);
    Serial.println(dist);
    Serial.print("percent: ");
    char per[15];
    itoa(percent, per, 10);
    Serial.println(per);
   
    while(Serial.available()>0){
      inputByte = Serial.read();
      if(inputByte=='s'){
        Serial.println("CANCELED");
        runtime = 0;
      }
    }
  }

  // Set Voltage to 0.0 volts
  pot.set(0);

  distance = 0.0;
  max_boundary = 0.0;
  min_boundary = 0.0;
  runtime = 0;
  if(!canceled){
    Serial.println("isRunning: false");
    Serial.print("runtime:");
    rtime[15];
    dtostrf(runtime,5,2,rtime);
    Serial.println(rtime);
    Serial.print("distance: ");
    dist[15];
    itoa(distance, dist, 10);
    Serial.println(dist);
    is_running = false;
  } else {
    canceled = false;
  }
  Serial.flush();
  delay(100);
  loop();
}

// Gets distance from proximity sensor
void calculate_distance() {
  // Clears the trigPin condition
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  double duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance = (duration-10) * 0.034 / 2; // Speed of sound wave divided by 2 (go and back) minus the 10 microsecond delay at the start
}

// Determines the max and min error boundary based on distance
void calculate_boundary(){
  double temp_dist = distance/sqrt(2);
  if(temp_dist + 1 > distance){
    min_boundary = 1;
  } else {
    min_boundary = distance - temp_dist;
  }
  max_boundary = distance + temp_dist;
}

// Method to show boundary as percentage
void calculate_percent() {
    percent = ((distance - min_boundary) / (max_boundary - min_boundary)) * 100;
}

void calculate_runtime() {
  double base_dist = 1;
  double base_intensity = 300;
  double new_intensity = distance/base_dist;
  runtime = 5/new_intensity;
  runtime += 5;
}

// Checks for validity of distance
void check_distance(){
  if(distance > max_start_distance || distance < min_start_distance){
    Serial.println("isRunning: false");
    if(distance > max_start_distance){
      Serial.println("status: startingtoofar");
    } else {
      Serial.println("status: startingtooclose");
    }
    canceled = true;
    distance = 0.0;
    max_boundary = 0.0;
    min_boundary = 0.0;
    if(is_running == true){
      digitalWrite(13,LOW);
      runtime = 0;
      is_running = false;
    }
    Serial.flush();
    delay(100);
    loop();
  } else if (is_running == true) {
    if(distance > max_boundary || distance < min_boundary){
      Serial.println("isRunning: false");
      if(distance > max_boundary){
        Serial.println("status: runningtoofar");
      } else {
        Serial.println("status: runningtooclose");
      }
      canceled = true;
      digitalWrite(13,LOW);
      distance = 0.0;
      max_boundary = 0.0;
      min_boundary = 0.0;
      runtime = 0;
      is_running = false;
      Serial.flush();
      delay(100);
      loop();
    }
  }
}
