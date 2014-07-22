var Device = require('zetta').Device;
var util = require('util');

var Phone = module.exports = function() {
  Device.call(this);
  this.value = {
    x: 0,
    y: 0,
    z: 0
  };
};
util.inherits(Phone, Device);

Phone.prototype.init = function(config) {
  config
    .state('on')
    .type('iphone')
    .when('off', { allow: 'change' })
    .when('on', { allow: 'change' })
    .map('change', this.change,
         [{ name: 'x', type: 'text' }, { name: 'y', type: 'text' }, { name: 'z', type: 'text' }])
    .monitor('value');
};

Phone.prototype.change = function(x, y, z, cb) {
  this.value = {
    x: x,
    y: y,
    z: z
  };
  
  cb();
};
