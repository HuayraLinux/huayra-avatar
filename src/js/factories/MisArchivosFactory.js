var fs = require('fs');
var app = angular.module('app');

app.factory("MisArchivos", function() {
  var ruta_mis_archivos = process.env.HOME + '/.caripela/';
  var MisArchivos = [];

  if (fs.existsSync(ruta_mis_archivos)) {
    MisArchivos = fs.readdirSync(ruta_mis_archivos);

    for (i=0; i < MisArchivos.length; ++i) {
        MisArchivos[i] = ruta_mis_archivos + MisArchivos[i]
    }

  }
  else {
    fs.mkdirSync(ruta_mis_archivos);
  }

  console.log(MisArchivos)

  return MisArchivos;
})
