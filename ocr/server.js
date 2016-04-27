// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var tesseract 	   = require('ntesseract');
var path		   = require('path');
var exec 		   = require('child_process').exec;
var formidable 	   = require('formidable'),
	http 		   = require('http'),
	util 		   = require('util'),
	fs 	 		   = require('fs');


// set our port
var port = process.env.PORT || 8080; 


// set the static files location /public/img will be /img for users
 app.use(express.static(__dirname + '/public')); 



// routes ==================================================
  // require('./routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, ',/', 'index.html'));
});

app.get('/view', function(req, res){
	res.sendFile(path.join(__dirname, './', './page.html'));
});
app.post('/upload', function(req, res){	
	 
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files){
	 	fs.rename(files.upload.path, './temp.png');
	 	res.writeHead(200, {'content-type': 'text/html'});
		res.write('Uploading...<head><meta http-equiv="refresh" content="1; url=./tess"></meta></head>');
		res.end();
	});
});

app.get('/tess', function(req, res){

	tesseract.process(__dirname + './temp.png', function(err, text){
            if(err) {
                res.send("Oops, an error occured. Sorry!");
            }
            else{
            	fs.writeFile('tessOutput.txt', text, function(err){
            		if(err) console.log("You done fucked up");
            	});
            	res.writeHead(200, {'content-type': 'text/html'});
                res.write('Reading image...<head><meta http-equiv="refresh" content="1; url=./view"></meta></head>');
            	res.end();
            }
        });
});

