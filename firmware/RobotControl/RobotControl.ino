/*
UDP Broadcast and Sensor data transfer with Zetta.
*/
#include <Wire.h>
#include <SPI.h>         
#include <WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_PWMServoDriver.h"
 
#define GRIPPER_SPEED 150
#define MOTOR_SPEED 250
 
 
Adafruit_MotorShield AFMS = Adafruit_MotorShield(); 
 
Adafruit_DCMotor *firstMotor = AFMS.getMotor(1);
Adafruit_DCMotor *secondMotor = AFMS.getMotor(2);
Adafruit_DCMotor *thirdMotor = AFMS.getMotor(3);
Adafruit_DCMotor *fourthMotor = AFMS.getMotor(4);
 
int status = WL_IDLE_STATUS;
char ssid[] = "Loft21";  //  your network SSID (name)
char pass[] = "silkylotus997";       // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
 
unsigned int localPort = 4097;      // local port to listen for UDP packets
unsigned int remote = 5001;
 
boolean zettaAck = true;
 
 
IPAddress zettaServer; //for connection to fog
IPAddress broadcastServer(255, 255, 255, 255); //for broadcast
 
const int ACK_PACKET_SIZE = 255; // Shouldn't really need all of this but I'm a bit greedy
 
byte packetBuffer[ACK_PACKET_SIZE]; //buffer to hold incoming and outgoing packets 
 
// A UDP instance to let us send and receive packets over UDP
WiFiUDP Udp;
 
void setup() 
{
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  
  AFMS.begin();
  
  firstMotor->setSpeed(150);
  firstMotor->run(FORWARD);
  // turn on motor
  firstMotor->run(RELEASE);
  
  secondMotor->setSpeed(150);
  secondMotor->run(FORWARD);
  // turn on motor
  secondMotor->run(RELEASE);
  
  thirdMotor->setSpeed(150);
  thirdMotor->run(FORWARD);
  //  on motor
  thirdMotor->run(RELEASE);
  
  fourthMotor->setSpeed(150);
  fourthMotor->run(FORWARD);
  // turn on motor
  fourthMotor->run(RELEASE);
  
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
    delay(10000);
  }
 
  Serial.println("Connected to wifi");
  printWifiStatus(); 
  Serial.println("\nStarting connection to server...");
  Udp.begin(localPort);
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
       
      if(code == 1) {
        Serial.println("Running first motor.");
        firstMotor->run(RELEASE);
        firstMotor->setSpeed(GRIPPER_SPEED);
        firstMotor->run(dir);
        delay(500);
        firstMotor->setSpeed(0);
      }
      else if(code == 2) {
        Serial.println("Running second motor.");
        secondMotor->run(RELEASE);
        secondMotor->setSpeed(MOTOR_SPEED);
        secondMotor->run(dir);
        delay(500);
        secondMotor->setSpeed(0);
      }
      else if(code == 3) {
        Serial.println("Running third motor.");
        thirdMotor->run(RELEASE);
        thirdMotor->setSpeed(MOTOR_SPEED);
        thirdMotor->run(dir);
        delay(500);
        thirdMotor->setSpeed(0);
      }
      else if(code == 4) {
        Serial.println("Running fourth motor.");
        fourthMotor->run(RELEASE);
        fourthMotor->setSpeed(MOTOR_SPEED);
        fourthMotor->run(dir);
        delay(500);
        fourthMotor->setSpeed(0);
      }
      //Interact with motors here. 
    }
  }
  delay(100);
}
 
void broadcastSearch() {
  String json = String("{\"type\":\"data\", \"port\":4097}");
  Udp.beginPacket(broadcastServer, remote);
  Udp.write(json.c_str());
  Udp.endPacket();
  delay(3000);
}  
 
void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
 
  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
 
  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}