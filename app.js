var System = require('./system');
var GoCrazy = require('./gocrazy');

var HelloApp = module.exports = function() {
  this.name = process.env.APP_NAME || 'hello';
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
       
       var lastY = undefined;
       var dy = undefined;
       
       var Rs = 3;
       var R = [];
       var low = 30;
       var high = 100;

       sound.on('update', function(val){
	 if(lastY === undefined){
	   lastY = Number(val);
	   return;
	 }

	 dy = val - lastY;
	 lastY = Number(val);
	 
	 if(R.length < Rs){
	   R.push(dy);
	 }else{
	   R.shift();
	   R.push(dy);

	   if(Math.abs(R[0]) < low && R[1] > high && R[2] < (0-high) ){
	     gocrazy.notify();
	   }
	 }	 
       });

     });

  zetta.on('deviceready',function(device){
    zetta.expose(device);
  });

  var system = zetta.configure(System);
  zetta.expose(system);
};
