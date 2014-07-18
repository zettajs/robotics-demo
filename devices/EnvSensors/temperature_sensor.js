var util = require('util');
var Device = require('zetta').Device;

var TemperatureSensor = module.exports = function(emitter, ip) {
  this.ipAddress = ip;
  this.temperature = null;
  this._emitter = emitter;
  Device.call(this);
};
util.inherits(TemperatureSensor, Device);

TemperatureSensor.prototype.init = function(config) {
  var self = this;

  config
    .type('temperature')
    .name('Temperature Sensor')
    .state('on')
    .monitor('temperature');

  this._emitter.on('temperature', function(data){
    self.temperature = Number(data);
  });
};

