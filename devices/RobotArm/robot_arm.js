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
    .when('standby', { allow: ['move-claw', 'move-elbow', 'move-shoulder', 'pivot'] })
    .when('moving-claw', { allow: ['standby'] })
    .when('moving-elbow', { allow: ['standby'] })
    .when('pivoting', { allow: ['standby'] })
    .when('moving-shoulder', { allow: ['standby']})
    .map('standby', this.standby, [ { name: 'direction' } ])
    .map('move-claw', this.moveClaw, [ { name: 'direction' } ])
    .map('move-elbow', this.moveElbow, [ { name: 'direction' } ])
    .map('move-shoulder', this.moveShoulder, [ { name: 'direction' } ])
    .map('pivot', this.pivot, [ { name: 'direction' } ]);
};

RobotArm.prototype.standby = function(cb) {
  this.state = 'standby';
  if(cb) {
    cb();
  }
};

RobotArm.prototype.moveClaw = function(direction, cb) {
  this.state = 'moving-claw';
  var self = this;
  this._robot.moveGripper(direction, function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.moveElbow = function(direction, cb) {
  this.state = 'moving-elbow';
  var self = this;
  this._robot.moveElbow(direction, function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.moveShoulder = function(direction, cb) {
  this.state = 'moving-shoulder';
  var self = this;
  this._robot.moveShoulder(direction, function() {
    self.call('standby');
    cb();
  });
};

RobotArm.prototype.pivot = function(direction, cb) {
  this.state = 'pivoting';
  var self = this;
  this._robot.pivot(direction, function() {
    self.call('standby');
    cb();
  });
};

