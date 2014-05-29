var app = angular.module('app');

app.controller('SelectorCtrl', function($scope, $location) {
  $scope.data = {nombre: 'selector'};

  $scope.saludar = function() {
    alert("hola, soy el selector");
  }

  $scope.crear_avatar = function() {
    $location.url('/editor');
  }

});
