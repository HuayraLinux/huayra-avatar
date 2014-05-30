var app = angular.module('app');

app.controller('SelectorCtrl', function($scope, $location, MisArchivos) {

  $scope.crear_avatar = function() {
    $location.url('/editor');
  }
  $scope.data.mis_archivos = MisArchivos;

});
