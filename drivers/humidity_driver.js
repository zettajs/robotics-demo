var iphash = require('../lib/iphash');

var HumidityDriver = module.exports = function(id, emitter, ip) {
  this.type = 'humidity';
  this.name = 'humidity-'+iphash(ip);
  this._emitter = emitter;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

HumidityDriver.prototype.init = function(config) {
  config
    .stream('humidity', this.streamHumidity);
};

HumidityDriver.prototype.streamHumidity = function(emitter) {
  this._emitter.on('humidity', function(data) {
    emitter.emit('data', data);
  });
};

