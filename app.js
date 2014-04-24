
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
          screen.call('write', 'arm: ' + transition, function(){
            huehub.call('blink');
          });
        });
      });

      zetta.expose(screen);
      zetta.expose(arm);
      zetta.expose(huehub);
    });

  zetta
    .observe('type="iphone"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="barometer"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="humidity"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
  
  zetta
    .observe('type="sound"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="photocell"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="temperature"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
};
