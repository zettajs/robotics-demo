module.exports = function(server) {
  
  var button = server.where({ type: 'button' });

  var arm = server.where({ type: 'arm' });
  var huehub = server.where({ type: 'huehub' });
  var display = server.where({ type: 'display' });
  var apigee = server.where({ type: 'apigee' });

  server
    .observe([button, arm, huehub, display, apigee], function(button, arm, huehub, display, apigee){
      server.log('Button Logic Activated');
      var gocrazy = new GoCrazy(arm, huehub, display, apigee);
      button.on('click',function(){
	gocrazy.notify();
      });
    });

}
