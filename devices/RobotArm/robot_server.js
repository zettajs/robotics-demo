var UDPServer = require('./udp_server');
var events = require('events');
var EventEmitter = events.EventEmitter;
var util = require('util');

var RobotServer = module.exports = function(){
  this.bots = [];
};
util.inherits(RobotServer, EventEmitter);

RobotServer.prototype.start = function(){
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
          self.emit('online', sock, packet.port, info.address);
        }
      });
    } else {
      if(self.bots.indexOf(info.address) === -1) {
        self.bots.push(info.address);
        self.emit('online', sock, packet.port, info.address);
      }
    }
  });
  server.listen(5001);
};
