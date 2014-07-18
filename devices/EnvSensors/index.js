var util = require('util');
var Scout = require('zetta').Scout;
var DeviceServer = require('../lib/device_server');
var HumiditySensor = require('./humidity_sensor');
var TemperatureSensor = require('./temperature_sensor');
var Barometer = require('./barometer');

var EnvSensors = module.exports = function(){
  Scout.call(this);
  this.udpServer = new DeviceServer(5000);
  this.udpServer.name = 'EnvSensors';
}
util.inherits(EnvSensors, Scout);

EnvSensors.prototype.init = function(next){
  var self = this;
  this.udpServer.start();
  this.udpServer.on('stream', function(stream, rinfo){
    if(stream === 'humidity') {
      self.initDevice('humidity', HumiditySensor, rinfo);
    } else if(stream === 'temperature') {
      self.initDevice('temperature', TemperatureSensor, rinfo);
    } else if(stream === 'pressure') {
      self.initDevice('pressure', Barometer, rinfo);
    }
  });
  
  next();
};

EnvSensors.prototype.initDevice = function(type, Class, rinfo) {
  var self = this;
  var query = self.server.where({ type: type });
  self.server.find(query, function(err, results) {
    if(err) {
      return;
    }
    if (results.length) {
      self.provision(results[0], Class, self.udpServer, rinfo.address);
    } else {
      self.discover(Class, self.udpServer, rinfo.address);
    }
  });
};

