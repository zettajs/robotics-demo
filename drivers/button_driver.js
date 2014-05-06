var ButtonDriver = module.exports = function() {
  this.type = 'button';
  this.name = 'ActivateButton';
  this.state = 'up';
};

ButtonDriver.prototype.init = function(config) {
  config
    .when('down', { allow: ['lift', 'click'] })
    .when('up', { allow: ['press', 'click'] })
    .map('press', this.press)
    .map('lift', this.lift)
    .map('click', this.click)
};

ButtonDriver.prototype.lift = function(cb) {
  this.state = 'up';
  cb();
};

ButtonDriver.prototype.press = function(cb) {
  this.state = 'down';
  cb();
};

ButtonDriver.prototype.click = function(cb) {
  var self = this;
  this.press(function() {
    self.lift(cb);
  });
};
