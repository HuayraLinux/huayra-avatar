var fs = require('fs');
var app = angular.module('app', ['mm.foundation']);

$(document).ready(function() {
			$(document).foundation();
});

app.controller('MainCtrl', function($scope) {
	$scope.data = {};

	$scope.actualizar = function() {
		location.reload(true);
	}

	$scope.abrir_modo_desarrollador = function() {
		require('nw.gui').Window.get().showDevTools();
	}

});


app.factory("Canvas", function() {
	var Canvas = {}

	Canvas.canvas = new fabric.Canvas('canvas');

	Canvas.definir_imagen_de_fondo = function(ruta) {
		var c = Canvas.canvas;
		c.setBackgroundImage(ruta, c.renderAll.bind(c));
	}

	Canvas.agregar_imagen = function(ruta) {
		fabric.Image.fromURL(ruta, function(img) {

			img.set({
        left: 100,
        top: 100
      });

			img.perPixelTargetFind = true;
			img.targetFindTolerance = 10;

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
			console.log(Canvas.canvas.toSVG());
			console.log(Canvas.canvas.toDataURL({format: 'png'}));

		});
	}

	return Canvas;
});

app.controller('AvatarCtrl', function($scope, Canvas) {

		function abrir_dialogo(name, funcion) {

    	var chooser = document.querySelector(name);

    	chooser.addEventListener("change", function(evt) {
				funcion.call(this, this.value);
    	}, false);

    	chooser.click();
		}

	$scope.guargar_png = function() {
  	abrir_dialogo('#guardar_png', function(nombre) {
			alert("Tengo que guardar el archivo " + nombre);
		});
	}

	$scope.guardar_svg = function() {
  	abrir_dialogo('#guardar_svg');
	}

	$scope.borrar_elemento_seleccionado = function() {
	}

});

app.controller('GaleriaCtrl', function($scope, Canvas) {
	var path = 'partes/';

	$scope.data = {};
	$scope.data.directorios = [];


	$scope.selecciona_objeto = function(obj) {
		Canvas.agregar_imagen(obj.src);
	}

	function actualizar_galeria(ruta_directorio, objeto_directorio) {
		var titulo = objeto_directorio.titulo;
		var indice = -1;

		for (var i=0; i<$scope.data.directorios.length; i++) {
			if ($scope.data.directorios[i].titulo === titulo) {
				indice = i;
			}
		}

		fs.readdir(ruta_directorio, function(error, data) {
			$scope.data.directorios[indice].objetos = [];

			for (var i=0; i<data.length; i++) {
				var ruta = data[i];

				if (/\.svg$/.test(ruta)) {
					var item = {src: ruta_directorio + '/' + ruta};
					$scope.data.directorios[indice].objetos.push(item);
				}

			}

			$scope.$apply();
		});

		//console.log(indice, ruta_directorio);
		//objeto_directorio.objetos.push({src: "partes/pelo/nariz_1.svg"});
	}

	function actualizar_listado_directorios() {

		fs.readdir(path, function(error, data) {
			$scope.data.directorios = [];

			for (var i=0; i<data.length; i++) {
				var titulo = data[i];
				var objeto_directorio = {titulo: titulo, active: false, objetos: []}

				if (/^\./.test(titulo))
					continue;

				$scope.data.directorios.push(objeto_directorio);
				actualizar_galeria(path + titulo, objeto_directorio);

				// Comienza a observar cambios en la caleria, si se agrega
				// un archivo .svg actualiza el listado.
				var ruta = path + titulo;

				//fs.watch(ruta, function() {
				//	alert(ruta);
				//});

				//function(event, filename) {

				//	console.log(ruta, filename);
					//if (/\.svg$/.test(filename)) {
					//	actualizar_galeria(ruta, objeto_directorio);
					//}

				//});

			}

			$scope.$apply();
		});
	}

	actualizar_listado_directorios();

	fs.watch(path, function() {
		actualizar_listado_directorios();
	});

});
