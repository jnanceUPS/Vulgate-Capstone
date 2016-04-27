var path = require('path');
var exec = require('child_process').exec;
var formidable 	   = require('formidable'),
	http = require('http'),
	util = require('util'),
	fs 	 = require('fs');


// module.exports = function(app) {


	 // app.get('', function(req, res) {
	 // 	console.log('main page');
  //       res.sendFile(path.join(__dirname, './', './index.html')); // load index.html file
  //       });
	 // app.get('/view', function(req, res){

	 // 	fs.readFile('./temp.pdf', function(err, file) {
  //     		res.writeHead(200, {"Content-Type" : "application/pdf" });
  //     		res.write(file, "binary");
  //     		res.end();
  //   	});
	 // 	//res.sendFile(path.join(__dirname, './', './page.html'));
	 // })
	 // app.post('/upload', function(req, res){
	 	
	 
	 // 	var form = new formidable.IncomingForm();

	 // 	form.parse(req, function(err, fields, files){
	 // 		fs.rename(files.upload.path, './temp.pdf');
	 // 		res.writeHead(200, {'content-type': 'text/html'});
	 // 		res.write('Received upload: <a href="/view">View PDF</a>');
	 // 		res.end();
	 // 	});

		// var cmd = "tesseract 'baldric-01.png' testCmdLine -lat";

		// exec(cmd, function(error, stdout, stderr) {
  // 			// command output is in stdout
		// });

	 // });

}

