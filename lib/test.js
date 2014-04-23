var DeviceServer = require('./device_server');

var server = new DeviceServer()
server.start();

server.on('stream', function(stream) {
  console.log(stream);
});

server.on('sound', function(data) {
  console.log('sound', arguments);
});

server.on('light', function(data) {
  console.log('light', arguments);
});

server.on('temperature', function(data) {
  console.log('temperature', arguments);
});

server.on('pressure', function(data) {
  console.log('pressure', arguments);
});

server.on('humidity', function(data) {
  console.log('humidity', arguments);
});
