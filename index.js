var $ = require('jquery');
var mongodb = require('mongodb'),
http = require('http'),
fs = require('fs');

$(document).ready(function(){
        var sentence = "et protulit terra herbam virentem et adferentem semen iuxta genus suum lignumque faciens fructum et habens unumquodque sementem secundum speciem suam et vidit Deus quod esset bonum"
        console.log(sentence);
});

fs.readFile('./index.html', function(err, html){
	if (err) {
		throw err;
	}
	http.createServer(function (req, res) {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();
	}).listen(8080);
});

var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/vulgate";

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Cant connect to the MongoDB server. Error:', err);
	} else {

        console.log('Connected to', url);

        var collection = db.collection('index');
        var x = "aaron";

        collection.find().toArray(function(err, items){
            console.log(x, items[0][x][1]);
        });    
    }
});

