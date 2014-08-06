var Robot = module.exports = function(socket, port, ip) {
  this.socket = socket;
  this.port = port;
  this.ip = ip;
  this.motors = {
    "GRIPPER": 0x01,
    "ELBOW": 0x02,
    "SHOULDER": 0x03,
    "PIVOT":0x04
  };

  this.directions = {
    "FORWARD": 0x00,
    "BACKWARD": 0x01
  };

};

Robot.prototype._sendCommand = function(part, motion, cb) {
  var packet = new Buffer([this.motors[part], this.directions[motion]]);
  this.socket.send(packet, 0, packet.length, this.port, this.ip, function(err, bytes){
    if(err) {
      cb(err);
    } else {
      cb();
    }
  });
};

Robot.prototype.openGripper = function(cb) {
  this._sendCommand("GRIPPER", "BACKWARD", cb);
};

Robot.prototype.closeGripper = function(cb) {
  this._sendCommand("GRIPPER", "FORWARD", cb);
};

Robot.prototype.elbowDown = function(cb) {
  this._sendCommand("ELBOW", "FORWARD", cb);
};

Robot.prototype.elbowUp = function(cb) {
  this._sendCommand("ELBOW", "BACKWARD", cb);
};

Robot.prototype.shoulderUp = function(cb) {
  this._sendCommand("SHOULDER", "BACKWARD", cb);
};

Robot.prototype.shoulderDown = function(cb) {
  this._sendCommand("SHOULDER", "FORWARD", cb);
};

Robot.prototype.pivotRight = function(cb) {
  this._sendCommand("PIVOT", "FORWARD", cb);
};

Robot.prototype.pivotLeft = function(cb) {
  this._sendCommand("PIVOT", "BACKWARD", cb);
};

Robot.prototype.pivot = function(direction, cb) {
  var map = {
    'left': 'BACKWARD',
    'right': 'FORWARD'
  };

  this._sendCommand('PIVOT', map[direction], cb);
};

Robot.prototype.moveShoulder = function(direction, cb) {
  var map = {
    'up': 'BACKWARD',
    'down': 'FORWARD'
  };

  this._sendCommand('SHOULDER', map[direction], cb);
};

Robot.prototype.moveElbow = function(direction, cb) {
  var map = {
    'up': 'BACKWARD',
    'down': 'FORWARD'
  };

  this._sendCommand('ELBOW', map[direction], cb);
};

Robot.prototype.moveGripper = function(direction, cb) {
  var map = {
    'open': 'BACKWARD',
    'close': 'FORWARD'
  };

  this._sendCommand('GRIPPER', map[direction], cb);
};
