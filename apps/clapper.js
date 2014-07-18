var GoCrazy = require('./lib/gocrazy');

var lower = 30;
var upper = 100;

module.exports = function(server) {  

  var sound = server.where({ type: 'sound' });
  var arm = server.where({ type: 'arm' });
  var huehub = server.where({ type: 'huehub' });
  var display = server.where({ type: 'display' });
  var apigee = server.where({ type: 'apigee' });

  server
    .observe([sound, arm, huehub, display, apigee], function(sound, arm, huehub, display, apigee){
      server.log('Clapper Logic Activated');
      var gocrazy = new GoCrazy(arm, huehub, display, apigee);
      
      var lastY = undefined;
      var dy = undefined;
      var Rs = 3;
      var R = [];

      sound.streams.level.on('data', function(msg) {
        var val = msg.data;

        if(lastY === undefined) {
          lastY = Number(val);
          return;
        }

        dy = val - lastY;
        lastY = Number(val);
        
        if(R.length < Rs) {
          R.push(dy);
        }else {
          R.shift();
          R.push(dy);

          if(Math.abs(R[0]) < lower && R[1] > upper && R[2] < (0-upper) ){
	    gocrazy.notify();
          }
        }
      });

    });

}
