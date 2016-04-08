var app = angular.module("tess", ['ngFileUpload']);

app.controller('MainCtrl', ['$scope', 'Upload', '$http', function($scope, Upload, $http) {

    $scope.tagline = 'To the moon and back!';   

    $scope.upload = function(file){
    Upload.upload({
      url: 'upload/url',
      data: {file: file}
    }).then(function( resp))

}]);
