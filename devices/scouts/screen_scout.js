var EventEmitter = require('events').EventEmitter;
var readline = require('readline');
var util = require('util');
var serialport = require('serialport');
var ScreenDriver = require('../drivers/screen_driver');

var ScreenScout = module.exports = function() {
  EventEmitter.call(this);
  this._serialPort = null;
  this.drivers = [];
  this.deviceName = process.env.SCREEN_DEVICE || '/dev/tty.usbmodem1421';
};
util.inherits(ScreenScout, EventEmitter);

ScreenScout.prototype.init = function(next) {
  this._serialPort = new serialport.SerialPort(this.deviceName, {
    baudRate: 9600,
    parser: serialport.parsers.readline('\r')
  });

  var self = this;
  this._serialPort.on('open', function(err) {
    if (err) {
      console.log('error on open:', err);
    }
    self._serialPort.on('data', function(data) {
      if (data === 'ready') {
        self.emit('discover', ScreenDriver, self._serialPort, 'touch-screen');
      }
    })
  });

  this._serialPort.on('error', function(err) {
    console.log('error on serialport:', err);
  });

  next();
};

/*var ask = function() {
  rl.question('> ', function(answer) {
    serialPort.write(answer + '\n', function() {
      ask();
    });
  });
};*/

