var util = require('util');
var serialport = require('serialport');
var Scout = require('zetta').Scout;
var Screen = require('./screen');

var ScreenScout = module.exports = function(deviceName){
  Scout.call(this);
  this.deviceName = deviceName;
  this._serialPort = null;
}
util.inherits(ScreenScout, Scout);

ScreenScout.prototype.init = function(next){
  this._serialPort = new serialport.SerialPort(this.deviceName, {
    baudRate: 9600,
    parser: serialport.parsers.readline('\r')
  });

  var self = this;
  this._serialPort.on('open', function(err) {
    if (err) {
      console.log('DisplayScreen error:', err);
    }
    self._serialPort.on('data', function(data) {
      if (data === 'ready') {
        var query = self.server.where({ type: 'display' });
        self.server.find(query, function(err, results) {
          if(err) {
            return;
          }
          if (results.length) {
            self.provision(results[0], Screen, self._serialPort);
          } else {
            self.discover(Screen, self._serialPort);
          }
        });
      }
    });
    next();
  });

  this._serialPort.on('error', function(err) {
    console.log('error on serialport:', err);
  });
};
