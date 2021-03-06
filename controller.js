var app = angular.module('myApp', ['ngFileUpload']);

//directive for pressing enter key
app.directive('ngEnterKey', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnterKey);
				});
				event.preventDefault();
			}
		});
	};
});

app.controller('myCtrl', ['$scope', 'Upload', '$http', '$q', function($scope, Upload, $http, $q) {

	//var stopwords = "ille,illa,illud,illi,illae,illius,illorum,illarum,illis,illum,illam,illos,illas,illo,ac,at,atque,aut,et,nec,non,sed,vel,antequam,cum,dum,si,usque,ut,qui,quae,quod,cuius,cui,quem,quam,quo,qua,quorum,quarum,quibus,quos,quas,ante,per,ad,propter,circum,super,contra,versus,inter,extra,intra,trans,post,sub,in,ob,praeter,a,ab,sine,de,pro,prae,e,ex,est,ejus,sunt,eum,que,me,quia,enim,te,eos,eorum,ego,ei,hec,omnes,eis,vos,dixit,tibi,vobis,eo,mihi,ait,erat,rex,quoniam,ne,eam,tua,erit,hoc,dicit,nos,mea,suum,suis,tu,dicens,tuum,sum,suam,quid,meum,ipse,suo,tui,quoque,sua,erant,se,neque,quis,deo,es,tuam,ea,mei,nobis,meam,nunc,meus,tuo,sic,cumque,sit,omni,tuus,sui,meo,esset,his,fuit,tue,fuerit,tuis,sue,hic,sibi,esse,ubi,ipsi,suos,suas,dicentes,etiam,erunt,nostri,malum,quidem,estis,vestra,hi,tuos,meis,hanc,vestris,cujus,sumus,mee,dico,nam,sive,tecum,iste,vestri,hujus,eas,vestrum,noster,quidam,tamquam,suorum,meos,amen,tuas,mecum,tuorum,nostrum,hac,nostra,vester,nostris,ipso,earum,hunc,ipsum,sint,dices,fuerint,ideo,ipsa,nostro,isti,ipsius,tam,eris,istum,quidquam,meas,ero,vestre,quidquid,vestro,quicumque,vivit,ipsis,vestros,aliquid,ipsorum,tamen,huic,vestram,nostre,isto,nostros,nobiscum,huc,suarum,illic,vestrorum,eadem,nostras,eodem,nostram,eritis,suus,hos,istam,quodcumque,dicitur,dicat,dicent,fui,dixisti,dicam,dicis,istis,quocumque,adhic,aliqui,aliquis,an,apud,autem,cur,deinde,ergo,etsi,fio,haud,iam,idem,igitur,infra,interim,is,ita,magis,modo,ox,necque,nisi,o,possum,quare,quilibet,quisnam,quisquam,quisque,quisquis,tum,uel,uero,unus"
	function onRefresh(){

	}

	//1-46 old, 47-73 new
	var books = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel",
		"2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Tobit","Judith",
		"Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Wisdom","Ecclesiasticus","Isaiah",
		"Jeremiah","Lamentations","Baruch","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum",
		"Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","1 Maccabees","2 Maccabees","Matthew","Mark",
		"Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians",
		"Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians",
		"1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
		"1 John","2 John","3 John","Jude","Revelation"];
	

	$http.post('/vulgate').success(function(data){
		$scope.vulgate = data.vulgate;
	})
	.error(function(err){ 
		console.log(err);
	});

	//gets the results from the server
	function getResults2 (){
		$scope.results = [];
		var defer = $q.defer();
		var http = $http.post('/sss');
		http.success(function(data) {
			defer.resolve(data);

			$scope.results = data.results;
			console.log($scope.results);
			$scope.loading = "";
			$scope.showDiv = true;
			$scope.stats = [];

			if (data.freqs.length>0){
				$scope.total =	data.freqs.reduce(function(a,b){
					return a + b;
				});
			}
			for (var i = 0; i < data.books.length; i++){
				$scope.stats.push({
					'book': data.books[i], 
					'freq': data.freqs[i], 
					'freqPct': Math.round(data.freqs[i]*100/$scope.total )});
			}

			$scope.stats.sort(function(a,b){
				return b.freq - a.freq;
			});

			$scope.oldRef = 0; 
			$scope.newRef = 0;
			for(var i = 0; i < $scope.stats.length; i++){
				if (books.indexOf($scope.stats[i].book) < 46) $scope.oldRef+=$scope.stats[i].freq;
				else $scope.newRef+=$scope.stats[i].freq;
			}
			$scope.oldPct = Math.round($scope.oldRef*100/$scope.total);
			$scope.newPct = Math.round($scope.newRef*100/$scope.total);

		}) 
		.error(function() {
			defer.reject("Failed to get data.");
		});

		return defer.promise;
	}

	// toggles the visibility of stopwords
	$scope.editStopwords = function(){
		$scope.showGod = false;	
		$scope.showStop = !$scope.showStop;
	}

	// toggles the visibility of godwords
	$scope.editGodwords = function(){
		$scope.showStop = false;
		$scope.showGod = !$scope.showGod;
	}

	//resets variables when reading another file
	var resetVars = function(){
		$scope.stats = [];

		$scope.marked = {};
		$scope.marked.hasMark = false;
		$scope.marked.oldRef = 0;
		$scope.marked.newRef = 0;
		$scope.marked.total = 0;
		$scope.marked.stats = [];
		$scope.marked.markedIndex = [];
		
		$scope.popupVerse = [];
		$scope.popupIndex = [];
		$scope.selectedSentence = -1;
		
		$scope.showDiv = false;

		$scope.stopwords = "a, ab, ac, ad, adhic, ait, aliqui, aliquid, aliquis, amen, an, ante, antequam, apud, at, atque, aut, autem, circum, contra, cui, cuius, cujus, cum, cumque, cur, de, deinde, deo, dicam, dicat, dicens, dicent, dicentes, dices, dicis, dicit, dicitur, dico, dixisti, dixit, dum, e, ea, eadem, eam, earum, eas, ego, ei, eis, ejus, enim, eo, eodem, eorum, eos, erant, erat, ergo, eris, erit, eritis, ero, erunt, es, esse, esset, est, estis, et, etiam, etsi, eum, ex, extra, fio, fuerint, fuerit, fui, fuit, hac, hanc, haud, hec, hi, hic, his, hoc, hos, huc, huic, hujus, hunc, iam, idem, ideo, igitur, illa, illae, illam, illarum, illas, ille, illi, illic, illis, illius, illo, illorum, illos, illud, illum, in, infra, inter, interim, intra, ipsa, ipse, ipsi, ipsis, ipsius, ipso, ipsorum, ipsum, is, istam, iste, isti, istis, isto, istum, ita, magis, malum, me, mea, meam, meas, mecum, mee, mei, meis, meo, meos, meum, meus, mihi, modo, nam, ne, nec, necque, neque, nisi, nobis, nobiscum, non, nos, noster, nostra, nostram, nostras, nostre, nostri, nostris, nostro, nostros, nostrum, nunc, o, ob, omnes, omni, ox, per, possum, post, prae, praeter, pro, propter, qua, quae, quam, quare, quarum, quas, que, quem, qui, quia, quibus, quicumque, quid, quidam, quidem, quidquam, quidquid, quilibet, quis, quisnam, quisquam, quisque, quisquis, quo, quocumque, quod, quodcumque, quoniam, quoque, quorum, quos, rex, se, sed, si, sibi, sic, sine, sint, sit, sive, sua, suam, suarum, suas, sub, sue, sui, suis, sum, sumus, sunt, suo, suorum, suos, super, suum, suus, tam, tamen, tamquam, te, tecum, tibi, trans, tu, tua, tuam, tuas, tue, tui, tuis, tum, tuo, tuorum, tuos, tuum, tuus, ubi, uel, uero, unus, usque, ut, vel, versus, vester, vestra, vestram, vestre, vestri, vestris, vestro, vestrorum, vestros, vestrum, vivit, vobis, vos"; 
		$scope.godwords = "deus,dei,deorum,deo,deis,deum,deos,dee,iesus,iesu,iesum,christus,christi,christo,christum,christe,dominus,domini,dominorum,domino,dominis,dominum,domine";
		
		$scope.showStop = false; 
		$scope.showGod = false;
	}

	//splits up a sentence into words
	$scope.parseSentence = function(sentence){
		return sentence.replace(/[^\w\s]+/g, '').split(/[\s]+/g);
	}	

	$scope.filter = []; // words added to the filter for selectively filtering references
	$scope.highlight = [];

	
	$scope.toFilter = []; // an array of booleans; a toFilter for each sentence to allow for retention of checked references
	
	// this method ensures that the list of references does not reset
	// unless someone decides to reset the filter preference
	$scope.setFilterPreferenceOn = function(index) {
		$scope.marked.markedIndex[index] = [];
		$scope.toFilter[index] = true;
	}

	// this method ensures that the list of references does not reset
	// unless someone decides to reset the filter preference
	$scope.setFilterPreferenceOff = function(index) {
		$scope.marked.markedIndex[index] = [];
		$scope.toFilter[index] = false;
	}

	$scope.selectWord = function(word, index){
		
		var defer = $q.defer();
		$http.post('/rootIt', {'word': word}).success(function(data){
			//console.log(data.root);
			defer.resolve(data);
			if ($scope.selectedSentence == index){
				if(!$scope.filter[$scope.selectedSentence]){ 
					$scope.filter[$scope.selectedSentence] = [];
					$scope.highlight[$scope.selectedSentence] = [];
				}
				var i = $scope.filter[$scope.selectedSentence].indexOf(data.root);
				if (i >= 0){
					$scope.filter[$scope.selectedSentence].splice(i,1);
					$scope.highlight[$scope.selectedSentence].splice(i,1);
				}	
				else {
					$scope.filter[$scope.selectedSentence].push(data.root);
					$scope.highlight[$scope.selectedSentence].push(word);
				}
			}
			$scope.showRefs($scope.selectedSentence);

		}).error(function(data){
			defer.reject(data);
		});
		return defer.promise;
	}

	// handles all functionality of marking references
	$scope.onCheck = function(vName,pindex,index){
		if(!$scope.marked.markedIndex[$scope.selectedSentence]) 
			$scope.marked.markedIndex[$scope.selectedSentence] = [];
		if(!$scope.marked.markedIndex[$scope.selectedSentence][pindex]) 
			$scope.marked.markedIndex[$scope.selectedSentence][pindex] = [];
		if(!$scope.marked.markedIndex[$scope.selectedSentence][pindex][index]) 
			$scope.marked.markedIndex[$scope.selectedSentence][pindex][index] = {'marked': false, 'note': ""};

		var indind = $scope.marked.markedIndex[$scope.selectedSentence][pindex][index].marked;

		console.log("indind: ",indind);
		
		if (!indind){
			markAsRef(vName);
			$scope.marked.markedIndex[$scope.selectedSentence][pindex][index].marked = true;
			$scope.marked.hasMark = true;
		} else {
			unmarkAsRef(vName);
			$scope.marked.markedIndex[$scope.selectedSentence][pindex][index].marked = false;
			$scope.marked.markedIndex[$scope.selectedSentence][pindex][index].note = "";

			if ($scope.marked.total == 0) //removes marked info if none are marked
				$scope.marked.hasMark = false;
		}
	}

	//handles marking a reference
	var markAsRef = function(vName){
		$scope.marked.total++;
		var spl = vName.split(" [");

		var found = false;
		for (var i = 0; i < $scope.marked.stats.length; i++){
			if ($scope.marked.stats[i].book === spl[0]){
				$scope.marked.stats[i].freq++;
				found = true;
				break;
			}
		}
		if (!found){
			$scope.marked.stats.push({
				'book': spl[0], 
				'freq': 1, 
				'freqPct': Math.round(100/$scope.marked.total )
			});
		}
		recalcFreqPct($scope.marked.stats,$scope.marked.total);

		$scope.marked.stats.sort(function(a,b){
			return b.freq - a.freq;
		});

		if (books.indexOf(spl[0]) < 46) $scope.marked.oldRef++;
		else $scope.marked.newRef++;
		$scope.marked.oldPct = Math.round($scope.marked.oldRef*100/$scope.marked.total);
		$scope.marked.newPct = Math.round($scope.marked.newRef*100/$scope.marked.total);
	};

	//handles unmarking a reference
	var unmarkAsRef = function(vName){
		$scope.marked.total--;
		var spl = vName.split(" [");

		for (var i = 0; i < $scope.marked.stats.length; i++){
			if ($scope.marked.stats[i].book === spl[0]){
				$scope.marked.stats[i].freq--;
				if($scope.marked.stats[i].freq == 0){
					$scope.marked.stats.splice(i, 1);
				}
				break;
			}
		}

		recalcFreqPct($scope.marked.stats,$scope.marked.total);

		$scope.marked.stats.sort(function(a,b){
			return b.freq - a.freq;
		});


		if (books.indexOf(spl[0]) < 46) $scope.marked.oldRef--;
		else $scope.marked.newRef--;
		$scope.marked.oldPct = Math.round($scope.marked.oldRef*100/$scope.marked.total);
		$scope.marked.newPct = Math.round($scope.marked.newRef*100/$scope.marked.total);
	}

	//calculates frequency percentage
	var recalcFreqPct = function(arr, total){
		for(var i = 0; i < arr.length; i++){
			arr[i].freqPct = Math.round(arr[i].freq * 100 / total);
		}
	}

	//given a verse name e.g. "Numeri [7:9]", returns the corresponding verse from the Vulgate
	var getVerse = function(vName){
		console.log('vname: ',vName);
		var spl = vName.split(" [");
		var book = books.indexOf(spl[0]);
		var num = spl[1].substring(0,spl[1].length-1);
		
		var i1 = $scope.vulgate[book].indexOf(num);
		return $scope.vulgate[book].substring(i1,getNextIndexOf("\n",$scope.vulgate[book],i1));


	}

	//shows a given verse when the reference is clicked
	$scope.showVerse = function(vName,pindex,index){
		var verse = getVerse(vName);

		if (!$scope.popupIndex[pindex]){
			$scope.popupIndex[pindex] = [index];
			$scope.popupVerse[pindex] = [verse];
		}
		else if ((x = $scope.popupIndex[pindex].indexOf(index)) >= 0){
			$scope.popupIndex[pindex].splice(x,1);
			$scope.popupVerse[pindex].splice(x,1);
		} else {
			$scope.popupIndex[pindex].push(index);
			$scope.popupVerse[pindex].push(verse);
		}
	}
	
	// this array will hold the references for each
	// sentence in the source document
	$scope.vref = [];
	//shows the references, given a selected sentence
	$scope.showRefs = function(index){

		// if ($scope.selectedSentence != index) {
		// 	$scope.toFilter = false;
		// }

		$scope.popupIndex = [];
		$scope.popupVerse = [];
		$scope.selectedSentence = index;
		$scope.verse = [];
		var sen = $scope.results[index];

		$scope.hasRefs = sen.hasRefs;

		if (!$scope.vref[index]) {
			$scope.vref[index] = {};
		}

		if(sen.hasRefs){	

			if ($scope.toFilter[index]) {

				var finalRefs = filterRefs(sen.refs, index);

				// place 3 word references first
				finalRefs.sort(function(a,b){
					return b.w3.length - a.w3.length;
				});

				$scope.vref[index] = finalRefs;
			}
			if (!$scope.toFilter[index]) {

				// place 3 word references first
				sen.refs.sort(function(a,b) {
					return b.w3.length - a.w3.length;
				});
				$scope.vref[index] = sen.refs;
			}
		}
	};


	// if the filter option is chosen
	// this method will reduce the list
	// of references shown based on words
	// that have been added to that word filter
	function filterRefs(refs, index) {
		// for succinctness
		var results = $scope.results[index];
		var filter = $scope.filter;

		var filtered = []; // to be returned at the end

		for (var ref in refs) {

			var inds = results.refs[ref].inds;

			var one = results.refs[ref].w1;
			var two = results.refs[ref].w2;
			var three = results.refs[ref].w3;
			
			// admittedly this code only works as long as the program is focused on
			// producing two and three word references
			// if it is ever changed, then this code will also need to be changed
			if (filter[index]){
				if ((filter[index].indexOf(one) >= 0) && (filter[index].indexOf(two) >= 0)) {
					if ((filter[index].indexOf(three) >= 0) || three === "") {
						filtered.push({"w1" : one, "w2" : two, "w3" : three, "inds" : inds});
					}
				}
			}
		}
		
		return filtered;
	}

	$scope.submit = function() { 
		resetVars();
		var defer = $q.defer();
		var words = [$scope.stopwords.replace(/\s/g,"").split(","),$scope.godwords.replace(/\s/g,"").split(",")];
		$http.post('/stopwords',words).success(function(data){
			defer.resolve(data);
		}).error(function(data){
			defer.reject(data);
		});

		if ($scope.form.file.$valid && $scope.file) {
			$scope.upload($scope.file);
		}
	};

	$scope.upload = function(file){
		Upload.upload({
			url: 'upload/url',
			data: {file: file}
		}).then(function (resp) {
			getResults2();
			$scope.loading = "Loading...";
		}, function (resp) {
		}, function (evt) {
			$scope.fileName = evt.config.data.file.name;
		});
	};

	//saves marked data to a text file
	$scope.saveFile = function(){

		var str = "";	

		for(var i in $scope.marked.markedIndex){
			str += "Sentence: \n";

			str += $scope.results[i].sentence + "\n \n";

			for(var j in $scope.marked.markedIndex[i]){
				str += "Matching words:\t";
				str += $scope.vref[i][j].w1 + "\t";
				str += $scope.vref[i][j].w2 + "\t";
				str += $scope.vref[i][j].w3 + "\n";

				for(var k in $scope.marked.markedIndex[i][j]){
					if ($scope.marked.markedIndex[i][j][k].marked){
						str += "\tVulgate index:\t"
						str += "\t"+$scope.vref[i][j].inds[k] + "\n";
						str += "\tVerse: \n" 
						str += "\t"+getVerse($scope.vref[i][j].inds[k]) + "\n";
						str += "\tNotes: " 
						str += "\t"+$scope.marked.markedIndex[i][j][k].note + "\n";
					}
				}
				str += "\n";
			}
			str += "-------------------------- \n \n";
		}

		var s = [str];
		var blob = new Blob(s, {type: "text/plain;charset=utf-8"});

		// this block of code constructs a filename using the date on which the file was saved
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		date = month + "_" + day + "_" + year;
		var filename = "saved_refs_" + date + ".txt";

		// save the references to a file with the above filename
		saveAs(blob, filename);
	};
}]);

//given a starting index, gets the next index of an item in an array
//returns -1 if none found
function getNextIndexOf(item, arr, startIndex){
	for(var i = startIndex; i < arr.length; i++){
		if (arr[i] == item) return i;
	}
	return -1;
}

//gets the index of an object in an array of objects. Also works for arrays in array of arrays.
var objIndexOf = function(arr, obj){
	for (var i = 0; i < arr.length ; i++){
		if (objEquals(arr[i],obj)) return i;
	}
	return -1;
}
// if all the attributes of an object are equal, return true, else return false
var objEquals = function(obj1, obj2){
	for(var i in obj1){
		if (obj1[i] != obj2[i]) return false;
	}
	return true;
}