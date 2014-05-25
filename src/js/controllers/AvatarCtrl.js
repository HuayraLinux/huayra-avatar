var app = angular.module('app');

app.controller('AvatarCtrl', function($scope, Canvas) {



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
