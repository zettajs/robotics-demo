module.exports = function(server) {
  
  var button = server.where({ type: 'button' });

  var arm = server.where({ type: 'arm' });
  var huelight = server.where({ type: 'huebulb', bulbName: 'Zetta Demo' });
  var display = server.where({ type: 'display' });
  var apigee = server.where({ type: 'apigee' });

  server
    .observe([button, arm, huelight, display, apigee], function(button, arm, huelight, display, apigee){
      server.log('Button Logic Activated');
      var gocrazy = new GoCrazy(arm, huelight, display, apigee);
      button.on('click',function(){
	gocrazy.notify();
      });
    });

}
