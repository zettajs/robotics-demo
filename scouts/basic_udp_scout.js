var EventEmitter = require('events').EventEmitter;
var util = require('util');
var DeviceServer = require('../lib/device_server');
var uuid = require('node-uuid');

var BasicUdpScout = module.exports = function(){
  this.server = new DeviceServer();
}
util.inherits(BasicUdpScout, EventEmitter);

BasicUdpScout.prototype.init = function(next){
  var self = this;
  this.server.start();
  this.server.on('stream', function(stream){
    if(stream === 'sound') {
      var SoundDriver = require('../drivers/sound_driver');
      self.emit('discover', SoundDriver, uuid.v1(), self.server);
    } else if(stream === 'light') {
      var PhotocellDriver = require('../drivers/photocell_driver');
      self.emit('discover', PhotocellDriver, uuid.v1(), self.server);
    } else if(stream === 'humidity') {
      var HumidityDriver = require('../drivers/humidity_driver');
      self.emit('discover', HumidityDriver, uuid.v1(), self.server);
    } else if(stream === 'temperature') {
      var TemperatureDriver = require('../drivers/temperature_driver');
      self.emit('discover', TemperatureDriver, uuid.v1(), self.server);
    } else if(stream === 'pressure') {
      var BarometerDriver = require('../drivers/barometer_driver');
      self.emit('discover', BarometerDriver, uuid.v1(), self.server);
    }
  });

  next();
};
