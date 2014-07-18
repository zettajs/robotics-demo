module.exports = function(server) {  
  var arm = server.where({ type: 'arm' });
  var huehub = server.where({ type: 'huehub' });

  server
    .observe([arm, huehub])
    .subscribe(function(arm, huehub){
      server.log('Arm and Huehub blinking logic ready');
      
      var armTransitions = ['open-claw', 'close-claw', 'elbow-up', 'elbow-down', 'shoulder-up', 'shoulder-down', 'pivot-left', 'pivot-right'];
      armTransitions.forEach(function(transition) {
        arm.on(transition, function(){
          huehub.call('blink');
        });
      });
    });

}
