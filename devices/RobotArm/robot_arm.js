var util = require('util');
var Device = require('zetta').Device;
var Robot = require('./robot_lib');

var RobotArm = module.exports = function(socket, port, ip) {
  this._socket = socket;
  this._port = port;
  this._robot = new Robot(socket, port, ip);
  this.ip = ip;
  Device.call(this);
};
util.inherits(RobotArm, Device);

RobotArm.prototype.init = function(config) {
  config
    .type('arm')
    .name('Robot Arm')
    .state('standby')
    .when('standby', { allow: ['open-claw', 'close-claw', 'elbow-up', 'elbow-down', 'shoulder-up', 'shoulder-down', 'pivot-left', 'pivot-right']})
    .when('open-claw', { allow: ['standby'] })
    .when('close-claw', { allow: ['standby']})
    .when('elbow-up', { allow: ['standby']})
    .when('elbow-down', { allow: ['standby'] })
    .when('pivot-left', { allow: ['standby'] })
    .when('pivot-right', { allow: ['standby'] })
    .when('shoulder-up', { allow: ['standby'] })
    .when('shoulder-down', { allow: ['standby']})
    .map('standby', this.standby)
    .map('open-claw', this.openClaw)
    .map('close-claw', this.closeClaw)
    .map('elbow-up', this.elbowUp)
    .map('elbow-down', this.elbowDown)
    .map('shoulder-up', this.shoulderUp)
    .map('shoulder-down', this.shoulderDown)
    .map('pivot-left', this.pivotLeft)
    .map('pivot-right', this.pivotRight);
};

RobotArm.prototype.standby = function(cb) {
  this.state = 'standby';
  if(cb) {
    cb();
  }
};

RobotArm.prototype.openClaw = function(cb) {
  this.state = 'open-claw';
  
  var self = this;
  this._robot.openGripper(function() {

    self.call('standby');
    cb();
  });
};

RobotArm.prototype.closeClaw = function(cb) {
  this.state = 'close-claw';
  var self = this;
  this._robot.closeGripper(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.elbowUp = function(cb) {
  this.state = 'elbow-up';
  var self = this;
  this._robot.elbowUp(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.elbowDown = function(cb) {
  this.state = 'elbow-down';
  var self = this;
  this._robot.elbowDown(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.shoulderUp = function(cb) {
  this.state = 'shoulder-up';
  var self = this;
  this._robot.shoulderUp(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.shoulderDown = function(cb) {
  this.state = 'shoulder-down';
  var self = this;
  this._robot.shoulderDown(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.pivotLeft = function(cb) {
  this.state = 'pivot-left';
  var self = this;
  this._robot.pivotLeft(function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.pivotRight = function(cb) {
  this.state = 'pivot-right';
  var self = this;
  this._robot.pivotRight(function() {
    self.call('standby');
    cb();
  });
};

