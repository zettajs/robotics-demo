var zetta = require('zetta');

var Hue = require('zetta-hue-driver');
var PushNotification = require('zetta-apigee-driver');
var EnvSensors = require('./devices/EnvSensors');
var SoundLightSensors = require('./devices/SoundLightSensors');

zetta()
  .name(process.env.ZETTA_NAME)
  .expose('*')
  .use(EnvSensors)
  .use(SoundLightSensors)
  .link(process.env.ZETTA_CLOUD || 'http://zetta-cloud.herokuapp.com')
  .listen(process.env.PORT || 3000);
