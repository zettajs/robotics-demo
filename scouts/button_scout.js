var EventEmitter = require('events').EventEmitter;
var util = require('util');
var ButtonDriver = require('../drivers/button_driver');

var ButtonScout = module.exports = function() {
  EventEmitter.call(this);
  this.drivers = [];
};
util.inherits(ButtonScout, EventEmitter);

ButtonScout.prototype.init = function(next) {
  console.log('New button driver')
  this.emit('discover',ButtonDriver);
  next();
};

