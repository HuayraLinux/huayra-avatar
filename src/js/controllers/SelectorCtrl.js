var app = angular.module('app');

app.controller('SelectorCtrl', function($scope, $location, MisArchivos) {

  $scope.crear_avatar = function() {
    $location.url('/editor');
  }

  $scope.abrir_avatar = function(obj) {
    var ruta = obj.ruta_json;
    $location.path('/editor').search({ruta: ruta});
  }

  $scope.data.mis_archivos = MisArchivos.archivos;

});
