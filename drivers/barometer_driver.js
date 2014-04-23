var BarometerDriver = module.exports = function(id, emitter) {
  this.type = 'barometer';
  this.name = 'barometer';
  this._emitter = emitter;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

BarometerDriver.prototype.init = function(config) {
  config
    .stream('pressure', this.streamPressure);
};

BarometerDriver.prototype.streamPressure = function(emitter) {
  this._emitter.on('pressure', function(data){
    emitter.emit('data', data);
  });
};

