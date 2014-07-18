var querystring = require('querystring');

var Phone = module.exports = function(prototype) {
  prototype = prototype || {};
  this.type = 'iphone';
  this.name = prototype.name;
  this.state = prototype.state || 'off';
  this.accelerometer = {
    x: 0,
    y: 0,
    z: 0
  };
  this._xEmitter = null;
  this._yEmitter = null;
  this._zEmitter = null;
};

Phone.prototype.init = function(config) {
  config
    .when('off', { allow: 'change' })
    .when('on', { allow: 'change' })
    .map('change', this.change,
        [{ name: 'x', type: 'text' }, { name: 'y', type: 'text' }, { name: 'z', type: 'text' }])
    .stream('x', this.streamX)
    .stream('y', this.streamY)
    .stream('z', this.streamZ)
};

Phone.prototype.change = function(x, y, z, cb) {
  this.accelerometer.x = x;
  this.accelerometer.y = y;
  this.accelerometer.z = z;

  if (this._xEmitter) {
    if (this.accelerometer.x) {
      this._xEmitter.emit('data', this.accelerometer.x);
    }
  }

  if (this._yEmitter) {
    if (this.accelerometer.y) {
      this._yEmitter.emit('data', this.accelerometer.y);
    }
  }

  if (this._zEmitter) {
    if (this.accelerometer.z) {
      this._zEmitter.emit('data', this.accelerometer.z);
    }
  }

  if (cb) {
    cb();
  }
};

Phone.prototype.streamX = function(emitter) {
  this._xEmitter = emitter;
};

Phone.prototype.streamY = function(emitter) {
  this._yEmitter = emitter;
};

Phone.prototype.streamZ = function(emitter) {
  this._zEmitter = emitter;
};
