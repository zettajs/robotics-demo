var PhotocellDriver = module.exports = function(id, emitter) {
  this.type = 'photocell';
  this.name = 'lumosity';
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

