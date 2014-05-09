var ClapperLogic = module.exports = function(sound,gocrazy) {
  this.type = 'clapper';
  this.name = 'ClapperLogic';
  this.state = 'enabled';
  
  this.lower = 30;
  this.upper = 100;

  this._sound = sound;
  this._gocrazy = gocrazy;
};

ClapperLogic.prototype.init = function(config) {
  config
    .when('enabled', { allow: ['parameters','disable'] })
    .when('disabled', { allow: ['parameters','enable'] })
    .map('parameters', this.updateParameters,[{type: 'number', name: 'upper' }, {type: 'number', name: 'lower'}])
    .map('enable', this.enable)
    .map('disable', this.disable)
  
  
  var self = this;
  var lastY = undefined;
  var dy = undefined;
  var Rs = 3;
  var R = [];

  this._sound.on('update', function(val){
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

      if(Math.abs(R[0]) < self.lower && R[1] > self.upper && R[2] < (0-self.upper) ){
	if(self.state === 'enabled')
	  self._gocrazy.notify();
      }
    }
  });

};

ClapperLogic.prototype.updateParameters = function(upper, lower, cb) {
  this.upper = Number(upper);
  this.lower = Number(lower);
  cb();
};

ClapperLogic.prototype.enable = function(cb) {
  this.state = 'enabled';
  cb();
};

ClapperLogic.prototype.disable = function(cb) {
  this.state = 'disabled';
  cb();
};

