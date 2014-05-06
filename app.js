
var HelloApp = module.exports = function() {
  this.name = process.env.APP_NAME || 'hello';
};

HelloApp.prototype.init = function(zetta) {

  zetta
     .observe('type="button"')
     .zip(zetta.observe('type="arm"'), zetta.observe('type="huehub"'), zetta.observe('type="screen"'))
     .first()
     .subscribe(function(devices){
       var button = devices[0];
       var arm = devices[1];
       var huehub = devices[2];       
       var screen = devices[3];
       
       button.on('click',function(){
	 arm.call('pivot-right');
	 screen.call('change','Button Pressed!!!');
	 if(huehub.registerd)
	   huehub.call('blink');
       });
     });


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
