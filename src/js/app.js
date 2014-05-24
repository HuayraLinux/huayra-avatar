var fs = require('fs');
var app = angular.module('app', ['mm.foundation']);

$(document).ready(function() {
			$(document).foundation();
});

app.controller('MainCtrl', function($scope, Config) {
	$scope.data = {};

	if (Config.livereload) {
			var path = './';
			console.log("Activando livereload ...");

			fs.watch(path, function() {
				if (location)
					location.reload();
			});
	}

	$scope.actualizar = function() {
		location.reload(true);
	}

	$scope.abrir_modo_desarrollador = function() {
		require('nw.gui').Window.get().showDevTools();
	}

});

app.factory("Config", function() {
	var configuracion = require('./package.json');
	var Config = configuracion.config;

	return Config;
})

app.factory("Canvas", function() {
	var Canvas = {}

	Canvas.canvas = new fabric.Canvas('canvas');
	fabric.Object.prototype.transparentCorners = false;

	function informar_error(error) {
		if (error)
			alert(error);
	}

	Canvas.definir_imagen_de_fondo = function(ruta) {
		var c = Canvas.canvas;
		c.setBackgroundImage(ruta, c.renderAll.bind(c));
	}

	Canvas.guardar_como_archivo_svg = function(ruta) {
			var data = Canvas.canvas.toSVG();

			fs.writeFile(ruta, data, 'utf-8', informar_error);
	}

	Canvas.guardar_como_archivo_png = function(ruta) {
		var data = Canvas.canvas.toDataURL({format: 'png'});
		var base64Data = data.replace(/^data:image\/png;base64,/, "");

		fs.writeFile(ruta, base64Data, 'base64', informar_error);
	}

	Canvas.agregar_imagen = function(ruta, preferencias) {
		var canvas = Canvas.canvas;
		canvas.controlsAboveOverlay = true;
    var group = [];

		fabric.Image.fromURL(ruta, function(img) {

			var size = img.getOriginalSize();
      var ratio_horizontal = preferencias.ancho / size.width;
      var ratio_vertical = preferencias.alto / size.height;
			var ratio = Math.min(ratio_horizontal, ratio_vertical);

			img.scale(ratio);

			img.perPixelTargetFind = true;
			img.targetFindTolerance = 10;

			img.set({
        left: preferencias.x,
        top: preferencias.y
      });

			// Tinte de color !
			//var filter = new fabric.Image.filters.Tint({
  		//	color: '#3513B0',
				//color: 'rgba(53, 21, 176, 0.5)'
  		//	opacity: 0.5
			//});

			//img.filters.push(filter);
			//img.applyFilters(Canvas.canvas.renderAll.bind(Canvas.canvas));


  		Canvas.canvas.add(img);
			//Canvas.canvas.centerObject(img);

		});
	}

	return Canvas;
});

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

app.controller('GaleriaCtrl', function($scope, Canvas) {
	var path = 'partes/';

	$scope.data = {};
	$scope.data.directorios = [];


	$scope.selecciona_objeto = function(obj, dir) {
		var preferencias = {};

				preferencias.x = dir.preferencias.x || 0;
				preferencias.y = dir.preferencias.y || 0;
				preferencias.ancho = dir.preferencias.ancho || 50;
				preferencias.alto = dir.preferencias.alto || 50;

		Canvas.agregar_imagen(obj.src, preferencias);
	}

  /*
	 * Se invoca cuando se quiere leer un directorio de la galería (un tab
   * de la aplicación como 'cara', 'nariz' etc...)
	 */
	function actualizar_galeria(ruta_directorio, objeto_directorio) {
		var titulo = objeto_directorio.titulo;
		var indice = -1;

		// Cuando se actualiza una galeria, ya existe un listado de todos
		// los directorios de galerias, así que en esta parte de procede
		// a buscar el índice de la galería dentro de esa lista previsamente
		// realizada.
		for (var i=0; i<$scope.data.directorios.length; i++) {
			if ($scope.data.directorios[i].titulo === titulo) {
				indice = i;
			}
		}

    // Ahora se lee el directorio en busca de archivos svg, para actualizar
		// la galeria.
		//
		// Como caso particular, si se encuentra un archivo llamado configuración
		// "preferencias.json", se lee para que sea el que define las preferencias
		// iniciales para cada objeto de la colección.
		fs.readdir(ruta_directorio, function(error, data) {
			$scope.data.directorios[indice].objetos = [];

			for (var i=0; i<data.length; i++) {
				var ruta = data[i];

				if (/\.svg$/.test(ruta)) {
					var item = {src: ruta_directorio + '/' + ruta};
					$scope.data.directorios[indice].objetos.push(item);
				}

				console.log(ruta);

				if (/^preferencias.json$/.test(ruta)) {
					var preferencias = require("./" + ruta_directorio + "/" + ruta);
					$scope.data.directorios[indice].preferencias = preferencias;
				}

			}

			$scope.$apply();
		});

		//console.log(indice, ruta_directorio);
		//objeto_directorio.objetos.push({src: "partes/pelo/nariz_1.svg"});
	}

  /**
	 * Se invoca para leer todos los directorios de la galería y volver
	 * a generar los tabs de la aplicación.
	 *
	 * Este método se llama cada vez que se inicia la aplicación o se
	 * produce un cambio en los directorios de galería.
	 */
	function actualizar_listado_directorios() {

		fs.readdir(path, function(error, data) {
			$scope.data.directorios = [];

			// Por cada directorio en  "./partes" ...
			for (var i=0; i<data.length; i++) {
				var titulo = data[i];
				var objeto_directorio = {titulo: titulo, preferencias: {}, active: false, objetos: []}

				if (/^\./.test(titulo)) // ignora los directorios y archivos ocultos.
					continue;

				$scope.data.directorios.push(objeto_directorio);
				actualizar_galeria(path + titulo, objeto_directorio);
			}

			$scope.$apply();
		});
	}

	// Solicita cargar todos los directorios para generar la
	// galeria.
	actualizar_listado_directorios();

	// Observa cambios en el directorio de galeria, si hay algún
	// archivo o directorio nuevo vuelve a cargar todos los directorios
	// y generar la galeria.
	fs.watch(path, function() {
		actualizar_listado_directorios();
	});

});
