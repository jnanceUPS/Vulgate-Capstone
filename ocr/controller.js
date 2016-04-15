var app = angular.module("tess", ['ng-upload']);

app.controller('MainCtrl', function() {
    console.log("Hi there");
    // $scope.onFileSelect = function($files){
    //     console.log("on file select");
    // 	for (var i = 0; i < $files.length; i++){
    // 		var $file = $files[i];
    //         console.log($file);
    // 		Upload.upload ({
    // 			url: 'my/upload/url',
    // 			file: $file,
    // 			progress: function(e){}
    // 		}).then(function(data,status,headers,config){
    // 			console.log(data);
    // 		});
    // 	}
    // }   

    // $scope.upload = function(file){
    // Upload.upload({
    //   url: 'upload/url',
    //   data: {file: file}
    // }).then(function( resp))

});
