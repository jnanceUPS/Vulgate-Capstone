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

	var books = ["Genesis","Exodus","Leviticus","Numeri","Deuteronomium","Josue","Judicum","Ruth","Regum I",
	"Regum II","Regum III","Regum IV","Paralipomenon I","Paralipomenon II","Esdre","Nehemie","Tobie","Judith",
	"Esther","Job","Psalmi","Proverbia","Ecclesiastes","Canticum Canticorum","Sapientia","Ecclesiasticus","Isaias",
	"Jeremias","Lamentationes","Baruch","Ezechiel","Daniel","Osee","Joel","Amos","Abdias","Jonas","Michea","Nahum",
	"Habacuc","Sophonias","Aggeus","Zacharias","Malachias","Machabeorum I","Machabeorum II","Mattheus","Marcus",
	"Lucas","Joannes","Actus Apostolorum","ad Romanos","ad Corinthios I","ad Corinthios II","ad Galatas",
	"ad Ephesios","ad Philippenses","ad Colossenses","ad Thessalonicenses I","ad Thessalonicenses II",
	"ad Timotheum I","ad Timotheum II","ad Titum","ad Philemonem","ad Hebreos","Jacobi","Petri I","Petri II",
	"Joannis I","Joannis II","Joannis III","Jude","Apocalypsis"];
	//1-46 old, 47-73 new

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

	// $scope.highlightWord = function(refWord){
	// 	var sen = $scope.results[$scope.selectedSentence];
	// 	var index = sen.indexOf(ref)
	// }


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
		return sentence.replace(/[^\w\s]+/g, '').split(/\s+/g);
	}	

	$scope.filter = [];


	$scope.selectWord = function(word, index){
		// console.log("index: ", index);
		// console.log("sen: ", $scope.selectedSentence);
		// console.log($scope.selectedSentence == index);
		if ($scope.selectedSentence == index){
			if(!$scope.filter[$scope.selectedSentence]) 
				$scope.filter[$scope.selectedSentence] = [];
			var i = $scope.filter[$scope.selectedSentence].indexOf(word);
			if (i >= 0){
				$scope.filter[$scope.selectedSentence].splice(i,1);
			}	
			else {
				$scope.filter[$scope.selectedSentence].push(word);
			}
		}

		
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



	//given a verse name e.g. "Numeri [7:9]", returns the corresponding verse from the Vulgate
	var getVerse = function(vName){
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
	
	//shows the references, given a selected sentence
	$scope.showRefs = function(index){
		$scope.popupIndex = [];
		$scope.popupVerse = [];
		$scope.selectedSentence = index;
		$scope.verse = [];
		var sen = $scope.results[index];

		$scope.vref = {};
		$scope.hasRefs = sen.hasRefs;
		if(sen.hasRefs){

			finalRefs = filterRefs(sen.refs, index);

			// console.log("final: ",finalRefs);

			// sen.refs.sort(function(a,b){
			// 	return b.w3.length - a.w3.length;
			// });

			// $scope.vref = sen.refs;

			finalRefs.sort(function(a,b){
				return b.w3.length - a.w3.length;
			});

			$scope.vref = finalRefs;
		}
	};

	function filterRefs(refs, index) {
		// console.log("***************"); // just to break up the print stmts during testing for legibility
		// console.log(index);

		// for succinctness
		var results = $scope.results[index];
		var filter = $scope.filter;
		
		// console.log("filter: ",filter);

		var filtered = []; // to be returned at the end

		for (var ref in refs) {

			var inds = results.refs[ref].inds;
			// console.log("inds: ",inds);

			var one = results.refs[ref].w1;
			// console.log("one: ",one);

			var two = results.refs[ref].w2;
			// console.log("two: ",two);

			var three = results.refs[ref].w3;
			// console.log("three: ",three);

			if ((filter[index].indexOf(one) >= 0) && (filter[index].indexOf(two) >= 0)) {
				if ((filter[index].indexOf(three) >= 0) || three === "") {
					filtered.push({"w1" : one, "w2" : two, "w3" : three, "inds" : inds});
				}
			}

		}
		
		return filtered;

		// for(var i in refs){
			
		// 	// for(var j in $scope.marked.markedIndex[i]){
				
		// 		console.log("w1 ->",$scope.results[index].refs[i].w1);
		// 		console.log("w2 ->",$scope.results[index].refs[i].w2);
		// 		console.log("w3 ->",$scope.results[index].refs[i].w3);
		// 	// }
		// }
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
			str += "Sentence: \n"
			str += $scope.results[i].sentence + "\n \n";
			for(var j in $scope.marked.markedIndex[i]){
				str += "Matching words:\t"
				str += $scope.results[i].refs[j].w1 + "\t";
				str += $scope.results[i].refs[j].w2 + "\t";
				str += $scope.results[i].refs[j].w3 + "\n";

				for(var k in $scope.marked.markedIndex[i][j]){
					if ($scope.marked.markedIndex[i][j][k].marked){
						str += "\tVulgate index:\t"
						str += "\t"+$scope.results[i].refs[j].inds[k] + "\n";
						str += "\tVerse: \n" 
						str += "\t"+getVerse($scope.results[i].refs[j].inds[k]) + "\n";
						str += "\tNotes: " 
						str += "\t"+$scope.marked.markedIndex[i][j][k].note + "\n";
					}
				}
				str += "\n"
			}
			str += "-------------------------- \n \n"
		}

		$scope.fileObj = {'str':str}

		$http.post('/saveFile', $scope.fileObj).success(function(data){
		})
		.error(function(err){ 
			console.log(err);
		});
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