module.exports = function(server) {  
  var arm = server.where({ type: 'arm' });
  var huelight = server.where({ type: 'huebulb', bulbName: 'Zetta Demo' });

  server
    .observe([arm, huelight], function(arm, huelight){
      server.log('Arm and Huelight blinking logic ready');
      
      var armTransitions = ['move-claw', 'move-shoulder', 'move-elbow', 'pivot'];
      armTransitions.forEach(function(transition) {
        arm.on(transition, function(){
          huelight.call('blink', function(){});
        });
      });
    });

}
