var app = angular.module('app');

app.controller('SelectorCtrl', function($scope, $location, Menu, MisArchivos, Canvas) {

  $scope.crear_avatar = function(){
    $location.url('/editor');
    if( Canvas.canvas ){
      Canvas.limpiar();
    }
  };

  $scope.abrir_avatar = function(obj) {
    var ruta = obj.ruta_json;
    $location.path('/editor').search({ruta: ruta});
  };

  $scope.borrar_avatar = function(obj) {
      MisArchivos.eliminar(obj);
      $scope.data.mis_archivos = MisArchivos.archivos;
  };

  $scope.data.mis_archivos = MisArchivos.archivos;

  Menu.item_crear_nuevo(
    function(){
      $scope.crear_avatar();
      $scope.$apply();
    }
  );

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
});
