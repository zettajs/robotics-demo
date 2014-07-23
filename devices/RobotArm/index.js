var util = require('util');
var Scout = require('zetta').Scout;
var RobotServer = require('./robot_server');
var RobotArm = require('./robot_arm');

var RobotArmScout = module.exports = function(){
  Scout.call(this);
  this.updServer = new RobotServer();
}
util.inherits(RobotArmScout, Scout);

RobotArmScout.prototype.init = function(next){
  var self = this;
  this.updServer.start();
  this.updServer.on('online', function(socket, port, ip){    
    var query = self.server.where({ type: 'arm' });
    self.server.find(query, function(err, results) {
      if(err) {
        return;
      }
      if (results.length) {
        self.provision(results[0], RobotArm, socket, port, ip);
      } else {
        self.discover(RobotArm, socket, port, ip);
      }
    });
  });
  next();
};


