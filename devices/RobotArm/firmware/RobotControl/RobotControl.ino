/*
UDP Broadcast and Sensor data transfer with Zetta.
*/
#include <Wire.h>
#include <SPI.h>         
#include <WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_MotorShield.h>

#include "utility/Adafruit_PWMServoDriver.h"
#include "MotorControl.h"
 
#define GRIPPER_SPEED 150
#define MOTOR_SPEED 200
#define MOTOR_DURATION 200

Adafruit_MotorShield AFMS;
MotorControl* firstMotor;
MotorControl* secondMotor;
MotorControl* thirdMotor;
MotorControl* fourthMotor;
 
int status = WL_IDLE_STATUS;
unsigned long _lastBroadcast = 0;
char ssid[] = "Loft21";  //  your network SSID (name)
char pass[] = "silkylotus997";       // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
unsigned int localPort = 4097;      // local port to listen for UDP packets
unsigned int remote = 5001;
boolean zettaAck = true;
IPAddress zettaServer; //for connection to fog
IPAddress broadcastServer;
const int ACK_PACKET_SIZE = 255; // Shouldn't really need all of this but I'm a bit greedy
byte packetBuffer[ACK_PACKET_SIZE]; //buffer to hold incoming and outgoing packets 

// A UDP instance to let us send and receive packets over UDP
WiFiUDP Udp;
 
void initMotorSheild() {
  AFMS = Adafruit_MotorShield();
  firstMotor = new MotorControl(AFMS.getMotor(1), GRIPPER_SPEED, MOTOR_DURATION);
  secondMotor = new MotorControl(AFMS.getMotor(2), MOTOR_SPEED, MOTOR_DURATION);
  thirdMotor = new MotorControl(AFMS.getMotor(3), MOTOR_SPEED, MOTOR_DURATION);
  fourthMotor = new MotorControl(AFMS.getMotor(4), MOTOR_SPEED, MOTOR_DURATION);
  
  AFMS.begin();
  firstMotor->init();
  secondMotor->init();
  thirdMotor->init();
  fourthMotor->init();
}

void setup() 
{
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  
  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present"); 
    // don't continue:
    while(true);
  }
 
  // attempt to connect to Wifi network:
  while ( status != WL_CONNECTED) { 
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:    
    status = WiFi.begin(ssid, pass);
 
    // wait 10 seconds for connection:
    delay(5000);
  }
 
  Serial.println("Connected to wifi");
  printWifiStatus(); 
  Serial.println("\nStarting connection to server...");
  Udp.begin(localPort);
  
  initMotorSheild();
}
 
void loop()
{  
  
  broadcastSearch();

  int packetSize = Udp.parsePacket();
  if(zettaAck == false) {
    Serial.println("\nAttempting to pair with Zetta...");
    if(packetSize) {
      Serial.println("\nPotential ACK found...");
      Udp.read(packetBuffer, 255);
      String str((char *)packetBuffer);
      if(strcmp("{\"zetta\":true}", str.c_str()) == 0) {
        Serial.println("\nACK Found...");
        zettaAck = true;
        zettaServer = Udp.remoteIP(); 
      }
    } else {
      broadcastSearch();
    }
  } else {
    if(packetSize) {
      byte command[2];
      Udp.read(command, 2);
      Serial.println((char *)command);
      int code = command[0];
      int dirCode = command[1];
      int dir;
      if(dirCode == 0) {
        dir = FORWARD;
      } else {
        dir = BACKWARD;
      }
      Serial.print(".");
       
      if(code == 1) {
        Serial.println("Running first motor.");
        firstMotor->move(dir);
      }
      else if(code == 2) {
        Serial.println("Running second motor.");
        secondMotor->move(dir);
      }
      else if(code == 3) {
        Serial.println("Running third motor.");
        thirdMotor->move(dir);
      }
      else if(code == 4) {
        Serial.println("Running fourth motor.");
        fourthMotor->move(dir);
      }
    }
  }
  
  firstMotor->loop();
  secondMotor->loop();
  thirdMotor->loop();
  fourthMotor->loop();
  
  delay(50);
}
 
void broadcastSearch() {
  if(millis()-_lastBroadcast > 3000){
    String json = String("{\"type\":\"data\", \"port\":4097}");
    Udp.beginPacket(broadcastServer, remote);
    Udp.write(json.c_str());
    Udp.endPacket();
    _lastBroadcast = millis();
  }
}  
 
void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  
  // lockdown broadcast 
  IPAddress netmask = WiFi.subnetMask();
  
  Serial.print("Netmask Address: ");
  Serial.println(netmask);
    
  for(int i=0;i<4;i++){
    broadcastServer[i] = ip[i] | (netmask[i] ^ 255);
  }
  
  Serial.print("Broadcast Address: ");
  Serial.println(broadcastServer);
  
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println("dbm");
}
