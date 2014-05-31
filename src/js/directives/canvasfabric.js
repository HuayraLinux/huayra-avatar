var app = angular.module('app');

app.directive('canvasfabric', ['Canvas', function(Canvas) {

  function link(scope, element, attrs) {
    Canvas.actualizar();
  }

  return {
    restrict: "E",
    link: link,
    template: "<canvas id='canvas' width=400 height=400></canvas>"
  }
}]);
