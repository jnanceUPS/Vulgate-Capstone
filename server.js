var mongodb = require('mongodb'),
http = require('http'),
fs = require('fs'),
express = require('express'),
mongoose = require('mongoose'),
path = require('path'),
app = express(),
bodyParser = require('body-parser');

// var spawn = require('child_process').spawn;
// var child = spawn('java', ['params1', 'param2']);
var session = require('express-session');
var async = require('async');
var Busboy = require('busboy'); //For multi-form data handling

var stopwords = {'ille':true,'illa':true,'illud':true,'illi':true,'illae':true,'illius':true,'illorum':true,'illarum':true,'illis':true,'illum':true,'illam':true,'illos':true,'illas':true,'illo':true,'ac':true,'at':true,'atque':true,'aut':true,'et':true,'nec':true,'non':true,'sed':true,'vel':true,'antequam':true,'cum':true,'dum':true,'si':true,'usque':true,'ut':true,'qui':true,'quae':true,'quod':true,'cuius':true,'cui':true,'quem':true,'quam':true,'quo':true,'qua':true,'quorum':true,'quarum':true,'quibus':true,'quos':true,'quas':true,'ante':true,'per':true,'ad':true,'propter':true,'circum':true,'super':true,'contra':true,'versus':true,'inter':true,'extra':true,'intra':true,'trans':true,'post':true,'sub':true,'in':true,'ob':true,'praeter':true,'a':true,'ab':true,'sine':true,'de':true,'pro':true,'prae':true,'e':true,'ex':true,'est':true,'ejus':true,'sunt':true,'eum':true,'que':true,'me':true,'quia':true,'enim':true,'te':true,'eos':true,'eorum':true,'ego':true,'ei':true,'hec':true,'omnes':true,'eis':true,'vos':true,'dixit':true,'tibi':true,'vobis':true,'eo':true,'mihi':true,'ait':true,'erat':true,'rex':true,'quoniam':true,'ne':true,'eam':true,'tua':true,'erit':true,'hoc':true,'dicit':true,'nos':true,'mea':true,'suum':true,'suis':true,'tu':true,'dicens':true,'tuum':true,'sum':true,'suam':true,'quid':true,'meum':true,'ipse':true,'suo':true,'tui':true,'quoque':true,'sua':true,'erant':true,'se':true,'neque':true,'quis':true,'deo':true,'es':true,'tuam':true,'ea':true,'mei':true,'nobis':true,'meam':true,'nunc':true,'meus':true,'tuo':true,'sic':true,'cumque':true,'sit':true,'omni':true,'tuus':true,'sui':true,'meo':true,'esset':true,'his':true,'fuit':true,'tue':true,'fuerit':true,'tuis':true,'sue':true,'hic':true,'sibi':true,'esse':true,'ubi':true,'ipsi':true,'suos':true,'suas':true,'dicentes':true,'etiam':true,'erunt':true,'nostri':true,'malum':true,'quidem':true,'estis':true,'vestra':true,'hi':true,'tuos':true,'meis':true,'hanc':true,'vestris':true,'cujus':true,'sumus':true,'mee':true,'dico':true,'nam':true,'sive':true,'tecum':true,'iste':true,'vestri':true,'hujus':true,'eas':true,'vestrum':true,'noster':true,'quidam':true,'tamquam':true,'suorum':true,'meos':true,'amen':true,'tuas':true,'mecum':true,'tuorum':true,'nostrum':true,'hac':true,'nostra':true,'vester':true,'nostris':true,'ipso':true,'earum':true,'hunc':true,'ipsum':true,'sint':true,'dices':true,'fuerint':true,'ideo':true,'ipsa':true,'nostro':true,'isti':true,'ipsius':true,'tam':true,'eris':true,'istum':true,'quidquam':true,'meas':true,'ero':true,'vestre':true,'quidquid':true,'vestro':true,'quicumque':true,'vivit':true,'ipsis':true,'vestros':true,'aliquid':true,'ipsorum':true,'tamen':true,'huic':true,'vestram':true,'nostre':true,'isto':true,'nostros':true,'nobiscum':true,'huc':true,'suarum':true,'illic':true,'vestrorum':true,'eadem':true,'nostras':true,'eodem':true,'nostram':true,'eritis':true,'suus':true,'hos':true,'istam':true,'quodcumque':true,'dicitur':true,'dicat':true,'dicent':true,'fui':true,'dixisti':true,'dicam':true,'dicis':true,'istis':true,'quocumque':true,'adhic':true,'aliqui':true,'aliquis':true,'an':true,'apud':true,'autem':true,'cur':true,'deinde':true,'ergo':true,'etsi':true,'fio':true,'haud':true,'iam':true,'idem':true,'igitur':true,'infra':true,'interim':true,'is':true,'ita':true,'magis':true,'modo':true,'ox':true,'necque':true,'nisi':true,'o':true,'possum':true,'quare':true,'quilibet':true,'quisnam':true,'quisquam':true,'quisque':true,'quisquis':true,'tum':true,'uel':true,'uero':true,'unus':true};
//var stopwords = {};
var vulgateDB = mongoose.createConnection('mongodb://localhost:27017/vulgate');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'who cares',
	resave: true,
	saveUninitialized: true
}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, ',/', 'index.html'));
});

