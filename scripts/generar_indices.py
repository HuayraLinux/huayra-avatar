# coding: utf-8
import os
import json

MINIATURA = 'miniaturas'
ARCHIVO_INDICE = 'public/partes/indice.json'

resultado = {
    'galerias': [],
    'cantidadDeGalerias': 0,
}

def crear_directorio_si_no_existe(directorio):
    if not os.path.exists(directorio):
        os.mkdir(directorio)

def obtener_archivos_de_imagenes_en(directorio):
    return [a for a in os.listdir(directorio) if es_archivo_de_imagen(a)]

def es_directorio(base_dir, nombre):
    ruta_completa = os.path.join(base_dir, nombre)
    return os.path.isdir(ruta_completa)

def obtener_nombres_de_galerias(base_dir):
    return [x for x in os.listdir(base_dir)
                    if not x.startswith('.') and es_directorio(base_dir, x)]

def es_archivo_de_imagen(nombre_del_archivo):
    extensiones_de_imagenes = ['svg', 'png', 'jpg', 'jpeg']

    for extension in extensiones_de_imagenes:
        if nombre_del_archivo.lower().endswith(extension):
            return True

    return False

def obtener_galerias_completas(base_dir, galerias):
    resultado = {}

    for g in galerias:
        directorio = os.path.join(base_dir, g)
        resultado[g] = [{
                    'nombreDeArchivo': a,
                    'rutaCompleta': os.path.join(base_dir, g, a),
                    'miniatura': os.path.join(base_dir, g, MINIATURA, os.path.splitext(a)[0] + '.jpg'),
                    'nombre': os.path.splitext(a)[0],
                    } for a in obtener_archivos_de_imagenes_en(directorio)]

    return resultado

def crear_miniaturas(base_dir, galerias):
    for g in galerias:
        directorio_de_galeria = os.path.join(base_dir, g)
        directorio_de_miniaturas = os.path.join(directorio_de_galeria, MINIATURA)
        crear_directorio_si_no_existe(directorio_de_miniaturas)

        archivos_svg = obtener_archivos_de_imagenes_en(directorio_de_galeria)

        for archivo in archivos_svg:
            ruta_completa = os.path.join(base_dir, g, archivo)
            nombre_destino = os.path.splitext(archivo)[0] + '.jpg'
            ruta_completa_destino = os.path.join(directorio_de_miniaturas, nombre_destino)
            generar_minuatura(ruta_completa, ruta_completa_destino)

        print("- Creando %d miniaturas en %s" %(len(archivos_svg), directorio_de_miniaturas))


def generar_minuatura(fuente, destino):
    opciones = '-resize 100x100 -background white -gravity center -extent 100x100'
    os.system('convert %s "%s" "%s"' %(opciones, fuente, destino))
    #print("Creando el archivo: %s" %(destino))

if __name__ == "__main__":
    galerias = obtener_nombres_de_galerias('public/partes')

    print("")
    print("Se detectaron %d galerias de partes." %(len(galerias)))
    print("")

    crear_miniaturas('public/partes', galerias)

    resultado['galerias'] = galerias
    resultado['cantidadDeGalerias'] = len(galerias)
    resultado['data'] = obtener_galerias_completas('public/partes', galerias)

    contenido = json.dumps(resultado, indent=4)

    archivo = open(ARCHIVO_INDICE, 'wt')
    archivo.write(contenido)
    archivo.close()

    print("")
    print("Se generó el archivo %s" %(ARCHIVO_INDICE))
    print("")
