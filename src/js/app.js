var fs = require('fs');
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) { $routeProvider.
          when('/selector', {
            controller: 'SelectorCtrl',
            templateUrl: 'partials/selectorPartial.html'
          }).
          when('/editor', {
            controller: 'EditorCtrl',
            templateUrl: 'partials/editorPartial.html'
          }).
          otherwise({redirectTo:'/selector'});
}]);

/* Quita el número de categoría del título */
app.filter('categoria', function() {
  return function(input) {
    return input.split('-').pop();
  }
});

window.ondragstart = function() {
  return false;
};

process.chdir(__dirname || 'src/');
