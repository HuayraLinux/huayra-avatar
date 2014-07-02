var fs = require('fs');
var app = angular.module('app');

var sel_Rect = undefined;


/*
 * Previene el bug clásico que no nos permitía seleccionar objetos
 * que se solapaban.
 */
fabric.util.object.extend(fabric.Canvas.prototype, {
  _searchPossibleTargets: function(e) {

    var target,
    pointer = this.getPointer(e);

    var i = this._objects.length;

    while(i--) {
      if (this._checkTarget(e, this._objects[i], pointer)){
        this.relatedTarget = this._objects[i];
        target = this._objects[i];
        break;
      }
    }

    return target;
  }
});


app.factory("Canvas", function() {
  var Canvas = {}
  var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
  var ruta_mis_archivos = homedir + '/.caripela/'

  Canvas.actualizar = function() {
    Canvas.canvas = new fabric.Canvas('canvas');
    fabric.Object.prototype.transparentCorners = false;

    Canvas.canvas.on("object:selected", function(options) {
      Canvas.funcion_respuesta.call(this, true);
    });

    Canvas.canvas.on("selection:cleared", function(options) {
      Canvas.funcion_respuesta.call(this, false);
    });
  }

  Canvas.conectar_eventos = function(funcion_respuesta) {
    Canvas.funcion_respuesta = funcion_respuesta;
  }

  createListenersKeyboard();

  function createListenersKeyboard() {
    document.onkeydown = onKeyDownHandler;
  }

  function onKeyDownHandler(event) {
    var key;

    if (window.event)
      key = window.event.keyCode;
    else
      key = event.keyCode;

    switch (key) {
      case 46:
        event.preventDefault();
        Canvas.borrar_elemento_seleccionado();
        break;

      default:
        break;
    }

  }

  Canvas.espejar_elemento_seleccionado = function() {
    var canvas = Canvas.canvas;

    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {object.flipX = !object.flipX;});
    } else if (activeObject) {
      activeObject.flipX = !activeObject.flipX;
    }

    //Canvas.canvas.renderAll.bind(Canvas.canvas);
    Canvas.canvas.renderAll();
  }

  Canvas.borrar_elemento_seleccionado = function() {
    var canvas = Canvas.canvas;

    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {canvas.remove(object);});
    } else if (activeObject) {
      canvas.remove(activeObject);
    }
  }

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

  Canvas.guardar_como_archivo_png = function(ruta, success) {
    Canvas.deseleccionar_todo();
    var data = Canvas.canvas.toDataURL({format: 'png'});
    var base64Data = data.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(ruta, base64Data, 'base64', function(err) {
      if (err) {
        informar_error.call(this, err);
      } else {
        if (success)
          success.call(this);
      }
    });
  }

  Canvas.definir_fondo = function(ruta, preferencias) {
    var canvas = Canvas.canvas;
    canvas.setBackgroundImage(ruta, canvas.renderAll.bind(canvas));
  }

  Canvas.agregar_imagen = function(ruta, preferencias) {
    var canvas = Canvas.canvas;
    canvas.controlsAboveOverlay = true;
    var group = [];

    fabric.Image.fromURL(ruta, function(img) {

      // Extrae el nombre del directorio de donde salió la imagen, por
      // ejemplo si el path es 'partes/cara/1.svg', la variable categoría
      // va a quedar con el valor 'cara'.
      //
      // Esta categoría se guarda en el objeto, para evitar que el avatar
      // tenga mas de una cara, mas de dos bocas etc...
      //
      // Pero ojo, esto solo aplica si la categoría del objeto no admite
      // duplicados.
      var categoria = ruta.match(/partes\/(.+)\//)[1];


      // Intenta borrar todos los objetos de esta categoria si no
      // admite duplicados:
      if (! preferencias.admite_duplicados) {
        canvas.forEachObject(function(o, i) {

          // Borra el objeto de la categoría que va a tener el elemento
          // nuevo, pero además captura la coordenada y el tamaño para
          // que el nuevo objeto respete esas coordenadas.
          if (o.categoria == categoria) {
            preferencias.x = o.left;
            preferencias.y = o.top;
            canvas.remove(o);
          }
        });
      }

      if (preferencias.x < 0)
        preferencias.x = 0;

      if (preferencias.y < 0)
        preferencias.y = 0;

      if (preferencias.x > 400)
        preferencias.x = 100;

      if (preferencias.y > 400)
        preferencias.y = 100;

      var size = img.getOriginalSize();
      var ratio_horizontal = preferencias.ancho / size.width;
      var ratio_vertical = preferencias.alto / size.height;
      var ratio = Math.min(ratio_horizontal, ratio_vertical);


      img.set({
        left: preferencias.x,
        top: preferencias.y,
        categoria: categoria,
        z: preferencias.z,
        scaleX: ratio,
        scaleY: ratio,
      });

      Canvas.canvas.add(img);

      // Si el objeto es simétrico, como los ojos, se
      // encarga de clonar el objeto dos veces.
      if (preferencias.doble) {
        var object = fabric.util.object.clone(img);
        object.set({
          left: preferencias.x - preferencias.distancia_entre_dobles,
          top: preferencias.y,
          scaleX: -ratio,
          scaleY: ratio,
          categoria: categoria,
          z: preferencias.z
        });

        canvas.add(object);
      }


      // ordena todos los objetos por valor Z.
      canvas.forEachObject(function(o, i) {
        Canvas.canvas.moveTo(o, -o.z);
      });

    });
  }

  Canvas.guardar = function(nombre, success) {
    var data = Canvas.canvas.toJSON();

    for (var i=0; i< data.objects.length; i++) {
      var objeto_en_canvas = Canvas.canvas.getObjects()[i]
      data.objects[i].z = objeto_en_canvas.z || 0;
      data.objects[i].categoria = objeto_en_canvas.categoria || "";
    }

    var filename = ruta_mis_archivos + nombre + '.json';
    var ruta_png = ruta_mis_archivos + nombre + '.png';
    Canvas.deseleccionar_todo();

    Canvas.guardar_como_archivo_png(ruta_png, function() {
      fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if (err)
          alert(err);

        success.apply(this);
      });
    });
  }

  Canvas.deseleccionar_todo = function() {
    Canvas.canvas.deactivateAll().renderAll();
  }

  Canvas.cargar = function(ruta) {

    fs.readFile(ruta, 'utf8', function (err, data) {
      if (err) {
        alert(err);
        return;
      }

      var data = JSON.parse(data);
      var canvas = Canvas.canvas;
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });
  }

  return Canvas;
});
