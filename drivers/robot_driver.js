var Robot = require('../lib/robot_lib');

var RobotArmDriver = module.exports = function(id, socket, port, ip) {
  this.type = 'arm';
  this.name = 'arm';
  this.data = {};
  this.id = id;
  this._socket = socket;
  this._port = port;
  this._robot = new Robot(socket, port, ip);
  this.ip = ip;
  this.state = 'standby';
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.led = false;
};

RobotArmDriver.prototype.init = function(config) {
  config
    .when('standby', { allow: ['open-claw', 'close-claw', 'elbow-up', 'elbow-down', 'shoulder-up', 'shoulder-down', 'pivot-left', 'pivot-right']})
    .when('open-claw', { allow: [] })
    .when('close-claw', { allow: []})
    .when('elbow-up', { allow: []})
    .when('elbow-down', { allow: [] })
    .when('pivot-left', { allow: [] })
    .when('pivot-right', { allow: [] })
    .map('open-claw', this.openClaw)
    .map('close-claw', this.closeClaw)
    .map('elbow-up', this.elbowUp)
    .map('elbow-down', this.elbowDown)
    .map('shoulder-up', this.shoulderUp)
    .map('shoulder-down', this.shoulderDown)
    .map('pivot-left', this.pivotLeft)
    .map('pivot-right', this.pivotRight);
};

RobotArmDriver.prototype.streamX = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.x);
  }, 500);
};

RobotArmDriver.prototype.streamY = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.y);
  }, 500);
};

RobotArmDriver.prototype.streamZ = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.z);
  }, 500);
};

RobotArmDriver.prototype.openClaw = function(cb) {
  this.state = 'open-claw';
  var self = this;
  this._robot.openGripper(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.closeClaw = function(cb) {
  this.state = 'close-claw';
  var self = this;
  this._robot.closeGripper(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.elbowUp = function(cb) {
  this.state = 'elbow-up';
  var self = this;
  this._robot.elbowUp(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.elbowDown = function(cb) {
  this.state = 'elbow-down';
  var self = this;
  this._robot.elbowDown(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.shoulderUp = function(cb) {
  this.state = 'shoulder-up';
  var self = this;
  this._robot.shoulderUp(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.shoulderDown = function(cb) {
  this.state = 'shoulder-down';
  var self = this;
  this._robot.shoulderDown(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.pivotLeft = function(cb) {
  this.state = 'pivot-left';
  var self = this;
  this._robot.pivotLeft(function() {
    self.state = 'standby';
    cb();
  });
};

RobotArmDriver.prototype.pivotRight = function(cb) {
  this.state = 'pivot-right';
  var self = this;
  this._robot.pivotRight(function() {
    self.state = 'standby';
    cb();
  });
};

