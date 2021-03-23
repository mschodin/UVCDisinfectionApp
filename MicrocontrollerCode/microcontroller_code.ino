// UVC Disinfection Microcontroller

// Declare Variables
char inputByte;
double distance = 0.0;
double max_boundary = 0.0;
double min_boundary = 0.0;
int runtime = 0;
bool is_running = false;

// Constant variables
const double max_start_distance = 10;
const double min_start_distance = 1;


void setup() {
 Serial.begin(9600);
 pinMode(13,OUTPUT);
}

// Device waits in idle until start cycle has been received
void loop() {
  while(Serial.available()>0){
    //inputByte= Serial.read();
    //Serial.println(inputByte);
    //if (inputByte=='Z'){
    //  digitalWrite(13,HIGH);
    //}
    //else if (inputByte=='z'){
    //  digitalWrite(13,LOW);
    //}
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
  check_distance();
  calculate_runtime();
  // TODO: Send runtime, starting boolean, distance, max boundary, min boundary to app
  is_running = true;

  // TODO: Turn on LEDs, digital write 13 high is for example, this is where we implement LED driver logic
  digitalWrite(13,HIGH);

  while(runtime > 0){
    // TODO: implement logic to read input byte and check for cancel cycle
    
    calculate_distance();
    // TODO: Send distance to app
    check_distance();
    delay(1000);
    runtime--;
  }

  // TODO: Turn off LEDs, digital write 13 low is for example, this is where we implement LED driver logic
  digitalWrite(13,LOW);

  distance = 0.0;
  max_boundary = 0.0;
  min_boundary = 0.0;
  runtime = 0;
  is_running = false;
  loop();
}

// Gets distance from proximity sensor
void calculate_distance() {
  // TODO: Implement this function properly
  distance = 2;
}

// Determines the max and min error boundary based on distance
void calculate_boundary(){
  // TODO: Implement this function properly
  max_boundary = 3;
  min_boundary = 1;
}

void calculate_runtime() {
  // TODO: Implement this function properly
  runtime = 5;
}

// Checks for validity of distance
void check_distance(){
  if(distance > max_start_distance || distance < min_start_distance){
    if(distance > max_start_distance){
      // TODO: Send message to App that device is too far
    } else {
      // TODO: Send message to App that device is too close
    }
    distance = 0.0;
    max_boundary = 0.0;
    min_boundary = 0.0;
    if(is_running == true){
      digitalWrite(13,LOW);
      runtime = 0;
      is_running = false;
    }
    loop();
  } else if (is_running == true) {
    if(distance > max_boundary || distance < min_boundary){
      if(distance > max_boundary){
        // TODO: Send message to App that device moved too far
      } else {
        // TODO: Send message to App that device moved too close
      }
      digitalWrite(13,LOW);
      distance = 0.0;
      max_boundary = 0.0;
      min_boundary = 0.0;
      runtime = 0;
      is_running = false;
      // TODO: Send canceled info to app
      loop();
    }
  }
}
