#include "MotorControl.h"
#include <Arduino.h>
#include <Adafruit_MotorShield.h>

MotorControl::MotorControl(Adafruit_DCMotor* motor, const int& speed, const int& duration) : 
  m_motor(motor),
  MOTOR_SPEED(speed),
  MOTOR_INCR(duration)
{
  m_duration = 0;
  m_running = false;
}

MotorControl::~MotorControl(){

}

void MotorControl::init(){
  m_motor->setSpeed(MOTOR_SPEED);
  m_motor->run(FORWARD);
  m_motor->run(RELEASE);
}
  
void MotorControl::move(int dir){
  if(dir != m_direction){
    m_duration = MOTOR_INCR;
    m_startTime = millis();
  }else{
    if(m_duration == 0){
      m_startTime = millis();
    }
    m_duration += MOTOR_INCR;
  }

  m_direction = dir;
  
}

void MotorControl::loop(){
  unsigned long now = millis();
  if(now - m_startTime > m_duration){
    if(m_running){
      m_motor->setSpeed(0);
      m_duration = 0;
      m_running = false;
    }
  }else{
    if(!m_running){
      m_motor->run(RELEASE);
      m_motor->setSpeed(MOTOR_SPEED);
      m_motor->run(m_direction);
      m_running = true;
    }
  }  
}
