var mongodb = require('mongodb'),
http = require('http'),
fs = require('fs'),
express = require('express'),
mongoose = require('mongoose'),
path = require('path'),
app = express(),
bodyParser = require('body-parser');

var Busboy = require('busboy'); //For multi-form data handling

var stopwords = {'ille':true,'illa':true,'illud':true,'illi':true,'illae':true,'illius':true,'illorum':true,'illarum':true,'illis':true,'illum':true,'illam':true,'illos':true,'illas':true,'illo':true,'ac':true,'at':true,'atque':true,'aut':true,'et':true,'nec':true,'non':true,'sed':true,'vel':true,'antequam':true,'cum':true,'dum':true,'si':true,'usque':true,'ut':true,'qui':true,'quae':true,'quod':true,'cuius':true,'cui':true,'quem':true,'quam':true,'quo':true,'qua':true,'quorum':true,'quarum':true,'quibus':true,'quos':true,'quas':true,'ante':true,'per':true,'ad':true,'propter':true,'circum':true,'super':true,'contra':true,'versus':true,'inter':true,'extra':true,'intra':true,'trans':true,'post':true,'sub':true,'in':true,'ob':true,'praeter':true,'a':true,'ab':true,'sine':true,'de':true,'pro':true,'prae':true,'e':true,'ex':true,'est':true,'ejus':true,'sunt':true,'eum':true,'que':true,'me':true,'quia':true,'enim':true,'te':true,'eos':true,'eorum':true,'ego':true,'ei':true,'hec':true,'omnes':true,'eis':true,'vos':true,'dixit':true,'tibi':true,'vobis':true,'eo':true,'mihi':true,'ait':true,'erat':true,'rex':true,'quoniam':true,'ne':true,'eam':true,'tua':true,'erit':true,'hoc':true,'dicit':true,'nos':true,'mea':true,'suum':true,'suis':true,'tu':true,'dicens':true,'tuum':true,'sum':true,'suam':true,'quid':true,'meum':true,'ipse':true,'suo':true,'tui':true,'quoque':true,'sua':true,'erant':true,'se':true,'neque':true,'quis':true,'deo':true,'es':true,'tuam':true,'ea':true,'mei':true,'nobis':true,'meam':true,'nunc':true,'meus':true,'tuo':true,'sic':true,'cumque':true,'sit':true,'omni':true,'tuus':true,'sui':true,'meo':true,'esset':true,'his':true,'fuit':true,'tue':true,'fuerit':true,'tuis':true,'sue':true,'hic':true,'sibi':true,'esse':true,'ubi':true,'ipsi':true,'suos':true,'suas':true,'dicentes':true,'etiam':true,'erunt':true,'nostri':true,'malum':true,'quidem':true,'estis':true,'vestra':true,'hi':true,'tuos':true,'meis':true,'hanc':true,'vestris':true,'cujus':true,'sumus':true,'mee':true,'dico':true,'nam':true,'sive':true,'tecum':true,'iste':true,'vestri':true,'hujus':true,'eas':true,'vestrum':true,'noster':true,'quidam':true,'tamquam':true,'suorum':true,'meos':true,'amen':true,'tuas':true,'mecum':true,'tuorum':true,'nostrum':true,'hac':true,'nostra':true,'vester':true,'nostris':true,'ipso':true,'earum':true,'hunc':true,'ipsum':true,'sint':true,'dices':true,'fuerint':true,'ideo':true,'ipsa':true,'nostro':true,'isti':true,'ipsius':true,'tam':true,'eris':true,'istum':true,'quidquam':true,'meas':true,'ero':true,'vestre':true,'quidquid':true,'vestro':true,'quicumque':true,'vivit':true,'ipsis':true,'vestros':true,'aliquid':true,'ipsorum':true,'tamen':true,'huic':true,'vestram':true,'nostre':true,'isto':true,'nostros':true,'nobiscum':true,'huc':true,'suarum':true,'illic':true,'vestrorum':true,'eadem':true,'nostras':true,'eodem':true,'nostram':true,'eritis':true,'suus':true,'hos':true,'istam':true,'quodcumque':true,'dicitur':true,'dicat':true,'dicent':true,'fui':true,'dixisti':true,'dicam':true,'dicis':true,'istis':true,'quocumque':true,'adhic':true,'aliqui':true,'aliquis':true,'an':true,'apud':true,'autem':true,'cur':true,'deinde':true,'ergo':true,'etsi':true,'fio':true,'haud':true,'iam':true,'idem':true,'igitur':true,'infra':true,'interim':true,'is':true,'ita':true,'magis':true,'modo':true,'ox':true,'necque':true,'nisi':true,'o':true,'possum':true,'quare':true,'quilibet':true,'quisnam':true,'quisquam':true,'quisque':true,'quisquis':true,'tum':true,'uel':true,'uero':true,'unus':true};
mongoose.connect('mongodb://localhost:27017/vulgate');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, ',/', 'index.html'));
});

var Reference = mongoose.model('Reference', 
	mongoose.Schema({
		_id: String,
		index: Array
	}),'index');


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

//Gets file from Controller
app.post('/upload/url', function(req, res){

	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		//console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

		fs.readFile(filename,'utf8',function(err, data){
			if (err) throw err;
			else {
				matchAndSend(data);
			}
		});
		file.on('data', function(data){});
	});
	busboy.on('finish', function() {
		res.end();
	});
	req.pipe(busboy);
});

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

//gets all pairs of words with matching indices
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