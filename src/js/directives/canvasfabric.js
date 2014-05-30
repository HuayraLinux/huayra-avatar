var app = angular.module('app');

app.directive('canvasfabric', ['Canvas', function(Canvas) {

  function link(scope, element, attrs) {
    Canvas.canvas = new fabric.Canvas('canvas');
  }

  return {
    restrict: "E",
    link: link,
    template: "<canvas id='canvas' width=400 height=400></canvas>"
  }
}]);
