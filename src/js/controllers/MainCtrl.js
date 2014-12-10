var app = angular.module('app');

app.controller('MainCtrl', function($scope, Menu, Config) {
  $scope.data = {};

  if (Config.livereload) {
    var path = './';
    console.log("Activando livereload ...");

    fs.watch(path, function() {
      if (location)
        location.reload();
    });
  }

  $scope.actualizar = function() {
    location.reload(true);
  }

  $scope.abrir_modo_desarrollador = function() {
    require('nw.gui').Window.get().showDevTools();
  }

  Menu.agregar_a_ventana(require('nw.gui').Window.get());


});
