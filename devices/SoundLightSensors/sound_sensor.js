var util = require('util');
var Device = require('zetta').Device;

var SoundSensor = module.exports = function(emitter, ip) {
  this.ipAddress = ip;
  this.level = null;
  this._emitter = emitter;
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

  this._emitter.on('sound', function(data){
    self.level = Number(data);
  });
};
