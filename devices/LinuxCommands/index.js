var util = require('util');
var Scout = require('zetta').Scout;
var System = require('./system');

var SystemScout = module.exports = function(){
  Scout.call(this);
}
util.inherits(SystemScout, Scout);

SystemScout.prototype.init = function(next){
  var self = this;
  var query = self.server.where({ type: 'system' });
  self.server.find(query, function(err, results) {
    if(err) {
      return;
    }
    if (results.length) {
      self.provision(results[0], System);
    } else {
      self.discover(System);
    }
  });
  next();
};


