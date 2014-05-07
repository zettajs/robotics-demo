#ifndef MOTOR_CONTROL
#define MOTOR_CONTROL

#include <stdint.h>

class Adafruit_DCMotor;

class MotorControl{
 public:
  MotorControl(Adafruit_DCMotor* motor, const int& speed, const int& duration);
  ~MotorControl();
  
  void move(int dir);
  void loop();
  void init();

 protected:

  Adafruit_DCMotor* m_motor;
  int m_direction;
  unsigned long m_startTime;
  uint32_t m_duration;

  const int MOTOR_SPEED;
  const int MOTOR_INCR;
  bool m_running;
  
};

#endif

