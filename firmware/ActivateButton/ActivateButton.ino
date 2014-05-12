
#include <Process.h>

#define PIN_BUTTON_PIN 2 
#define LED_PIN 7
#define WIFI_PIN 6

int buttonState;             // the current reading from the input pin
int lastButtonState = LOW;   // the previous reading from the input pin
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 20;    // the debounce time; increase if the output flickers

long lastWifiCheck = 0;
int wifiStatus= 0;
int wifiPinStatus= 0;
long wifiLastChange = 0;

void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial
  
  pinMode(PIN_BUTTON_PIN,INPUT);
  pinMode(LED_PIN,OUTPUT);
  pinMode(WIFI_PIN,OUTPUT);
  
  checkWifi();
  digitalWrite(LED_PIN,HIGH);
  
  Serial.println("Ready");
}

void checkWifi(){
  long now = millis();
  if(now-lastWifiCheck < 15000 && lastWifiCheck != 0){
    if(wifiStatus < 40){
      if(now-wifiLastChange < 400){
        return;
      }
      wifiLastChange = now;
      Serial.println(wifiStatus);
      if(wifiPinStatus){
        wifiPinStatus = 0;
        digitalWrite(WIFI_PIN,LOW);
      }else{
        wifiPinStatus = 1;
        digitalWrite(WIFI_PIN,HIGH);      
      }
      
    }else{
       wifiPinStatus = 1;
       digitalWrite(WIFI_PIN,HIGH);
    }
    return;
  }

  Process p;
  p.runShellCommand("/usr/bin/pretty-wifi-info.lua | grep Signal");
  while (p.available()) {
    wifiStatus = p.parseInt();
    break;
  }
  
  lastWifiCheck = now;
}

void loop() {
  int reading = digitalRead(PIN_BUTTON_PIN);
  
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }
 
 if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // only toggle the LED if the new button state is HIGH
      if (buttonState == HIGH) {
        buttonPress();
      }
    }
  } 
  
  lastButtonState = reading;
  
  checkWifi();

  delay(10);  
}

void buttonPress(){
  digitalWrite(LED_PIN,LOW);
  Serial.println("Button Press");
  Process p1;
  Process p2;
  p1.runShellCommandAsynchronously("/usr/bin/curl -i -X POST --data 'action=click' http://zetta-cloud.herokuapp.com/minifactory-detroit/ActivateButton");
  p2.runShellCommandAsynchronously("/usr/bin/curl -i -X POST --data 'action=click' http://zetta-cloud.herokuapp.com/minifactory-san-francisco/ActivateButton");
  
  bool p1Running, p2Running;
  do{
    p1Running = p1.running();
    p2Running = p2.running();
    Serial.print("Running:");
    Serial.print(p1Running);
    Serial.print(" ");
    Serial.println(p2Running);
    delay(100);
  }while(p1Running || p2Running);

  
  
  Serial.print("Exit Code 1:");
  Serial.println(p1.exitValue());
  Serial.print("Exit Code 2:");
  Serial.println(p2.exitValue());
  digitalWrite(LED_PIN,HIGH);
}


