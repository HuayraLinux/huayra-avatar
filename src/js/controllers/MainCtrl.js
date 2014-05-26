var app = angular.module('app');

app.controller('MainCtrl', function($scope, Config, Canvas) {
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

  $scope.salir = function() {
    alert("salir");
  }

  function abrir_dialogo(name, funcion) {
    var chooser = document.querySelector(name);

    function on_click(evt) {
      funcion.call(this, this.value);
      chooser.removeEventListener("change", on_click)
    }

    chooser.addEventListener("change", on_click, false);
    chooser.click();
  }

  $scope.guargar_png = function() {
    console.log("asdasd");
    abrir_dialogo('#guardar_png', function(ruta) {
      Canvas.guardar_como_archivo_png(ruta);
    });
  }

  $scope.guardar_svg = function() {
    abrir_dialogo('#guardar_svg', function(ruta) {
      Canvas.guardar_como_archivo_svg(ruta);
    });
  }

  $scope.todo = function(funcionalidad) {
    alert("TODO: sin implementar la funcionalidad: " + funcionalidad);
  }

});
