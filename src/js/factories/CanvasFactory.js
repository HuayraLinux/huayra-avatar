var app = angular.module('app');

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
