var app = angular.module('app');

app.controller('AvatarCtrl', function($scope, Canvas) {

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
    abrir_dialogo('#guardar_png', function(ruta) {
      Canvas.guardar_como_archivo_png(ruta);
    });
  }

  $scope.guardar_svg = function() {
    abrir_dialogo('#guardar_svg', function(ruta) {
      Canvas.guardar_como_archivo_svg(ruta);
    });
  }

  $scope.borrar_elemento_seleccionado = function() {
    var canvas = Canvas.canvas;
    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
    else if (activeObject) {
      canvas.remove(activeObject);
    }
  }

});
