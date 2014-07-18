var dgram = require('dgram');

var client = dgram.createSocket("udp4");
setInterval(update, 200);
function update() {
  var sound = 5 + Math.random() * 100;
  var light = 5000 + Math.random() * 5000;

  var data = {
    type: 'data',
    data: {
      sound: sound.toFixed(3),
      light: light.toFixed(3)
    }
  };
  var buf = new Buffer(JSON.stringify(data));
  client.send(buf, 0, buf.length, 5001, "localhost", function(err, bytes) {
    
  });
}

