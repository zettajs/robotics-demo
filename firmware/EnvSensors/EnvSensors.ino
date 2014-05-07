#include <Wire.h>
#include <SPI.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include "MPL3115A2.h"
 
#define HUMIDITY_PIN A0
#define ACK_PACKET_SIZE 255
 
MPL3115A2 pressureSensor;
 
int status = WL_IDLE_STATUS;

char ssid[] = "Loft21";
char pass[] = "silkylotus997";

//char ssid[] = "apigeedemo";  //  your network SSID (name)
//char pass[] = "apigeelabs";       // your network password

unsigned int localPort = 4097;
unsigned int remote = 5000;
 
boolean zettaAck = true;
 
IPAddress zettaServer;
IPAddress broadcastServer;
 
byte packetBuffer[ACK_PACKET_SIZE];
 
WiFiUDP Udp;
 
void setup()
{
  Wire.begin();
  Serial.begin(9600);
  
  pressureSensor.begin();
  
  pressureSensor.setModeBarometer();
  
  pressureSensor.setOversampleRate(7);
  pressureSensor.enableEventFlags();
  
 if(WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while(true);
  }
  
  while( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSDID: ");
    Serial.println(ssid);
    
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }
  
  Serial.println("Connected to wifi");
  printWifiStatus();
  Serial.println("\nStarting connection to server...");
  Udp.begin(localPort);
}
 
void loop() {
  int packetSize = Udp.parsePacket();
  if(zettaAck == false) {
    Serial.println("\nAttempting to pair with Zetta..");
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
    String json = readSensors();
    Udp.beginPacket(broadcastServer, remote);
    Udp.write(json.c_str());
    Udp.endPacket();
  }
  delay(100); 
}
 
void broadcastSearch() {
  String json = String("{\"type\":\"search\", \"streams\":[\"temperature\", \"pressure\", \"humidity\"], \"port\":4097}");
  Udp.beginPacket(broadcastServer, remote);
  Udp.write(json.c_str());
  Udp.endPacket();
  delay(3000);
}  
 
String readSensors(){
  float pressure = pressureSensor.readPressure();
  float temperature = pressureSensor.readTemp();
  
  char pressureStr[9];
  char tempStr[9];
  char trueHumidityStr[6];
  
  dtostrf(pressure, 8, 2, pressureStr);
  dtostrf(temperature, 8, 2, tempStr);
  
  float supplyVolt = 5.0;
  
  int humiditySensor = analogRead(HUMIDITY_PIN);
  float voltage = humiditySensor/1023.0 * supplyVolt; 
  float sensorRelativeHumidity = 161.0 * voltage / supplyVolt - 25.8;
  float trueRelativeHumidity = sensorRelativeHumidity / (1.0546 - 0.0026 * temperature);
  
  dtostrf(trueRelativeHumidity, 5, 2, trueHumidityStr);
  
  String json = String("{\"type\":\"data\", \"data\":{\"temperature\":"+String(tempStr)+",\"pressure\":"+String(pressureStr)+",\"humidity\":"+String(trueHumidityStr)+"}}");
  Serial.println(json);
  return json;
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
