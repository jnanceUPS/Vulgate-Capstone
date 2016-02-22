var app = angular.module('myApp', ['ngFileUpload']);

app.controller('myCtrl', ['$scope', 'Upload', '$http', '$q', function($scope, Upload, $http, $q) {

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
		//console.log(data.vulgate);
		$scope.vulgate = data.vulgate;
	})
	.error(function(err){
		console.log(err);
	});



		function convertRefs(refs) {
			for (var i = 0; i < refs.length; i++){
				var r = refs[i].substring(0,refs[i].indexOf(":"));
				console.log(books[r]);
			}
		}

	//gets results back from server
	var getResults = function(){
		$http.get('/length').success(function(numSen){
			$scope.results = [];
			for(var i = 0; i < numSen.length; i++){
				//(function(i) {
					var url = '/searchResults/' + i;
					$http.get(url)
					.success(function(data) {
						var obj = {};
						obj.sentence = data.sentence + ".";
						obj.refs = data.refs;
						if (obj.sentence !== "undefined.")
							$scope.results.push(obj);
					})
					.error(function(data) {
						console.log(data);
					});
				}
			})
		.error(function(data) {
		});
	}

	//getResults2();
	function getResults2 (){
		$scope.results = [];
		var defer = $q.defer();
		var http = $http.post('/sss');
		http.success(function(data) {
			defer.resolve(data);
			console.log(data);
			$scope.results = data.results;
			$scope.loading = "";
			console.log(data.books);
			console.log(data.freqs);
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

	$scope.showPopover = function(pop) {
		var book = books.indexOf(pop.split(" [")[0]);
		console.log(book);
		$scope.popover = $scope.vulgate[book];
		$scope.popoverIsVisible = true; 
	};

	$scope.hidePopover = function () {
		$scope.popoverIsVisible = false;
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


