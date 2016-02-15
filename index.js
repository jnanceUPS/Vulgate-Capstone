var mongodb = require('mongodb'),
http = require('http'),
fs = require('fs'),
jsdom = require('jsdom'),
express = require('express'),
angular = require('angular'),
app = express();

var jquery = fs.readFileSync("./lib/jquery-2.2.0.min.js", "utf-8");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/vulgate";
var y;
var collection;

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Cant connect to the MongoDB server. Error:', err);
	} else {

		console.log('Connected to', url);

		collection = db.collection('index');
		var x = "aaron";

		//findWordRefs(collection, "aaronitis");

		collection.find().toArray(function(err, items){
			console.log(x, items[0][x][1]);
			y = items[0][x][1];
		});    
		//reader();
	} 
});

function findWordRefs(collection, word){
	collection.find().toArray(function(err, items){
		if (err) throw err;
		else {
			console.log(items[0][word]);
			return items[0][word];
		}
	});
}

function reader() { 
	fs.readFile('./baldric.txt','utf-8', function(err, data){
		if (err) {
			throw err;
		}
	//console.log(data);
	var b_words = data.split(" ");

		// collection.find().toArray(function(err, items){
		// 	console.log(b_words[0], items[0][b_words][1]);
		// });    
	// for (var i = 0; i < 10; i++){
	 //	console.log(b_words[i]);
	 //	collection.find().toArray(function(err, items){
	 	//	if (items===undefined) return;
	 	//	console.log(b_words[i], items[0][b_words]);
//	 		console.log(b_words[i], items[0][b_words][1]);
//	 	});    
//	 }
	// contains proper name
	// two or more words are the same
});
}

fs.readFile('./index.html', function(err, html){
	if (err) {
		throw err;
	}
	http.createServer(function (req, res) {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write('<h1>Header</h1>');
		res.write(y);		
		res.write(html);
		res.end();
	}).listen(8080);
});


	var app = angular.module('myApp', []);
	app.controller('myCtrl', function($scope) {
		$scope.button = "FUCK YOU";
	});


