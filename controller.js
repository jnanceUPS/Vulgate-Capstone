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

	//$http.defaults.headers.post["Content-Type"] = "multipart/form-data";
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
			console.log(data);
			$scope.results = data.results;
			$scope.loading = "";
			$scope.showDiv = true;
			$scope.stats = [];
			for (var i = 0; i < data.books.length; i++){
				$scope.stats.push({'book': data.books[i], 'freq': data.freqs[i]});
			}
			$scope.stats.sort(function(a,b){
				return b.freq - a.freq;
			});

		})
		.error(function() {
			defer.reject("Failed to get data.");
		});

		return defer.promise;
	}

	// $scope.highlight = function(word1, word2, sentence){

	// 	if (!search) {
	// 		return $sce.trustAsHtml(text);
	// 	}
	// 	return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
	// };

	$scope.popupIndex = [-1,-1]; 

	//given a verse name e.g. "Numeri [7:9]", returns the corresponding verse from the Vulgate
	$scope.getVerse = function(vName,pindex,index){
		var spl = vName.split(" [");
		var book = books.indexOf(spl[0]);
		var num = spl[1].substring(0,spl[1].length-1);
		
		var i1 = $scope.vulgate[book].indexOf(num);
		var verse = $scope.vulgate[book].substring(i1,getNextIndexOf("\n",$scope.vulgate[book],i1));
		$scope.popup = verse;
		//$scope.vref.splice(index, 0, verse);
		if ($scope.popupIndex[0] == pindex && $scope.popupIndex[1] == index)
			$scope.popupIndex = [-1,-1];
		else $scope.popupIndex = [pindex, index];
	}

	$scope.showRefs = function(index){
		$scope.popupIndex = [-1,-1];
		$scope.verse = [];
		var sen = $scope.results[index];
		$scope.vref = {};
		$scope.hasRefs = sen.hasRefs;
		if(sen.hasRefs){
			$scope.vref = sen.refs;
		}

	};


	$scope.submit = function() {
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