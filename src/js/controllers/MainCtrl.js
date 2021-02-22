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

  if( require('electron').remote.Menu.getApplicationMenu() === null ){
    Menu.agregar_a_ventana(
        function(){
            swal({
                title: "Acerca de",
                text: "Un programa sencillo para hacer avatares.\n\n\n(c) 2014 - Hugo Ruscitti",
                imageUrl: "imagenes/huayra-avatar.png",
                confirmButtonText: "OK!"
            });
        }
    );
  }


});
