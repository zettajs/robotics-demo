#include <SPI.h>
#include <WiFi.h>
#include <WiFiUdp.h>
 
#define PIN_GATE_IN 2
#define IRQ_GATE_IN 0
#define PIN_LED_OUT 13
#define PIN_ANALOG_IN_LIGHT A0
#define PIN_ANALOG_IN_SOUND A1
#define ACK_PACKET_SIZE 255
 
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
 
void setup(){
  Serial.begin(9600);
  
  pinMode(PIN_LED_OUT, OUTPUT);
  pinMode(PIN_GATE_IN, INPUT);
  attachInterrupt(IRQ_GATE_IN, soundISR, CHANGE);
  
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
 
 
 
void soundISR(){
  int pin_val;
  pin_val = digitalRead(PIN_GATE_IN);
  digitalWrite(PIN_LED_OUT, pin_val);
}
 
void loop(){
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
  String json = String("{\"type\":\"search\", \"streams\":[\"sound\", \"light\"], \"port\":4097}");
  Udp.beginPacket(broadcastServer, remote);
  Udp.write(json.c_str());
  Udp.endPacket();
  delay(3000);
}  
 
String readSensors(){
  String sound = String(analogRead(PIN_ANALOG_IN_SOUND), DEC);
  String light = String(analogRead(PIN_ANALOG_IN_LIGHT), DEC);
  
  String json = String("{\"type\":\"data\",\"data\":{\"sound\":"+sound+",\"light\":"+light+"}}");
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
