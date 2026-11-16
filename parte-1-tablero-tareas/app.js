
/* ==========================================
   UNIDAD 4 - PROGRAMACIÓN WEB
   PARTE 1: TABLERO DE TAREAS

   Estudiante: William Felipe Villamizar Soler

   PASOS IMPLEMENTADOS:
   3. Estado y generador de IDs
   4. Prioridades y creación de tareas
   5. Agregar tareas
   6. Estadísticas con reduce() y for...of
   7. Avanzar estado y eliminar tareas
   ========================================== */


/* ==========================================
   PASO 3: ESTADO CENTRAL
   ========================================== */

let tareas = [];

let filtroEstado = "todas";
let filtroPrioridad = "todas";

const SECUENCIA_ESTADOS = [
  "pendiente",
  "en-progreso",
  "completada"
];

// Leer y limpiar los campos del formulario
const leerCampo = (selector) => {
  const campo = document.querySelector(selector);
  const valor = campo.value.trim();
  campo.value = "";
  return valor;
};

// Referencia al contenedor de tareas
const tablero = document.querySelector("#tablero");


/* ── Generador de IDs con closure ── */

/*
  DECISIÓN DE DISEÑO: ESTRATEGIA A

  Se eligió un closure porque mantiene
  el contador de IDs privado.

  Otras funciones no pueden modificarlo
  accidentalmente, lo que permite generar
  identificadores consecutivos.
*/

function crearGeneradorId() {
  let contador = 1;
  return () => contador++;
}

const generarId = crearGeneradorId();


/* ==========================================
   PASO 4: PRIORIDADES
   ========================================== */

/*
  JUSTIFICACIÓN DEL USO DE SWITCH

  Elegí switch porque las prioridades se
  comparan con tres valores específicos:
  alta, media y baja.

  Como no existen rangos ni condiciones
  adicionales, switch organiza los casos
  más claramente que varios if/else-if.
*/

function obtenerConfigPrioridad(prioridad) {
  switch (prioridad) {
    case "alta":
      return {
        clase: "prioridad-alta",
        etiqueta: "Alta"
      };

    case "media":
      return {
        clase: "prioridad-media",
        etiqueta: "Media"
      };

    case "baja":
      return {
        clase: "prioridad-baja",
        etiqueta: "Baja"
      };

    default:
      return {
        clase: "prioridad-media",
        etiqueta: "Media"
      };
  }
}


/* ── Crear tarjeta HTML ── */

function crearElementoTarea({
  id,
  titulo,
  descripcion,
  prioridad,
  estado
}) {

  const {
    clase: clasePrioridad,
    etiqueta: etiquetaPrioridad
  } = obtenerConfigPrioridad(prioridad);

  const tarea = document.createElement("article");

  tarea.classList.add(
    "tarea",
    `estado-${estado}`,
    clasePrioridad
  );

  tarea.dataset.id = id;

  const puedeAvanzar = estado !== "completada";

  tarea.innerHTML = `
    <span class="badge-prioridad">
      ${etiquetaPrioridad}
    </span>

    <span class="badge-estado">
      ${estado}
    </span>

    <h3></h3>
    <p></p>

    <div class="acciones-tarea">

      ${puedeAvanzar
        ? `<button
             class="btn-avanzar"
             data-id="${id}"
             data-action="avanzar">
             Avanzar estado
           </button>`
        : ""}

      <button
        class="btn-eliminar"
        data-id="${id}"
        data-action="eliminar">
        Eliminar
      </button>

    </div>
  `;

  // Insertar texto sin interpretarlo como HTML
  tarea.querySelector("h3").textContent = titulo;
  tarea.querySelector("p").textContent = descripcion;

  return tarea;
}


/* ==========================================
   PASO 6: ESTADÍSTICAS
   ========================================== */

function actualizarStats() {

  const conteos = tareas.reduce((acumulador, tarea) => {
    acumulador[tarea.estado] =
      (acumulador[tarea.estado] || 0) + 1;

    return acumulador;
  }, {});

  const partes = [];

  for (const estado of SECUENCIA_ESTADOS) {
    const cantidad = conteos[estado] || 0;
    partes.push(`${cantidad} ${estado}`);
  }

  document.querySelector("#stats").textContent =
    `Tareas: ${partes.join(" · ")} (total ${tareas.length})`;
}


/* ==========================================
   PASO 5: AGREGAR TAREAS
   ========================================== */

function agregarTarea() {

  const titulo = leerCampo("#input-titulo");
  const descripcion = leerCampo("#input-descripcion");

  const prioridad = document.querySelector(
    "#select-prioridad"
  ).value;

  if (!titulo || !descripcion) {
    alert("El título y la descripción son obligatorios.");
    return;
  }

  const nuevaTarea = {
    id: generarId(),
    titulo,
    descripcion,
    prioridad,
    estado: "pendiente"
  };

  tareas.push(nuevaTarea);

  const elemento = crearElementoTarea(nuevaTarea);
  tablero.appendChild(elemento);

  actualizarStats();
}


