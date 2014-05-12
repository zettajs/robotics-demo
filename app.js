var System = require('./system');
var GoCrazy = require('./gocrazy');
var ClapperLogic = require('./clapper_logic');

var Scientist = require('zetta-runtime').scientist;

var HelloApp = module.exports = function() {
  this.name = process.env.APP_NAME || 'minifactory';
};

HelloApp.prototype.init = function(zetta) {

  zetta
     .observe('type="button"')
     .zip(zetta.observe('type="arm"'), zetta.observe('type="huehub"'), zetta.observe('type="screen"'), zetta.observe('type="apigee"') )
     .first()
     .subscribe(function(devices){
       console.log('Logic Button Ready')
       var button = devices[0];
       var gocrazy = new GoCrazy(devices[1],devices[2],devices[3],devices[4]);
       button.on('click',function(){
	 gocrazy.notify();
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
          screen.call('change', 'arm: ' + transition,function(){
	    huehub.call('blink');
	  });
        });
      });
    });

  zetta
     .observe('type="sound"')
     .zip(zetta.observe('type="arm"'), zetta.observe('type="huehub"'), zetta.observe('type="screen"'), zetta.observe('type="apigee"') )
     .first()
     .subscribe(function(devices){
       console.log('Logic Sound Ready')
       var sound = devices[0];
       var gocrazy = new GoCrazy(devices[1],devices[2],devices[3],devices[4]);
       var clapper = Scientist.configure(ClapperLogic, sound, gocrazy);
       zetta.expose(clapper);
     });

  zetta.on('deviceready',function(device){
    zetta.expose(device);
  });

  var system = zetta.configure(System);
  zetta.expose(system);
};
