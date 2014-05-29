var app = angular.module('app');

app.controller('SelectorCtrl', function($scope) {
  $scope.data = {nombre: 'selector'};

  $scope.saludar = function() {
    alert("hola, soy el selector");
  }

  
});
