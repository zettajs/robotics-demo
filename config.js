var HueScout = require('zetta-hue-driver');
var PushNotificationScout = require('zetta-apigee-driver');

module.exports = function(runtime) {
  runtime.scouts.push(HueScout);
  runtime.scouts.push(PushNotificationScout);
};
