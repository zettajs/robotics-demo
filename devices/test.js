var dgram = require('dgram');

server(1);
server(2);
function server(idx) {
  var server = dgram.createSocket('udp4');
  server.on("error", function (err) {
    console.log(idx,"server error:\n" + err.stack);
    server.close();
  });

  server.on("message", function (msg, rinfo) {
    console.log(idx,"server got: " + msg + " from " +
                rinfo.address + ":" + rinfo.port);
  });

  server.on("listening", function () {
    var address = server.address();
    console.log(idx,"server listening " +
                address.address + ":" + address.port);
  });
  server.bind(5000);
}
