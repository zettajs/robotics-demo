var SoundDriver = module.exports = function(id, emitter) {
  this.type = 'sound';
  this.name = 'sound';
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
  this._emitter.on('sound', function(data) {
    emitter.emit('data', data);
  });
};

