var util = require('util');
var Device = require('zetta').Device;

var ButtonDriver = module.exports = function() {
  Device.call(this);
};
util.inherits(ButtonDriver, Device);

ButtonDriver.prototype.init = function(config) {
  config
    .state('up')
    .name('Activate Button')
    .type('button')
    .when('down', { allow: ['lift', 'click'] })
    .when('up', { allow: ['press', 'click'] })
    .map('press', this.press)
    .map('lift', this.lift)
    .map('click', this.click)
};

ButtonDriver.prototype.lift = function(cb) {
  this.state = 'up';
  cb();
};

ButtonDriver.prototype.press = function(cb) {
  this.state = 'down';
  cb();
};

ButtonDriver.prototype.click = function(cb) {
  var self = this;
  this.press(function() {
    self.lift(cb);
  });
};
