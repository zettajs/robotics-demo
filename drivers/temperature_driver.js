var iphash = require('../lib/iphash');

var TemperatureDriver = module.exports = function(id, emitter, ip) {
  this.type = 'temperature';
  this.name = 'temperature-'+iphash(ip);
  this._emitter = emitter;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

TemperatureDriver.prototype.init = function(config) {
  config
    .stream('temp', this.streamTemp);
};

TemperatureDriver.prototype.streamTemp = function(emitter) {
  this._emitter.on('temperature', function(data){
    emitter.emit('data', data);
  });
};

