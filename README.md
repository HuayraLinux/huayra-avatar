# Caripela

Un programa sencillo para hacer avatares en huayra.

[![Build Status](https://travis-ci.org/HuayraLinux/huayra-caripela.svg?branch=master)](https://travis-ci.org/HuayraLinux/huayra-caripela)

- Para ver una demo del proyecto visitá la web: http://huayra-caripela.surge.sh
- Y para descargar binarios: https://github.com/HuayraLinux/huayra-caripela/releases
- Test en travis: https://travis-ci.org/HuayraLinux/huayra-caripela/builds


## Imágenes

![](images/preview.png)

## ¿Cómo ejecutarlo en modo desarrollo?

La aplicación utiliza ember y electron. Así que deberías tener instalado
ember de forma global con este comando:

```
npm install -g ember-cli
```

y luego, clonar y descargar todo el proyecto:

```
git clone https://github.com/HuayraLinux/huayra-caripela.git
cd huayra-caripela
npm install
```

y por último, para ejecutar la aplicación existen dos modos de ejecución:

```
# para acceder desde el navegador
ember s
```

o bien:

```
# para ejecutar sobre electron
make compilar
make electron
```

Por cierto, hay más comandos disponibles si ejecutamos el comando `make`
sin parámetros:

```
make
```

## Construir binarios para todas las plataformas

Para generar los binarios se puede ejecutar el comando:

```
make compilar
make binarios
```

Aunque realmente no es necesario, porque estos binarios se generan
automáticamente en el sitio de
[travis](https://travis-ci.org/HuayraLinux/huayra-caripela) cada vez que
lanzamos una versión nueva de la aplicación.

## Tecnologías utilizadas

* [ember](https://www.emberjs.com/)
* [electron](https://electron.atom.io/)
* [fabric](http://fabricjs.com/)
* html5 y javascript
