var async = require('async');

var GoCrazy = module.exports = function(arm,hue,screen,push) {

  this.arm = arm;
  this.screen = screen;
  this.hue = hue;
  this.push = push;

};

GoCrazy.prototype.notify = function() {
  
  this._moveArm();
  this._flashHue();
  this.screen.call('change','Alarm was raised!', function(){});
  this.push.call('push','Alarm was raised!', function(){});
};


GoCrazy.prototype._flashHue = function() {
  if(this.hue.state !== 'registered'){
    console.log('hue not registrerd')
    console.log(this.hue)
    return;
  }
  
  var self = this;
  this.hue.call('color-loop', function(){});
  setTimeout(function(){
    self.hue.call('all-on', function(){});
  },5000)

};


GoCrazy.prototype._moveArm = function() {
  var self = this;
  function F(f,delay){
    return function(cb){
      self.arm.call(f,function(){});
      setTimeout(cb,delay);
    };
  }

  function D(delay){
    return function(cb){
      return setTimeout(cb,delay);
    }
  }
  
  var d = 200;
  async.series([
    F('pivot-right',d),
    F('pivot-right',d),
    D(d*2),
    F('pivot-left',d),
    F('pivot-left',d),
    D(d*2),
    F('pivot-right',d),
    F('pivot-right',d),
    D(d*2),
    F('pivot-left',d),
    F('pivot-left',d),
    D(d*2),    
    F('pivot-right',d),
    F('pivot-right',d),
    D(d*2),
    F('pivot-left',d),
    F('pivot-left',d),
  ],function(){});

  var d2 = 250;
  async.series([
    F('elbow-up',d2),
    F('elbow-up',d2),
    D(d2*2),
    F('elbow-down',d2),
    F('elbow-down',d2),
    D(d2*2),
    F('elbow-up',d2),
    F('elbow-up',d2),
    D(d2*2),
    F('elbow-down',d2),
    F('elbow-down',d2),
    D(d2*2),    
    F('elbow-up',d2),
    F('elbow-up',d2),
    D(d2*2),
    F('elbow-down',d2),
    F('elbow-down',d2),
  ],function(){});



  var d3 = 225;
  async.series([
    F('shoulder-up',d3),
    F('shoulder-up',d3),
    D(d3*2),
    F('shoulder-down',d3),
    F('shoulder-down',d3),
    D(d3*2),
    F('shoulder-up',d3),
    F('shoulder-up',d3),
    D(d3*2),
    F('shoulder-down',d3),
    F('shoulder-down',d3),
    D(d3*2),    
    F('shoulder-up',d3),
    F('shoulder-up',d3),
    D(d3*2),
    F('shoulder-down',d3),
    F('shoulder-down',d3),
    D(d3*2),    
    F('shoulder-up',d3),
    F('shoulder-up',d3),
    D(d3*2),
    D(d3*2),    
    F('shoulder-up',d3),
    F('shoulder-up',d3),

  ],function(){});




/*
  async.series([
    F('elbow-up',d),
    F('elbow-up',d),
    D(d*2),
    F('elbow-down',d),
    F('elbow-down',d),
  ],function(){});
*/
};
