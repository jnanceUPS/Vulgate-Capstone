var mongodb = require('mongodb'),
http = require('http'),
fs = require('fs'),
jsdom = require('jsdom');

var jquery = fs.readFileSync("./lib/jquery-2.2.0.min.js", "utf-8");



fs.readFile('./index.html', function(err, html){
	if (err) {
		throw err;
	}
	http.createServer(function (req, res) {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write('<h1>HI</h1>');
		res.write(y);		
		res.write(html);
		res.end();
	}).listen(8080);
});

var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/vulgate";
var y;

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Cant connect to the MongoDB server. Error:', err);
	} else {

        console.log('Connected to', url);

        var collection = db.collection('index');
        var x = "aaron";

        collection.find().toArray(function(err, items){
            console.log(x, items[0][x][1]);
            y = items[0][x][1];
        });    
    }
});

