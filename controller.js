var app = angular.module('myApp', ['ngFileUpload']);

app.controller('myCtrl', ['$scope', 'Upload', '$http', '$q', '$anchorScroll', function($scope, Upload, $http, $q, $anchorScroll) {

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

			$scope.total =	data.freqs.reduce(function(a,b){
				return a + b;
			});

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

	var resetVars = function(){
		$scope.stats = [];
		$scope.marked = {};
		$scope.marked.hasMark = false;
		$scope.marked.oldRef = 0;
		$scope.marked.newRef = 0;
		$scope.marked.total = 0;
		$scope.marked.stats = [];
		$scope.marked.markedIndex = [];
		$scope.popupIndex = [-1,-1]; 
		$scope.selectedSentence = -1;
		$scope.showDiv = false;
	}

	$scope.onCheck = function(vName,pindex,index){
		if(!$scope.marked.markedIndex[$scope.selectedSentence]) 
			$scope.marked.markedIndex[$scope.selectedSentence] = [];
		if(!$scope.marked.markedIndex[$scope.selectedSentence][pindex]) 
			$scope.marked.markedIndex[$scope.selectedSentence][pindex] = [];

		var indind = $scope.marked.markedIndex[$scope.selectedSentence][pindex].indexOf(index);
		
		if (indind == -1){
			markAsRef(vName);
			$scope.marked.markedIndex[$scope.selectedSentence][pindex].push(index);
			$scope.marked.hasMark = true;
		} else {
			unmarkAsRef(vName);
			$scope.marked.markedIndex[$scope.selectedSentence][pindex].splice(indind,1);
			for(var i in $scope.marked.markedIndex){ //removes marked info if none are marked
				for (var j in $scope.marked.markedIndex[i]){
					if ($scope.marked.markedIndex[i][j].length > 0) break;
					if(i == $scope.marked.markedIndex.length-1 &&
						j == $scope.marked.markedIndex[i].length-1) $scope.marked.hasMark = false;
				}
		}
	}
}

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

var recalcFreqPct = function(arr, total){
	for(var i = 0; i < arr.length; i++){
		arr[i].freqPct = Math.round(arr[i].freq * 100 / total);
	}
}

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
	$scope.getVerse = function(vName,pindex,index){
		var spl = vName.split(" [");
		var book = books.indexOf(spl[0]);
		var num = spl[1].substring(0,spl[1].length-1);
		
		var i1 = $scope.vulgate[book].indexOf(num);
		var verse = $scope.vulgate[book].substring(i1,getNextIndexOf("\n",$scope.vulgate[book],i1));
		$scope.popup = verse;

		if ($scope.popupIndex[0] == pindex && $scope.popupIndex[1] == index)
			$scope.popupIndex = [-1,-1];
		else $scope.popupIndex = [pindex, index];
	}

	

	$scope.showRefs = function(index){
		$scope.selectedSentence = index;
		$scope.popupIndex = [-1,-1];
		$scope.verse = [];
		var sen = $scope.results[index];

		$scope.vref = {};
		$scope.hasRefs = sen.hasRefs;
		if(sen.hasRefs){
			sen.refs.sort(function(a,b){
				return b.w3.length - a.w3.length;
			});
			$scope.vref = sen.refs;
		}
	};

	$scope.submit = function() {
		resetVars();
		if ($scope.form.file.$valid && $scope.file) {
			$scope.upload($scope.file);
		}
	};

	$scope.upload = function(file){
		Upload.upload({
			url: 'upload/url',
			data: {file: file, 'username': $scope.username}
		}).then(function (resp) {
			getResults2();
			$scope.loading = "Loading...";
		}, function (resp) {
		}, function (evt) {
			$scope.fileName = evt.config.data.file.name;
		});
	};
}]);

function getNextIndexOf(char, string, startIndex){
	for(var i = startIndex; i < string.length; i++){
		if (string[i] == char) return i;
	}
}

function arrayIndexOf(arr1, arr2){
	for (var i = 0; i < arr2.length; i++){
		for (var j = 0; j < arr1.length; j++){
			if (arr1[j] != arr2[i][j]) break;
			if (j == arr1.length-1) return i;
		}
	}
	return -1;
}