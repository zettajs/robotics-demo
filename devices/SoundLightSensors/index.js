var util = require('util');
var Scout = require('zetta').Scout;
var DeviceServer = require('../lib/device_server');
var SoundSensor = require('./sound_sensor');
var LightSensor = require('./light_sensor');

var SoundLightSensors = module.exports = function(){
  console.log('Sound light...')
  Scout.call(this);
  this.udpServer = new DeviceServer(5001);
  this.udpServer.name = 'SoundLightSensors';
}
util.inherits(SoundLightSensors, Scout);

SoundLightSensors.prototype.init = function(next){
  var self = this;
  this.udpServer.start();
  this.udpServer.on('stream', function(stream, rinfo){
    if(stream === 'light') {
      self.initDevice('light', LightSensor, rinfo);
    } else if(stream === 'sound') {
      self.initDevice('sound', SoundSensor, rinfo);
    }
  });
  
  next();
};

SoundLightSensors.prototype.initDevice = function(type, Class, rinfo) {
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