/* ==========================================
   PASO 7: ACTUALIZACIÓN DIRIGIDA DEL DOM
   ========================================== */

/*
  DECISIÓN DE DISEÑO: ESTRATEGIA A

  Se eligió la actualización dirigida porque
  permite modificar únicamente la tarjeta
  cuyo estado cambió.

  Esta estrategia evita reconstruir todas
  las tarjetas y conserva los elementos
  que no necesitan modificarse.
*/

function actualizarEstadoEnDOM(id, nuevoEstado) {

  // Buscar la tarjeta correspondiente al ID
  const elementoTarea = tablero.querySelector(
    `.tarea[data-id="${id}"]`
  );

  if (!elementoTarea) return;

  // Eliminar las clases de estados anteriores
  SECUENCIA_ESTADOS.forEach(estado => {
    elementoTarea.classList.remove(`estado-${estado}`);
  });

  // Agregar la clase del nuevo estado
  elementoTarea.classList.add(`estado-${nuevoEstado}`);

  // Actualizar el badge del estado
  const badgeEstado = elementoTarea.querySelector(
    ".badge-estado"
  );

  badgeEstado.textContent = nuevoEstado;

  // Si está completada, eliminar botón Avanzar
  if (nuevoEstado === "completada") {

    const btnAvanzar = elementoTarea.querySelector(
      ".btn-avanzar"
    );

    if (btnAvanzar) {
      btnAvanzar.remove();
    }
  }
}


/* ==========================================
   DELEGACIÓN DE EVENTOS
   ========================================== */

/*
  Se utiliza un solo listener en el tablero
  para gestionar las acciones de avanzar
  y eliminar.

  event.target.closest() permite identificar
  el botón presionado, incluso cuando las
  tarjetas se crean dinámicamente.
*/

tablero.addEventListener("click", (e) => {

  const boton = e.target.closest("button[data-action]");

  if (!boton || !tablero.contains(boton)) return;

  const id = Number(boton.dataset.id);

  // ── Eliminar tarea ──
  if (boton.dataset.action === "eliminar") {

    tareas = tareas.filter(t => t.id !== id);

    boton.closest(".tarea").remove();

    actualizarStats();

    return;
  }

  // ── Avanzar estado ──
  if (boton.dataset.action === "avanzar") {

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    const indiceActual = SECUENCIA_ESTADOS.indexOf(
      tarea.estado
    );

    // Evitar avanzar después de completada
    if (
      indiceActual === -1 ||
      indiceActual >= SECUENCIA_ESTADOS.length - 1
    ) {
      return;
    }

    tarea.estado = SECUENCIA_ESTADOS[indiceActual + 1];

    // Actualizar únicamente la tarjeta modificada
    actualizarEstadoEnDOM(id, tarea.estado);

    actualizarStats();
  }
});


/* ==========================================
   EVENTOS E INICIALIZACIÓN
   ========================================== */

// Evento del botón Agregar Tarea
document.querySelector("#btn-agregar")
  .addEventListener("click", agregarTarea);

// Mostrar estadísticas iniciales
actualizarStats();

/* ==========================================
   UNIDAD 4 - PARTE 1 - PASO 8
   FILTRADO COMBINADO POR ESTADO Y PRIORIDAD
   Estudiante: William Felipe Villamizar Soler
   ========================================== */

// ── Botones para filtrar por estado ──

const btnsFiltroEstado = document.querySelectorAll(
  ".btn-filtro-estado"
);

btnsFiltroEstado.forEach(btn => {

  btn.addEventListener("click", () => {

    // Quitar la clase activo de todos los botones
    btnsFiltroEstado.forEach(b => {
      b.classList.remove("activo");
    });

    // Marcar el botón seleccionado
    btn.classList.add("activo");

    // Guardar el estado seleccionado
    filtroEstado = btn.dataset.estado;

    // Aplicar ambos filtros
    aplicarFiltros();
  });

});


// ── Selector para filtrar por prioridad ──

document.querySelector("#select-filtro-prioridad")
  .addEventListener("change", (e) => {

    filtroPrioridad = e.target.value;

    aplicarFiltros();
  });


// ── Aplicar filtros combinados ──

function aplicarFiltros() {

  // Obtener todas las tarjetas del tablero
  const todasLasTareas = tablero.querySelectorAll(".tarea");

  todasLasTareas.forEach(elementoTarea => {

    // Obtener el ID de la tarjeta
    const id = Number(elementoTarea.dataset.id);

    // Buscar la tarea en el array
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    // Comprobar coincidencia del estado
    const coincideEstado =
      filtroEstado === "todas" ||
      tarea.estado === filtroEstado;

    // Comprobar coincidencia de la prioridad
    const coincidePrioridad =
      filtroPrioridad === "todas" ||
      tarea.prioridad === filtroPrioridad;

    // Ocultar si no cumple ambas condiciones
    elementoTarea.classList.toggle(
      "oculta",
      !(coincideEstado && coincidePrioridad)
    );

  });
}


// ── Activar visualmente el filtro inicial ──

document.querySelector(
  '.btn-filtro-estado[data-estado="todas"]'
).classList.add("activo");
