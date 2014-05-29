var app = angular.module('app');

app.controller('SelectorCtrl', function($scope, $location) {

  $scope.crear_avatar = function() {
    $location.url('/editor');
  }
  
});
