var util = require('util');
var Device = require('zetta').Device;

var SoundSensor = module.exports = function(emitter, ip) {
  this.ipAddress = ip;
  this.level = null;
  this._soundEmitter = emitter;
  Device.call(this);
};
util.inherits(SoundSensor, Device);

SoundSensor.prototype.init = function(config) {
  var self = this;

  config
    .type('sound')
    .name('Sound Sensor')
    .state('on')
    .monitor('level');

  this._soundEmitter.on('sound', function(data){
    self.level = Number(data);
  });
};