var Reference = vulgateDB.model('Reference', 
	mongoose.Schema({
		_id: String,
		index: Array
	}),'index');

var sess; // Stores Session
var vulgate = [];

// Matches words from the text to the Vulgate and sends all found references to the DOM.
// Sent data has structure:
// [{
// 	'sentence': 'Domus orationis spelunca latronum facta est, et...',
// 	'refs': [{
// 		'w1': 'domus',
// 		'w2': 'orationis',
// 		'inds': ['1:2:3','4:5:6']
// 	}, ...]
// }, ...]
var matchAndSend = function(text) {
	var sen = text.split(/\.\s/g);
	//need to send this so angular can open the right amount of get requests
	app.get('/length', function(req, res){
		res.send({'length': sen.length});
	});
	for(var i=0; i<sen.length;i++){
		(function(i) {
			var url = '/searchResults/' + i;  
			app.get(url, function(req, res){
				var str = sen[i].toLowerCase().replace(/[^\w ]+/g, '').split(" ");
				str = unique_and_stop(str);
				Reference.find({'_id': { $in: str }},function(err, data){
					var refs = getMatchingWords(data);			
					if (refs.length != 0) {
						res.send({'sentence': sen[i], 'refs': refs});
					} else res.end();

				});	
			});
		})(i);
	}
};


var getRef2 = function(sen, callback){
	var str = sen.toLowerCase().replace(/[^\w ]+/g, '').split(" ");
	str = unique_and_stop(str);
	str.sort();
	var queries = [];

	for (var i = 0; i < str.length-1; i++){
		for(var j = i+1; j < str.length; j++){
			queries.push(str[i] + " " +  str[j]);
		}
	}
	Reference.find({'_id': { $in: queries }},function(err, data){
		//var refs = getMatchingWords(data);
		keepCount(data);
		var refs = parseData(data);	
		if (refs.length != 0) {
			//console.log(sen);
			callback(null,{'sentence': sen, 'hasRefs': true,'refs': refs});
		} else {
			//console.log(sen);
			callback(null,{'sentence': sen, 'hasRefs': false});
		}
	});	
}

var parseData = function(data){
	var refs = [];
	for (var i = 0; i < data.length; i++){
		var words = data[i]._id.split(" ");
		refs.push({'w1': words[0], 'w2': words[1], 'inds': data[i].index});
	}
	return refs;
}


var getRef = function(sen, callback){
	//console.log(sen);
	var str = sen.toLowerCase().replace(/[^\w ]+/g, '').split(" ");
	str = unique_and_stop(str);
	Reference.find({'_id': { $in: str }},function(err, data){
		var refs = getMatchingWords(data);
		//keepCount(data);	
		if (refs.length != 0) {
			callback(null,{'sentence': sen, 'hasRefs': true,'refs': refs});
		} else callback(null,{});
	});	
}


