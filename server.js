var zetta = require('zetta');

var Hue = require('zetta-hue-driver');
var PushNotification = require('zetta-apigee-driver');
var EnvSensors = require('./devices/EnvSensors');
var SoundLightSensors = require('./devices/SoundLightSensors');
var LinuxCommands = require('./devices/LinuxCommands');

var ButtonPressApp = require('./apps/button_press');
var ClapperApp = require('./apps/clapper');
var HueArmBlink = require('./apps/hue_arm_blink');
var ScreenUpdateApp = require('./apps/screen_update');

zetta()
  .name(process.env.ZETTA_NAME)
  .expose('*')
  .use(EnvSensors)
  .use(SoundLightSensors)
  .use(LinuxCommands)
  .load(ButtonPressApp)
  .load(ClapperApp)
  .load(HueArmBlink)
  .load(ScreenUpdateApp)
  .link(process.env.ZETTA_CLOUD || 'http://zetta-cloud.herokuapp.com')
  .listen(process.env.PORT || 3000);
