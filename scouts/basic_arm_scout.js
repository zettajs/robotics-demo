var RobotServer = require('../lib/robot_server.js');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var uuid = require('node-uuid');

var BasicArmScout = module.exports = function() {
  this.server = new RobotServer();
  this.drivers = [];
}
util.inherits(BasicArmScout, EventEmitter);

BasicArmScout.prototype.init = function(next){
  var self = this;
  
  this.server.start();

  this.server.on('online', function(socket, port, ip){
    var Robot = require('../drivers/robot_driver');
    self.emit('discover', Robot, uuid.v1(), socket, port, ip);
  });
};

