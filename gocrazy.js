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
  this.screen.call('change','Alarm was raised!');
  this.push.call('push','Alarm was raised!');
};


GoCrazy.prototype._flashHue = function() {
  if(this.hue.state !== 'registered'){
    console.log('hue not registrerd')
    console.log(this.hue)
    return;
  }
  
  var self = this;
  this.hue.call('color-loop');
  setTimeout(function(){
    self.hue.call('all-on');
  },5000)

};


GoCrazy.prototype._moveArm = function() {
  var self = this;
  function F(f,delay){
    return function(cb){
      self.arm[f](function(){});
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
    F('pivotRight',d),
    F('pivotRight',d),
    D(d*2),
    F('pivotLeft',d),
    F('pivotLeft',d),
    D(d*2),
    F('pivotRight',d),
    F('pivotRight',d),
    D(d*2),
    F('pivotLeft',d),
    F('pivotLeft',d),
    D(d*2),    
    F('pivotRight',d),
    F('pivotRight',d),
    D(d*2),
    F('pivotLeft',d),
    F('pivotLeft',d),
  ],function(){});

  var d2 = 250;
  async.series([
    F('elbowUp',d2),
    F('elbowUp',d2),
    D(d2*2),
    F('elbowDown',d2),
    F('elbowDown',d2),
    D(d2*2),
    F('elbowUp',d2),
    F('elbowUp',d2),
    D(d2*2),
    F('elbowDown',d2),
    F('elbowDown',d2),
    D(d2*2),    
    F('elbowUp',d2),
    F('elbowUp',d2),
    D(d2*2),
    F('elbowDown',d2),
    F('elbowDown',d2),
  ],function(){});



  var d3 = 225;
  async.series([
    F('shoulderUp',d3),
    F('shoulderUp',d3),
    D(d3*2),
    F('shoulderDown',d3),
    F('shoulderDown',d3),
    D(d3*2),
    F('shoulderUp',d3),
    F('shoulderUp',d3),
    D(d3*2),
    F('shoulderDown',d3),
    F('shoulderDown',d3),
    D(d3*2),    
    F('shoulderUp',d3),
    F('shoulderUp',d3),
    D(d3*2),
    F('shoulderDown',d3),
    F('shoulderDown',d3),
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
