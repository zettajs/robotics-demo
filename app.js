
var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {

  zetta
    .observe('type="screen"')
    .zip(zetta.observe('type="arm"'), zetta.observe('type="huehub"'))
    .first()
    .subscribe(function(devices) {
      var screen = devices[0];
      var arm = devices[1];
      var huehub = devices[2];

      var armTransitions = ['open-claw', 'close-claw', 'elbow-up', 'elbow-down', 'shoulder-up', 'shoulder-down', 'pivot-left', 'pivot-right'];
      armTransitions.forEach(function(transition) {
        arm.on(transition, function(){
          screen.call('change', 'arm: ' + transition, function(){
            huehub.call('blink');
          });
        });
      });
    });

  zetta.on('deviceready',function(device){
    zetta.expose(device);
  });
};
