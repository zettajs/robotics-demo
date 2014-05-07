var iphash = require('../lib/iphash');

var PhotocellDriver = module.exports = function(id, emitter, ip) {
  this.type = 'photocell';
  this.name = 'luminosity-'+iphash(ip);
  this._emitter = emitter;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

PhotocellDriver.prototype.init = function(config) {
  config
    .stream('lumosity', this.streamlumosity);
};

PhotocellDriver.prototype.streamlumosity = function(emitter) {
  this._emitter.on('light', function(data){
    emitter.emit('data', data);
  });

};

