var util = require('util');
var Device = require('zetta').Device;

var Barometer = module.exports = function(emitter, ip) {
  this.ipAddress = ip;
  this.pressure = null;
  this._emitter = emitter;
  Device.call(this);
};
util.inherits(Barometer, Device);

Barometer.prototype.init = function(config) {
  var self = this;

  config
    .type('barometer')
    .name('Barometer')
    .state('on')
    .monitor('pressure');

  this._emitter.on('pressure', function(data){
    self.pressure = Number(data);
  });
};
