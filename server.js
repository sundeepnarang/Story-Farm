var express  = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
var port     = process.env.PORT || 8080;
var objects = {};
var texture = {};
var num = {};
//var Leap = require('leapjs');//require('../leapjs/lib/index').Leap;
//var t = require('leapjs');
//console.log("-------",t)
// var previousFrame;
// var paused = false;

// // Setup Leap loop with frame callback function
// var controllerOptions = {
//   enableGestures: true
// };

// Leap.loop(controllerOptions, function(frame, done) {
//   if (paused) {
//     return; // Skip this update
//   }
  

//   // Hand object data
//   if (frame.hands.length > 0) {
//     if (frame.hands.length == 1) {
//       console.log(
//         vectorToList(frame.hands[0].palmPosition) + " "+
//         vectorToList(frame.hands[0].palmNormal) + 
//         // when there is no second hand put a bunch of zeros. 
//         " 0 0 0 0 0 0" + 
//         "\r\n"	);
//       p = ""
//       if(frame.pointables[0]){
//   		p = frame.pointables[0].tipPosition;

//   		console.log("point - ",p)
//  	 	}

//       io.sockets.emit("leap",
//         vectorToList(frame.hands[0].palmPosition) +" "+ 
//         vectorToList(frame.hands[0].palmNormal) + 
//         // when there is no second hand put a bunch of zeros. 
//         " 0 0 0 0 0 0",frame.gestures[0],p);


//     } else {
//       console.log(
//         vectorToList(frame.hands[0].palmPosition) +" "+
//         vectorToList(frame.hands[0].palmNormal) +" "+
//         // when there is a second hand, show the palm position and normal for the second hand.
//         vectorToList(frame.hands[1].palmPosition) +" "+
//         vectorToList(frame.hands[1].palmNormal) +
//         "\r\n");

//       p = ""
//       if(frame.pointables[0]){
//   		p = frame.pointables[0].tipPosition;
//   		console.log("point - ",p)
//  	 }
//       io.sockets.emit("leap",
//         vectorToList(frame.hands[0].palmPosition) +" "+
//         vectorToList(frame.hands[0].palmNormal) +" "+
//         // when there is a second hand, show the palm position and normal for the second hand.
//         vectorToList(frame.hands[1].palmPosition) +" "+
//         vectorToList(frame.hands[1].palmNormal),frame.gestures[0],p
//         );
//     }
//   }

//   previousFrame = frame;
//   done();
// })

// function vectorToList(vector, digits) {
//   if (typeof digits === "undefined") {
//     digits = 3;
//   }
//   return vector[0].toFixed(digits) + " " + vector[1].toFixed(digits) + " " + vector[2].toFixed(digits) + "";
// }



var routesLib = require('./javascripts/routesLib.js');
var fs = require('fs');

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating
});


// routes ======================================================================
require('./app/routes.js')(app,fs,routesLib); // load our routes and pass in our app and fully configured passport

server.listen(port);

io.set('log level', 1);
 
io.sockets.on('connection', function(socket) {

	if(objects[socket.handshake.address.address]){
		socket.emit("register",objects[socket.handshake.address.address],texture[socket.handshake.address.address] ,num[socket.handshake.address.address]);
	

	}else{
		
		objects[socket.handshake.address.address] = {};
		texture[socket.handshake.address.address] = "default";
		num[socket.handshake.address.address] = 0;
	}
	

	socket.on("createObject",function(data,number){
		console.log("createObject - ",arguments); 
		objects[socket.handshake.address.address][data.name] = data;
		num[socket.handshake.address.address] = number;
		
	});
	
	socket.on("updatePos",function(name,data){
		console.log("updatePos - ",arguments);
		objects[socket.handshake.address.address][name].pos = data; 
		
	});
	
	socket.on("updateDim",function(name,data){
		console.log("updateDim - ",arguments);
		objects[socket.handshake.address.address][name].dimensions = data; 
		console.log(objects);
		
	});
	
	socket.on("changeTexture",function(data){
		console.log("changeTexture - ",arguments);
		texture[socket.handshake.address.address] = data;
		
	});

	socket.on("remove",function(name){
		console.log("remove - ",arguments);
		delete objects[socket.handshake.address.address][name];
	})
});