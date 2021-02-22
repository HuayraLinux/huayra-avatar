var app = angular.module('app');

window.abrir_modo_desarrollador = function() {
  require('electron').ipcRenderer.send('showDevTools');
};

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

  $scope.abrir_modo_desarrollador = function(){ abrir_modo_desarrollador() };
});
