var iphash = require('../lib/iphash');

var SoundDriver = module.exports = function(id, emitter, ip) {
  this.type = 'sound';
  this.name = 'sound-'+iphash(ip);
  this._emitter = emitter;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

SoundDriver.prototype.init = function(config) {
  config
    .stream('sound', this.streamSound);
};

SoundDriver.prototype.streamSound = function(emitter) {
  var self = this;
  this._emitter.on('sound', function(data) {
    emitter.emit('data', data);
    self.emit('update', data);
  });
};

