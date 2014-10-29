var zetta = require('zetta');

var Hue = require('zetta-hue-driver');
var PushNotification = require('zetta-apigee-driver');
var EnvSensors = require('./devices/EnvSensors');
var SoundLightSensors = require('./devices/SoundLightSensors');
var LinuxCommands = require('./devices/LinuxCommands');
var RobotArm = require('./devices/RobotArm');
var DisplayScreen = require('./devices/DisplayScreen');
var PhoneAccelerometer = require('./devices/PhoneAccelerometer/phone_accelerometer');

var ButtonPressApp = require('./apps/button_press');
var ClapperApp = require('./apps/clapper');
var HueArmBlink = require('./apps/hue_arm_blink');
var ScreenUpdateApp = require('./apps/screen_update');

var PORT = process.env.PORT || 3000;

zetta()
  .name(process.env.ZETTA_NAME || 'local')
  .expose('*')
  .use(Hue)
  .use(PushNotification)
  .use(EnvSensors)
  .use(SoundLightSensors)
  .use(LinuxCommands)
  .use(RobotArm)
  .use(DisplayScreen, process.env.SCREEN_DEVICE)
  .use(PhoneAccelerometer, { http_device: true })
  .load(ClapperApp)
  .load(HueArmBlink)
  .load(ScreenUpdateApp)
  .link(process.env.ZETTA_CLOUD || 'http://zetta-cloud-2.herokuapp.com')
  .link('http://zetta-instructor.herokuapp.com/')
  .listen(PORT, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Listening on port', PORT);
  });
