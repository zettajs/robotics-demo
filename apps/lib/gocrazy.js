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
  var self = this;
  this.hue.call('color-loop', function(){});
  setTimeout(function(){
    self.hue.call('all-on', function(){});
  },5000)
};


GoCrazy.prototype._moveArm = function() {
  var self = this;
  function F(f, dir, delay){
    return function(cb){
      self.arm.call(f, dir, function(err){
        if (err) {
          console.error('gocrazy arm error:', err);
        }
      });
      setTimeout(cb, delay);
    };
  }

  function D(delay){
    return function(cb){
      return setTimeout(cb,delay);
    }
  }
  
  var d = 200;
  async.series([
    F('pivot', 'right', d),
    F('pivot', 'right', d),
    D(d*2),
    F('pivot', 'left', d),
    F('pivot', 'left', d),
    D(d*2),
    F('pivot', 'right', d),
    F('pivot', 'right', d),
    D(d*2),
    F('pivot', 'left', d),
    F('pivot', 'left', d),
    D(d*2),    
    F('pivot', 'right', d),
    F('pivot', 'right', d),
    D(d*2),
    F('pivot', 'left', d),
    F('pivot', 'left', d),
  ],function(){});

  var d2 = 250;
  async.series([
    F('move-elbow', 'up', d2),
    F('move-elbow', 'up', d2),
    D(d2*2),
    F('move-elbow', 'down', d2),
    F('move-elbow', 'down', d2),
    D(d2*2),
    F('move-elbow', 'up', d2),
    F('move-elbow', 'up', d2),
    D(d2*2),
    F('move-elbow', 'down', d2),
    F('move-elbow', 'down', d2),
    D(d2*2),    
    F('move-elbow', 'up', d2),
    F('move-elbow', 'up', d2),
    D(d2*2),
    F('move-elbow', 'down', d2),
    F('move-elbow', 'down', d2),
  ],function(){});

  var d3 = 225;
  async.series([
    F('move-shoulder', 'up', d3),
    F('move-shoulder', 'up', d3),
    D(d3*2),
    F('move-shoulder', 'down', d3),
    F('move-shoulder', 'down', d3),
    D(d3*2),
    F('move-shoulder', 'up', d3),
    F('move-shoulder', 'up', d3),
    D(d3*2),
    F('move-shoulder', 'down', d3),
    F('move-shoulder', 'down', d3),
    D(d3*2),    
    F('move-shoulder', 'up', d3),
    F('move-shoulder', 'up', d3),
    D(d3*2),
    F('move-shoulder', 'down', d3),
    F('move-shoulder', 'down', d3),
    D(d3*2),    
    F('move-shoulder' ,'up', d3),
    F('move-shoulder', 'up', d3),
    D(d3*2),
    D(d3*2),    
    F('move-shoulder', 'up', d3),
    F('move-shoulder', 'up', d3),

  ],function(){});

};
