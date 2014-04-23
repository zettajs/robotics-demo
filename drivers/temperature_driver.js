var TemperatureDriver = module.exports = function(id, emitter) {
  this.type = 'temperature';
  this.name = 'temperature';
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

