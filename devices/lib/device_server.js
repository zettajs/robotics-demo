var dgram = require('dgram');
var events = require('events');
var EventEmitter = events.EventEmitter;
var util = require('util');

var DeviceServer = module.exports = function(port){
  this.streams = [];
  this.port = port;
  EventEmitter.call(this);
};
util.inherits(DeviceServer, EventEmitter);

DeviceServer.prototype.start = function(){
  var self = this;

  var server = dgram.createSocket("udp4");
  server.on('error', function(err) {
    console.error(err);
    server.close();
    this.emit('error', err);
  });

  server.on('message', function(msg, info){ 
    var packet = null;
    try {
      packet = JSON.parse(msg);
    }catch(err){
      console.error(err);
      return;
    }
    
    self.emit('message', packet, info);
    
    if (!packet.data && typeof packet.data !== 'object') {
      return;
    }
    
    var keys = Object.keys(packet.data);
    keys.forEach(function(key) {  
      if(self.streams.indexOf(key) !== -1) {
        self.emit(key, packet.data[key]);
      } else {
        self.streams.push(key);
        self.emit('stream', key, info);
      }
    });
    
  });
  server.bind(this.port);
};
