var app = angular.module('myApp', ['ngFileUpload']);

app.value('http_defaults', {
	timeout: 150
});

app.controller('myCtrl', ['$scope', 'Upload','$http', function($scope, Upload, $http) {

	//$http.defaults.headers.post["Content-Type"] = "multipart/form-data";
	var books = ["Genesis","Exodus","Leviticus","Numeri","Deuteronomium","Josue","Judicum","Ruth","Regum I",
	"Regum II","Regum III","Regum IV","Paralipomenon I","Paralipomenon II","Esdre","Nehemie","Tobie","Judith",
	"Esther","Job","Psalmi","Proverbia","Ecclesiastes","Canticum Canticorum","Sapientia","Ecclesiasticus","Isaias",
	"Jeremias","Lamentationes","Baruch","Ezechiel","Daniel","Osee","Joel","Amos","Abdias","Jonas","Michea","Nahum",
	"Habacuc","Sophonias","Aggeus","Zacharias","Malachias","Machabeorum I","Machabeorum II","Mattheus","Marcus",
	"Lucas","Joannes","Actus Apostolorum","ad Romanos","ad Corinthios I","ad Corinthios II","ad Galatas",
	"ad Ephesios","ad Philippenses","ad Colossenses","ad Thessalonicenses I","ad Thessalonicenses II",
	"ad Timotheum I","ad Timotheum II","ad Titum","ad Philemonem","ad Hebreos","Jacobi","Petri I","Petri II",
	"Joannis I","Joannis II","Joannis III","Jude","Apocalypsis"];
	function convertRefs(refs) {

	}

	//gets results back from server
	var getResults = function(){
		$http.get('/length').success(function(numSen){
			$scope.results = [];
			for(var i = 0; i < numSen.length; i++){
				(function(i) {
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
				})(i);	
			}
		})
		.error(function(data) {

		});
	}

	$scope.upload = function(file){
		Upload.upload({
			url: 'upload/url',
			data: {file: file, 'username': $scope.username}
		}).then(function (resp) {
			//console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			getResults();
		}, function (resp) {
			//console.log('Error status: ' + resp.status);
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			
			var file = evt.config.data.file;
			$scope.fileName = file.name;

			//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		});
	};
}]);


