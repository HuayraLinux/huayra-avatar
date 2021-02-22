var fs = require('fs');
var app = angular.module('app');


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
  fabric.Object.prototype.transparentCorners = false;

  var Canvas = {};
  var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
  var ruta_mis_archivos = homedir + '/.huayra-avatar/';

  /* La implementación del historial de accciones es una lista doblemente enlazada simple
   * la api expuesta consta de los siguientes elementos
   *   hacer():    agrega el estado actual como un nuevo paso
   *   deshacer(): transforma el estado actual en el anterior
   *   rehacer():  transforma el estado actual en el siguiente
   */
  var estado_actual = {
    siguiente: null,
    anterior: null,
    estado: {objects:[], background: "", backgroundImage:{}}
  };

  Canvas.hacer = function() {
    estado_actual = {
      siguiente: null,
      anterior: estado_actual,
      estado: Canvas.canvas.toJSON(['categoria'])
    };
    estado_actual.anterior.siguiente = estado_actual;

    if(Canvas.newHistory) setTimeout(Canvas.newHistory);
  }

  Canvas.actualizar = function() {
    Canvas.canvas = new fabric.Canvas('canvas');

    Canvas.canvas.on("object:modified", Canvas.hacer);

    Canvas.canvas.on("object:selected", function(options) {
      Canvas.funcion_respuesta.call(this, true);
    });

    Canvas.canvas.on("selection:cleared", function(options) {
      Canvas.funcion_respuesta.call(this, false);
    });

    Canvas.texto_superior = new fabric.Text('', {
      categoria: 'texto-superior',
      fill: 'white',
      fontFamily: 'Impact',
      stroke: 'black',
      strokeWidth: 2,
      fontSize:60,
      textAlign: 'center'
    });

    Canvas.texto_inferior = new fabric.Text('', {
      categoria: 'texto-inferior',
      fill: 'white',
      fontFamily: 'Impact',
      stroke: 'black',
      strokeWidth: 2,
      fontSize: 60,
      textAlign: 'center',
      originY: 'bottom'
    });

    estado_actual = {
      siguiente: null,
      anterior: null,
      estado: {objects:[], background: "", backgroundImage:{}}
    };
  }

  Canvas.set_texto_superior = function(superior) {
    const {texto_superior, canvas} = Canvas;
    if(!canvas.contains(texto_superior)) {
      canvas.add(texto_superior);
    }
    texto_superior.setText(superior)
                  .setAngle(0)
                  .setLeft(20)
                  .setTop(0)
                  .scaleToWidth(360);
    if(texto_superior.scaleX > 2) texto_superior.scale(2);
    texto_superior.centerH();

    Canvas.hacer();
    Canvas.funcion_respuesta.call(this, !!canvas.getActiveObject());
  }

  Canvas.set_texto_inferior = function(inferior) {
    const {texto_inferior, canvas} = Canvas;
    if(!canvas.contains(texto_inferior)) {
      canvas.add(texto_inferior);
    }
    texto_inferior.setText(inferior)
                         .setAngle(0)
                         .setLeft(20)
                         .setTop(400)
                         .scaleToWidth(360);
    if(texto_inferior.scaleX > 2) texto_inferior.scale(2);
    texto_inferior.centerH();

    Canvas.hacer();
    Canvas.funcion_respuesta.call(this, !!canvas.getActiveObject());
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

  Canvas.subir_elemento_seleccionado = function() {
    var canvas = Canvas.canvas;

    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {canvas.bringForward(object)});
    } else if (activeObject) {
      canvas.bringForward(activeObject);
    }

    Canvas.hacer();
    Canvas.canvas.renderAll();
  };

  Canvas.bajar_elemento_seleccionado = function() {
    var canvas = Canvas.canvas;

    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {canvas.sendBackwards(object)});
    } else if (activeObject) {
      canvas.sendBackwards(activeObject);
    }

    Canvas.hacer();
    Canvas.canvas.renderAll();
  };


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

    Canvas.hacer();
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

    Canvas.hacer();
  }

  function informar_error(error) {
    if (error)
      alert(error);
  }

  Canvas.definir_imagen_de_fondo = function(ruta) {
    var c = Canvas.canvas;
    c.setBackgroundImage(ruta, c.renderAll.bind(c));
    Canvas.hacer();
  }

  function ruta_a_data(ruta){
    /*
      Lee un archivo y obtiene el base64 incrustado
      para luego devolverlo y poder exportar un `avatar` con las
      imagenes incrustadas y no la referencia al archivo.
    */
    ruta = ruta.replace('file://','');
    var data = fs.readFileSync(ruta, 'utf8', function (err, img_data) {
      if (err) {
        alert(err);
        return;
      }
      var base64Data = img_data.match('xlink:href="(.[^"]*)"');
      if( base64Data ){
        base64Data = base64Data[1];
      }
      return base64Data;
    });

    return data;
  }


  Canvas.guardar_como_archivo_svg = function(ruta) {
      var data = Canvas.canvas.toSVG({},
                                     function(svg){
                                         var img = svg.match('xlink:href="(.[^"]*)"');
                                         if ( img ){
                                             var data = ruta_a_data( img[1] );
                                             var img_data = data.match('xlink:href="(.[^"]*)"');
                                             if( img_data ){
                                                 svg = svg.replace(/xlink:href="(.[^"]*)"/, 'xlink:href="'+img_data[1]+'"');
                                             }
                                             else{
                                                var domParser = new DOMParser(),
                                                  svgResource = domParser.parseFromString('<html><body>' + data + '</body></html>','text/html').getElementsByTagName('svg')[0];
                                                  originalSvgImage = domParser.parseFromString('<html><body><svg>' + svg + '</svg></body></html>','text/html').getElementsByTagName('image')[0];
                                                svg = svg
                                                  .replace(/xlink:href="(.[^"]*)"/, '')
                                                  .replace(/\s+x\s*=\s*\"\s*\-?\d+(\.\d+)?\s*\"\s+/, ' ')
                                                  .replace(/\s+y\s*=\s*\"\s*\-?\d+(\.\d+)?\s*\"\s+/, ' ')
                                                  .replace('<image', '<g transform="translate(' + (originalSvgImage.getAttribute('x') || 0) + ' ' + (originalSvgImage.getAttribute('y') || 0) + ')"><svg ')
                                                  .replace('</image>', svgResource.innerHTML + '</svg></g>');
                                             }
                                         }
                                         return svg;
                                     });

      fs.writeFile(ruta, data, 'utf-8', informar_error);
  };

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

  Canvas.agregar_imagen = function(ruta, preferencias, cb) {
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
      // var categoria = ruta.match(/partes\/(.+)\//)[1];
      var categoria = ruta.match(/partes\/(.+)\//); //[1];
      if( categoria ) { categoria = categoria[1] }



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
        ruta: ruta,
      });

      Canvas.canvas.add(img);
      Canvas.canvas.moveTo(img, -img.z);

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
        canvas.moveTo(object, -object.z);
      }

      Canvas.hacer();
      if(cb) cb(Canvas);
    });
  }

  Canvas.guardar_en_disco = function(nombre, data, success){
    var filename = ruta_mis_archivos + nombre + '.json';
    var ruta_png = ruta_mis_archivos + nombre + '.png';
    Canvas.deseleccionar_todo();

    Canvas.guardar_como_archivo_png(ruta_png, function() {
      fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if (err){ alert(err); }
        success.apply(this);
      });
    });
  }

  Canvas.guardar = function(nombre, success) {
    var data = Canvas.canvas.toJSON(['categoria']);
    if(estado_actual.anterior)
      Canvas.guardar_en_disco(nombre, data, success);
    else
      success.apply(this);
  }

  Canvas.deseleccionar_todo = function() {
    Canvas.canvas.deactivateAll().renderAll();
  }


  function cargar_textos_desde_canvas() {
    var textos = Canvas.canvas.getObjects('text');

    Canvas.texto_superior = textos.find(function(o) {
      return o.categoria === 'texto-superior';
    }) || Canvas.texto_superior;

    Canvas.texto_inferior = textos.find(function(o) {
      return o.categoria === 'texto-inferior';
    }) || Canvas.texto_inferior;

    if(Canvas.textLoad) Canvas.textLoad(Canvas);
  }

  Canvas.cargar = function(ruta) {
    fs.readFile(ruta, 'utf8', function (err, data) {
      if (err) {
        alert(err);
        return;
      }

      var data = JSON.parse(data);
      var canvas = Canvas.canvas;
      estado_actual = {
        siguiente: null,
        anterior: null,
        estado: data
      };
      canvas.loadFromJSON(data, function() {
        Canvas.funcion_respuesta(false);
        cargar_textos_desde_canvas();
        Canvas.canvas.renderAll();
      });
    });
  }

  Canvas.cargar_desde_estado = function(data, then) {
    var canvas = Canvas.canvas;
    canvas.clear();
    canvas.loadFromJSON(data, function() {
      cargar_textos_desde_canvas();
      Canvas.canvas.renderAll();
      if(then) then();
    });
  }

  Canvas.limpiar = function() {
    Canvas.canvas.clear();
  }

  Canvas.historial = function() {
    return estado_actual;
  }

  Canvas.deshacer = function(then) {
    if(!estado_actual.anterior) return;
    estado_actual = estado_actual.anterior;
    Canvas.cargar_desde_estado(estado_actual.estado, Canvas.newHistory);
  }

  Canvas.rehacer = function(then) {
    if(!estado_actual.siguiente) return;
    estado_actual = estado_actual.siguiente;
    Canvas.cargar_desde_estado(estado_actual.estado, Canvas.newHistory);
  }

  return Canvas;
});
