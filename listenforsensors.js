var dgram = require("dgram");

var all = [];

function listen(port){
  var server = dgram.createSocket("udp4");
  server.on("message", function (msg, rinfo) {
    if(all.indexOf(rinfo.address) === -1)all.push(rinfo.address);
    console.log(port,":server got message from " +
		rinfo.address + ":" + rinfo.port,all);
  });

  server.bind(port);
}

listen(5000);
listen(5001);
