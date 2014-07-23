var dgram = require('dgram');

//{\"type\":\"data\", \"data\":{\"temperature\":"+String(tempStr)+",\"pressure\":"+String(pressureStr)+",\"humidity\":"+String(trueHumidityStr)+"}}"

var message = new Buffer("Some bytes");

var client = dgram.createSocket("udp4");

setInterval(update, 200);
function update() {
  var temperature = 50 + Math.random() * 100;
  var humidity = Math.random() * 100;
  var pressure = 500 + Math.random() * 500;

  var data = {
    type: 'data',
    data: {
      temperature: temperature.toFixed(3),
      pressure: pressure.toFixed(3),
      humidity: humidity.toFixed(3)
    }
  };
  var buf = new Buffer(JSON.stringify(data));
  client.send(buf, 0, buf.length, 5000, "localhost", function(err, bytes) {
    
  });
}

