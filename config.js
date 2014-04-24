var HueScout = require('zetta-hue-driver');

module.exports = function(runtime) {
  runtime.scouts.push(HueScout);
};
