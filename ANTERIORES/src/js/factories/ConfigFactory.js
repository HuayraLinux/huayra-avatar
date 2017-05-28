var app = angular.module('app');

app.factory("Config", function() {
  var configuracion = require('./package.json');
  var Config = configuracion.config;

  return Config;
})
