var exec = require('child_process').exec;
var util = require('util');
var Device = require('zetta').Device;

var System = module.exports = function() {
  Device.call(this);
};
util.inherits(System, Device);

System.prototype.init = function(config) {
  config
    .type('system')
    .name('~system')
    .state('ready')
    .when('ready', { allow: ['reboot'] })
    .map('reboot', this.reboot);
};

System.prototype.reboot = function(cb) {
  exec('reboot', cb);
};
