module.exports  = function(server) {
  var arm = server.where({ type: 'arm' });
  var display = server.where({ type: 'display' });

  server
    .observe([arm, display], function(arm, display){
      server.log('Arm and Screen update logic ready');
      
      var armTransitions = ['open-claw', 'close-claw', 'elbow-up', 'elbow-down', 'shoulder-up', 'shoulder-down', 'pivot-left', 'pivot-right'];
      armTransitions.forEach(function(transition) {
        arm.on(transition, function(){
          screen.call('change', 'arm: ' + transition);
        });
      });
    });
}
