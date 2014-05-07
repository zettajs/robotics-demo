
#include <Process.h>

#define PIN_BUTTON_IN 2 

int buttonState;             // the current reading from the input pin
int lastButtonState = LOW;   // the previous reading from the input pin
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 20;    // the debounce time; increase if the output flickers

void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial
  pinMode(PIN_BUTTON_IN,INPUT);
  while (!Serial);
  Serial.println("Ready");
}

void loop() {
  int reading = digitalRead(PIN_BUTTON_IN);
  
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

  delay(10);  
}

void buttonPress(){  
  Serial.println("Button Press");
  Process p1;
  Process p2;
  p1.runShellCommand("/usr/bin/curl -i -X POST --data 'action=click' http://zetta-cloud.herokuapp.com/demo2/ActivateButton");
  p2.runShellCommand("/usr/bin/curl -i -X POST --data 'action=click' http://zetta-cloud.herokuapp.com/hello/ActivateButton");
  while (p1.running() || p2.running());
  Serial.print("Exit Code 1:");
  Serial.println(p1.exitValue());
  Serial.print("Exit Code 2:");
  Serial.println(p2.exitValue());
}



