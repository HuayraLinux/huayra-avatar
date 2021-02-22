var fs = require('fs');
var app = angular.module('app');

app.factory("MisArchivos", function() {
  var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
  var ruta_mis_archivos = homedir + '/.huayra-avatar/';
  var obj = {archivos: [], numero_maximo: 0};

  obj.obtener_numero = function() {
    return obj.numero_maximo + 1;
  }

  function borrar_archivo(ruta) {
    fs.exists(ruta, function(exists) {

      if (exists) {
        fs.unlink(ruta, function(error) {
          if (error)
            console.log(error);
        });
      }
    });
  }

  obj.eliminar = function(obj_a_eliminar) {
    obj.archivos = _(obj.archivos).reject(function(e) {
      return (e.ruta_json == obj_a_eliminar.ruta_json);
    });

    borrar_archivo(obj_a_eliminar.ruta_json);
    borrar_archivo(obj_a_eliminar.ruta_png);
  }

  obj.actualizar = function() {

    if (fs.existsSync(ruta_mis_archivos)) {
      var listado_archivos = fs.readdirSync(ruta_mis_archivos);
      obj.archivos = [];

      for (i=0; i < listado_archivos.length; ++i) {
          nombre_archivo = listado_archivos[i];

          if (/\.json$/.test(nombre_archivo)) {
            var numero =  parseInt(nombre_archivo, 10);

            obj.archivos.push({
              nombre: nombre_archivo.replace('.json', ''),
              numero: numero,
              ruta_json: ruta_mis_archivos + nombre_archivo,
              ruta_png: ruta_mis_archivos + nombre_archivo.replace('.json', '.png')
            });

            if (numero > obj.numero_maximo) {
              obj.numero_maximo = numero;
            }

          }
      }

      // Ordena los avatares de forma que las mas nuevas aparezcan primero.
      obj.archivos = _.sortBy(obj.archivos, function(e) {
        return -e.numero;
      });

    }
    else {
      fs.mkdirSync(ruta_mis_archivos);
    }
  }

  obj.actualizar();
  return obj;
})