var matchAndSend2 = function(){
	app.post('/sss', function(req, res){
		async.map(sess.matched,getRef2, function(err, results){	
			console.log(Date.now()-sess.date);
			res.send({'results': results , 'books': sess.books, 'freqs': sess.freqs});
		});
	});
}

//Gets file from Controller
app.post('/upload/url', function(req, res){
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);


		fs.readFile(filename,'utf8',function(err, data){
			if (err) throw err;
			else {
				var sen = data.split(/\.\s/g);
				sess = req.session;
				sess.matched = sen;
				sess.books = [], sess.freqs = [];
				sess.date = Date.now();
				matchAndSend2();
			}
		});

		file.on('data', function(data){});
	});
	busboy.on('finish', function() {
		res.end();
	});
	req.pipe(busboy);
});


fs.readdir('./vulgate_bible/ordered_version/', function(err, filenames) {
	if (err) {
		console.log(err);
		return;
	}
	async.map(filenames, function(filename, callback){
		fs.readFile('./vulgate_bible/ordered_version/' + filename, 'utf8', function(err, content) {
			if (err) {
				console.log(err);
				return;
			}
			callback(null,content);
		});
	}, function(err, results){
		vulgate = results;
		postVulgate();
	});
});


function postVulgate() {
	app.post('/vulgate', function(req, res){
		res.send({'vulgate': vulgate});
	});
}

app.listen(8080);

//gets rid of duplicate words and stop words in the sentence
function unique_and_stop(array){
	var seen = JSON.parse(JSON.stringify(stopwords)); //deep copy
	return array.filter(function(item) {
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
}

//gets rid of all unique things
function remove_uniques(a1, a2){
	return a1.filter(function(item) {
		return a2.indexOf(item)>=0 ? true : false;
	});
}

/** 
* Gets all pairs of words with matching indices.
* @param [{Data}] data object array, defined as [{'_id': word, 'index': '1:2:3'}, ...]
* @return [{Reference}] reference object array, defined as [{'w1': word1,'w2': word2, 'inds': ['1:2:3', ...]}, ...]
*/
function getMatchingWords(data){
	var refs = [];
	for (var i = 0; i < data.length-1; i++){
		for(var j = i+1; j < data.length; j++){
			var items = remove_uniques(data[i].index,data[j].index);
			if (items.length != 0) refs.push({'w1': data[i]._id, 'w2': data[j]._id,'inds': items });
		}
	}
	return refs;
}



function keepCount(data){
	for(var i = 0; i < data.length; i++){
		for (var j = 0; j < data[i].index.length; j++){
			var ind = data[i].index[j].split(" [")[0];
			var pos = sess.books.indexOf(ind);
			if(pos < 0) {
				sess.books.push(ind);
				sess.freqs.push(1);
			}
			else sess.freqs[pos]++;
		}
	}
}

function utf16to8(str) {
	var out, i, len, c;

	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}

function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = str.length;
	i = 0;
	while(i < len) {
		c = str.charCodeAt(i++);
		switch(c >> 4)
		{ 
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	    // 0xxxxxxx
	    out += str.charAt(i-1);
	    break;
	    case 12: case 13:
	    // 110x xxxx   10xx xxxx
	    char2 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	    break;	
	    case 14:
	    // 1110 xxxx  10xx xxxx  10xx xxxx
	    char2 = str.charCodeAt(i++);
	    char3 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x0F) << 12) |
	    	((char2 & 0x3F) << 6) |
	    	((char3 & 0x3F) << 0));
	    break;
	 }
	}

	return out;
}

		// async.waterfall([
		// 	function(callback){
		// 		fs.readFile(filename,'utf8',function(err, data){
		// 			callback(null, data);
		// 		});
		// 	},
		// 	function(data, callback){
		// 		var sen = data.split(/\.\s/g);
		// 		async.map(sen,getRef, function(err, results){
		// 			callback(null, results);
		// 		});
		// 	},
		// 	function(results, callback){
		// 		app.post('/sss', function(req, res){
		// 							console.log(results);

		// 			res.send(results);
		// 		});
		// 		callback(null,"done");
		// 	}] );