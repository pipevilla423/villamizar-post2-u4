
# Post-contenido — Unidad 4: JavaScript

**Estudiante:** William Felipe Villamizar Soler  
**Programa:** Ingeniería de Sistemas  
**Semestre:** Séptimo  
**Universidad:** Universidad Francisco de Paula Santander  
**Asignatura:** Programación Web

## Descripción del proyecto

Este repositorio contiene el laboratorio de la
Unidad 4 de Programación Web.

El laboratorio está dividido en dos partes:

- Parte 1: Tablero de tareas interactivo con JavaScript.
- Parte 2: Formulario de registro de colaboradores.

## Decisiones de diseño

### Parte 1 — Generador de IDs

**Estrategia elegida: A — Closure / Patrón Módulo.**

Se eligió esta estrategia porque permite mantener
el contador de identificadores encapsulado dentro
de la función crearGeneradorId().

El contador no puede ser leído ni modificado
directamente desde otras funciones del programa,
lo que evita errores por modificaciones accidentales.

Cada llamada a generarId() devuelve un identificador
consecutivo y actualiza internamente el contador.

Esta implementación demuestra el uso de closures
para conservar estado privado en JavaScript.

### Parte 1 — Actualización del DOM

Pendiente de completar en los próximos pasos.

### Parte 2 — Validación de contraseña

Pendiente de completar.

### Parte 2 — Campo condicional

Pendiente de completar.

## Cómo ejecutar el proyecto

1. Abrir el repositorio en Visual Studio Code.
2. Instalar la extensión Live Server.
3. Abrir el archivo index.html de cada parte.
4. Seleccionar Open with Live Server.

## Capturas de pantalla

Pendiente de agregar al finalizar ambas partes.
