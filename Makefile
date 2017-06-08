NOMBRE="huayra-caripela"
NOMBREBIN="huayra-caripela"
DATE=`date +'%y.%m.%d %H:%M:%S'`

# Le indica a la compilación de binarios si puede borrar todos los .map
ELIMINAR_MAPS=1

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

define log
	@echo "${G}▷$(1) ${N}"
endef

define task
	@echo ""
	@echo "${Y}-$(1)${N}"
endef

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${Y}${NOMBRE}${N}"
	@echo ""
	@echo "  ${Y}Generales de la aplicación${N}"
	@echo ""
	@echo "    ${G}iniciar${N}              Instala dependencias."
	@echo "    ${G}generar_miniaturas${N}   Generar miniaturas."
	@echo "    ${G}compilar${N}             Compila la aplicación."
	@echo "    ${G}compilar_live${N}        Compila la aplicación en modo continuo."
	@echo "    ${G}electron${N}             Ejecuta la aplicación en electron (sin compilar)."
	@echo "    ${G}serve${N}                Ejecuta la aplicación en modo desarrollo."
	@echo "    ${G}test${N}                 Ejecuta los tests de la aplicación."
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version_patch${N}        Genera una versión PATCH."
	@echo "    ${G}version_minor${N}        Genera una versión MINOR."
	@echo "    ${G}version_major${N}        Genera una versión MAJOR."
	@echo "    ${G}binarios${N}             Genera los binarios de la aplicación."
	@echo ""
	@echo ""

iniciar:
	$(call task, "Iniciando el proyecto.")
	$(call log, "Instalando dependencias.")
	@npm install
	@bower install

compilar:
	$(call log, "Iniciando compilación.")
	make generar_miniaturas
	@ember build --environment develop

compilar_live:
	$(call log, "Iniciando compilación.")
	@ember build --environment develop --watch

s: serve

serve:
	$(call log, "Iniciando ember s")
	@ember s

version_patch:
	ember release

version_minor:
	@ember release --minor

version_major:
	@ember release --major

electron:
	@echo "${G}Iniciando electron ... (pero sin compilar desde cero).${N}"
	./node_modules/.bin/electron .

changelog:
	@git log `git describe --tags --abbrev=0` --pretty=format:"  * %s" > CHANGELOG.txt
	@echo "Generando el archivo CHANGELOG.txt"

test:
	$(call log, "Ejecutando test...")
	@ember test

generar_miniaturas:
	python scripts/generar_indices.py

binarios:
	$(call task, "Comenzando a generar binarios.")
	$(call log, "Limpiando descargas ...")
	@rm -rf binarios
	$(call log, "Compilando aplicación ember...")
	@ember build
	$(call log, "Generando binarios ...")
ifeq ($(ELIMINAR_MAPS), 1)
	$(call log, "Eliminando archivos .map porque la variable ELIMINAR_MAPS vale 1")
	@rm dist/assets/*.map
endif
	$(call log, "Compilando para osx - 64 bits...")
	@node_modules/.bin/electron-packager . ${NOMBREBIN} --platform=darwin --arch=x64  --electron-version=1.6.7 --ignore=tmp --ignore=node_modules --ignore=bower_components --out=binarios
	$(call log, "Compilando para windows - 32 bits...")
	@node_modules/.bin/electron-packager . ${NOMBREBIN} --platform=win32  --arch=ia32 --electron-version=1.6.7 --ignore=tmp --ignore=node_modules --ignore=bower_components --out=binarios
	$(call log, "Compilando para windows - 64 bits...")
	@node_modules/.bin/electron-packager . ${NOMBREBIN} --platform=win32  --arch=x64  --electron-version=1.6.7 --ignore=tmp --ignore=node_modules --ignore=bower_components --out=binarios
	$(call log, "Comprimiendo ...")
	@zip -qr binarios/${NOMBREBIN}-osx-64_bits.zip binarios/${NOMBREBIN}-darwin-x64
	@zip -qr binarios/${NOMBREBIN}-windows-32_bits.zip binarios/${NOMBREBIN}-win32-ia32
	@zip -qr binarios/${NOMBREBIN}-windows-64_bits.zip binarios/${NOMBREBIN}-win32-x64

.PHONY: tmp docs binarios
