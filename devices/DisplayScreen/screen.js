var util = require('util');
var Device = require('zetta').Device;

var Screen = module.exports = function(serialPort) {
  this._serialPort = serialPort;
  this.message = null;
  Device.call(this);
};
util.inherits(Screen, Device);

Screen.prototype.init = function(config) {
  config
    .type('screen')
    .name('Display Screen')
    .state('ready')
    .when('ready', { allow: ['change']})
    .map('change', this.change, [{ name: 'message', type: 'text'}])
    .monitor('message');
};

Screen.prototype.change = function(text, cb) {
  this._serialPort.write(text + '\n', cb);
  this.message = text;
};
