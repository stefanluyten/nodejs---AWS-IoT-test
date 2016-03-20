var awsIot = require('aws-iot-device-sdk');

var client = "Mac"

var device = awsIot.thingShadow({
   keyPath: 'private.key',
  certPath: 'certificate.crt',
    caPath: 'root.crt',
  clientId: client,
    region: 'eu-west-1'
});

var clientTokenUpdate;
var clientTokenGet;

var temp = random(36.0,38.5);
var heartrate = 93;
var activity = 1020;

device.on('connect', function() {
    console.log('connected ... \n')
    device.register(client)
    device.subscribe("MacStats", 0,function(error, result) {
      console.log(result);
    });

    setTimeout( function() {
       var patientState = {"state":{"desired":{"temp":random(36.0,38.5),"heartrate":randomIntInc(60,120),"activity":randomIntInc(400,1200)}}};
       clientTokenUpdate = device.update(client, patientState  );
       if (clientTokenUpdate === null)
       {
          console.log('update shadow failed, operation still in progress\n');
       }
    }, 3000 );
});

device.on('status', 
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject)+'\n');
    });

device.on('delta', 
    function(thingName, stateObject) {
       console.log('received delta on '+thingName+': '+
                   JSON.stringify(stateObject)+'\n');
    });

device.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken+'\n');
     });

device.on('foreignStateChange',
    function(thingName, clientToken) {
       console.log('received foreignStateChange on '+thingName+
                   ' with token: '+ clientToken+'\n');
     });
/*
device.on('message', 
    function(topic, payload) {
      console.log('message', topic, payload.toString());
    });*/

function random (low, high) {
    return Math.random() * (high - low) + low;
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
