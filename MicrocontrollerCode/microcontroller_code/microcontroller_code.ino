// UVC Disinfection Microcontroller

// Declare Variables
char inputByte;
double distance = 0.0;
double max_boundary = 0.0;
double min_boundary = 0.0;
int runtime = 0;
bool is_running = false;
long sensor1, inches;

// Constant variables
const double max_start_distance = 10;
const double min_start_distance = 1;


void setup() {
 Serial.begin(9600);
 pinMode(13,OUTPUT);
 pinMode(3,INPUT);
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
  check_distance();
  calculate_runtime();
  
  // Send runtime, starting boolean, distance,
  // TODO: max boundary, min boundary to app
  Serial.println("isRunning: true");
  Serial.print("runtime: ");
  char rtime[16];
  itoa(runtime, rtime, 10);
  Serial.println(rtime);
  Serial.print("distance: ");
  char dist[16];
  itoa(runtime, dist, 10);
  Serial.println(dist);
  is_running = true;

  // TODO: Turn on LEDs, digital write 13 high is for example, this is where we implement LED driver logic
  digitalWrite(13,HIGH);

  while(runtime > 0){
    // TODO: implement logic to read input byte and check for cancel cycle
    
    calculate_distance();

    // TODO: Comment this back in once it is working
    //check_distance();
    
    delay(1000);
    runtime = runtime - 1;
    Serial.print("runtime: ");
    rtime[16];
    itoa(runtime, rtime, 10);
    Serial.println(rtime);
    Serial.print("distance: ");
    dist[16];
    itoa(runtime, dist, 10);
    Serial.println(dist);
  }

  // TODO: Turn off LEDs, digital write 13 low is for example, this is where we implement LED driver logic
  digitalWrite(13,LOW);

  distance = 0.0;
  max_boundary = 0.0;
  min_boundary = 0.0;
  runtime = 0;
  Serial.println("isRunning: false");
  Serial.print("runtime: ");
  rtime[16];
  itoa(runtime, rtime, 10);
  Serial.println(rtime);
  Serial.print("distance: ");
  dist[16];
  itoa(runtime, dist, 10);
  Serial.println(dist);
  is_running = false;
  loop();
}

// Gets distance from proximity sensor
void calculate_distance() {
  sensor1 = pulseIn(3,HIGH);
  long cm = sensor1/10;
  inches = cm/2.54;
  distance = cm;
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

void calculate_runtime() {
  int base_dist = 1;
  int base_intensity = 300;
  int new_intensity = distance/base_dist;
  runtime = 5/new_intensity;
  // TODO: remove this once distance and runtime are working properly
  if(runtime <= 0){
    runtime = 3;
  }
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
