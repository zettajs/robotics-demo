var UDPServer = require('./udp_server');
var events = require('events');
var EventEmitter = events.EventEmitter;
var util = require('util');

var DeviceServer = module.exports = function(){
  this.streams = [];
};
util.inherits(DeviceServer, EventEmitter);

DeviceServer.prototype.start = function(){
  var self = this;
  var server = new UDPServer();
  server.createServer(function(sock, msg, info){
    var packet = JSON.parse(msg);
    if(packet.type == 'search') {
      var msgBuf = new Buffer(JSON.stringify({ zetta: true }));
      sock.send(msgBuf, 0, msgBuf.length, packet.port, info.address, function(err, bytes) {
        if(err) {
          console.log('Error sending pairing message.');
        } else {
          packet.streams.forEach(function(stream) { 
            self.streams.push(stream);
            self.emit('stream', stream);
          });
        }
      });
    } else {
      var keys = Object.keys(packet.data);
      keys.forEach(function(key) {  
        if(self.streams.indexOf(key) !== -1) {
          self.emit(key, packet.data[key]);
        }
      });

    }
  });
  server.listen(5000);
};
