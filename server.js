var zetta = require('zetta');

var Hue = require('zetta-hue-driver');
var PushNotification = require('zetta-apigee-driver');
var EnvSensors = require('./devices/EnvSensors');
var SoundLightSensors = require('./devices/SoundLightSensors');
var LinuxCommands = require('./devices/LinuxCommands');
var RobotArm = require('./devices/RobotArm');
var DisplayScreen = require('./devices/DisplayScreen');

var ButtonPressApp = require('./apps/button_press');
var ClapperApp = require('./apps/clapper');
var HueArmBlink = require('./apps/hue_arm_blink');
var ScreenUpdateApp = require('./apps/screen_update');

var app = zetta();
app.id = '5904d29f-62a8-4224-a113-51057b5bd899';

app
  .name(process.env.ZETTA_NAME)
  .expose('*')
  .use(Hue)
  .use(PushNotification)
  .use(EnvSensors)
  .use(SoundLightSensors)
  .use(LinuxCommands)
  .use(RobotArm)
  .use(DisplayScreen, process.env.SCREEN_DEVICE)
  .load(ButtonPressApp)
  .load(ClapperApp)
  .load(HueArmBlink)
  .load(ScreenUpdateApp)
  .link(process.env.ZETTA_CLOUD || 'http://zetta-cloud.herokuapp.com')
  .listen(process.env.PORT || 3000);
