var exec = require('child_process').exec;

var System = module.exports = function() {
  this.type = 'system';
  this.name = '~system';
  this.state = 'ready';
};

System.prototype.init = function(config) {
  config
    .when('ready', { allow: ['reboot'] })
    .map('reboot', this.reboot);
};

System.prototype.reboot = function(cb) {
  exec('reboot', cb);
};
