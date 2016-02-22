var app = angular.module('myApp', ['ngFileUpload']);

app.controller('myCtrl', ['$scope', 'Upload', '$http', '$q', function($scope, Upload, $http, $q) {

	//$http.defaults.headers.post["Content-Type"] = "multipart/form-data";

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
				//})(i);	
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
			$scope.results = data;
			$scope.loading = "";
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


