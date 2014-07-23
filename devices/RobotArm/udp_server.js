var dgram = require('dgram');

//Server for sending recieving UDP messages.
var UDPServer = module.exports = function(){
};

UDPServer.prototype.createServer = function(cb) {
  var sock = dgram.createSocket('udp4');
  this.sock = sock;
  sock.on('message', function(msg, info) {
    cb(this, msg, info);
  });
};

UDPServer.prototype.close = function() {
  this.sock.close();
};

UDPServer.prototype.listen = function(host, port, cb) {
  this.sock.bind.apply(this.sock, arguments);
};

