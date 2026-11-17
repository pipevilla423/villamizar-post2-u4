
"use strict";

/* ==========================================
   UNIDAD 4 - PARTE 2
   REGISTRO DE COLABORADOR
   Estudiante: William Felipe Villamizar Soler

   Paso 3: Retroalimentación visual
   Paso 4: Nombre, correo, usuario y contraseña
   Paso 5: Confirmación y equipo condicional
   Paso 6: Rol y horas disponibles
   ========================================== */


/* ==========================================
   PASO 3: RETROALIMENTACIÓN VISUAL
   ========================================== */

function mostrarError(campoId, mensaje) {
  const campo = document.querySelector(`#${campoId}`);
  const span = document.querySelector(`#error-${campoId}`);

  campo.classList.add("invalido");
  campo.classList.remove("valido");

  span.textContent = mensaje;
  span.classList.add("visible");
}

function limpiarError(campoId) {
  const campo = document.querySelector(`#${campoId}`);
  const span = document.querySelector(`#error-${campoId}`);

  campo.classList.remove("invalido");
  campo.classList.add("valido");

  span.textContent = "";
  span.classList.remove("visible");
}

function limpiarTodo() {
  const campos = [
    "nombre",
    "email",
    "username",
    "password",
    "confirmar",
    "rol",
    "equipo",
    "horas",
    "terminos"
  ];

  campos.forEach(id => limpiarError(id));
}


/* ==========================================
   PASO 4: VALIDACIÓN DE NOMBRE
   ========================================== */

function validarNombre() {
  const campo = document.querySelector("#nombre");

  if (campo.validity.valueMissing) {
    mostrarError("nombre", "El nombre es obligatorio.");
    return false;
  }

  if (campo.validity.tooShort) {
    mostrarError(
      "nombre",
      `El nombre debe tener al menos ${campo.minLength} caracteres.`
    );
    return false;
  }

  limpiarError("nombre");
  return true;
}


/* ==========================================
   PASO 4: VALIDACIÓN DE CORREO
   ========================================== */

function validarEmail() {
  const campo = document.querySelector("#email");

  if (campo.validity.valueMissing) {
    mostrarError("email", "El correo es obligatorio.");
    return false;
  }

  if (campo.validity.typeMismatch) {
    mostrarError(
      "email",
      "El formato del correo no es válido."
    );
    return false;
  }

  limpiarError("email");
  return true;
}


/* ==========================================
   PASO 4: VALIDACIÓN DE USUARIO
   ========================================== */

/*
  Reutilizamos el atributo pattern definido
  en HTML mediante validity.patternMismatch.

  Así evitamos duplicar la misma regla de formato
  en JavaScript y mantenemos una sola fuente
  de verdad para la validación del usuario.
*/

function validarUsername() {
  const campo = document.querySelector("#username");

  if (campo.validity.valueMissing) {
    mostrarError(
      "username",
      "El nombre de usuario es obligatorio."
    );
    return false;
  }

  if (campo.validity.patternMismatch) {
    mostrarError(
      "username",
      "Use 4 a 20 caracteres: letras, números o guion bajo, sin espacios."
    );
    return false;
  }

  limpiarError("username");
  return true;
}


/* ==========================================
   PASO 4: VALIDACIÓN DE CONTRASEÑA
   ESTRATEGIA B: VALIDACIONES INDEPENDIENTES
   ========================================== */

function validarPassword() {
  const campo = document.querySelector("#password");
  const valor = campo.value;

  if (campo.validity.valueMissing) {
    mostrarError(
      "password",
      "La contraseña es obligatoria."
    );
    return false;
  }

  if (campo.validity.tooShort || valor.length < 8) {
    mostrarError(
      "password",
      "La contraseña debe tener al menos 8 caracteres."
    );
    return false;
  }

  if (!/[A-Z]/.test(valor)) {
    mostrarError(
      "password",
      "Falta al menos una letra mayúscula."
    );
    return false;
  }

  if (!/[0-9]/.test(valor)) {
    mostrarError(
      "password",
      "Falta al menos un número."
    );
    return false;
  }

  if (!/[^A-Za-z0-9]/.test(valor)) {
    mostrarError(
      "password",
      "Falta al menos un carácter especial (por ejemplo: # ! % &)."
    );
    return false;
  }

  limpiarError("password");
  return true;
}


/* ==========================================
   PASO 5: CONFIRMACIÓN DE CONTRASEÑA
   ========================================== */

function validarConfirmar() {
  const password = document.querySelector("#password").value;
  const confirmar = document.querySelector("#confirmar").value;

  if (!confirmar) {
    mostrarError(
      "confirmar",
      "La confirmación es obligatoria."
    );
    return false;
  }

  if (password !== confirmar) {
    mostrarError(
      "confirmar",
      "Las contraseñas no coinciden."
    );
    return false;
  }

  limpiarError("confirmar");
  return true;
}


/* ==========================================
   PASO 5: CAMPO CONDICIONAL EQUIPO
   ESTRATEGIA A: REQUIRED NATIVO
   ========================================== */

const selectRol = document.querySelector("#rol");
const grupoEquipo = document.querySelector("#grupo-equipo");
const campoEquipo = document.querySelector("#equipo");

selectRol.addEventListener("change", () => {
  const esLider = selectRol.value === "lider";

  // Mostrar el campo solo cuando el rol es Líder.
  grupoEquipo.classList.toggle("oculto", !esLider);

  // Estrategia A: cambiar required dinámicamente.
  campoEquipo.required = esLider;

  // Eliminar errores cuando el campo ya no aplica.
  if (!esLider) {
    limpiarError("equipo");
  }
});

function validarEquipo() {
  const campo = document.querySelector("#equipo");

  if (!campo.required) {
    return true;
  }

  if (campo.validity.valueMissing || !campo.value.trim()) {
    mostrarError(
      "equipo",
      "Indique el equipo a cargo para el rol de Líder."
    );
    return false;
  }

  limpiarError("equipo");
  return true;
}


/* ==========================================
   PASO 6: VALIDACIÓN DE ROL
   ========================================== */

function validarRol() {
  const campo = document.querySelector("#rol");

  if (campo.validity.valueMissing) {
    mostrarError("rol", "Seleccione un rol.");
    return false;
  }

  limpiarError("rol");
  return true;
}


/* ==========================================
   PASO 6: VALIDACIÓN DE HORAS DISPONIBLES
   ========================================== */

function validarHoras() {
  const campo = document.querySelector("#horas");

  if (campo.validity.valueMissing) {
    mostrarError(
      "horas",
      "Indique las horas disponibles por semana."
    );
    return false;
  }

  if (campo.validity.rangeUnderflow) {
    mostrarError(
      "horas",
      `Debe disponer al menos de ${campo.min} horas semanales.`
    );
    return false;
  }

  if (campo.validity.rangeOverflow) {
    mostrarError(
      "horas",
      `No puede superar las ${campo.max} horas semanales.`
    );
    return false;
  }

  // Evitar aceptar valores que no sean números válidos.
  if (campo.validity.badInput) {
    mostrarError("horas", "Ingrese un número válido.");
    return false;
  }

  limpiarError("horas");
  return true;
}


/* ==========================================
   EVENTOS DE VALIDACIÓN
   ========================================== */

// Paso 4: validar al salir del campo.
document.querySelector("#nombre")
  .addEventListener("blur", validarNombre);

document.querySelector("#email")
  .addEventListener("blur", validarEmail);

document.querySelector("#username")
  .addEventListener("blur", validarUsername);

document.querySelector("#password")
  .addEventListener("blur", validarPassword);

// Paso 5: confirmación y equipo.
document.querySelector("#confirmar")
  .addEventListener("blur", validarConfirmar);

campoEquipo.addEventListener("blur", validarEquipo);

// Paso 6: validar rol cuando cambia la selección.
selectRol.addEventListener("change", validarRol);

// Paso 6: validar horas al salir del campo.
document.querySelector("#horas")
  .addEventListener("blur", validarHoras);

/* ==========================================
   PASO 7: VALIDACIÓN DE TÉRMINOS
   ========================================== */

function validarTerminos() {
  const campo = document.querySelector("#terminos");

  // El checkbox se valida con checked, no con value.
  if (!campo.checked) {
    mostrarError(
      "terminos",
      "Debe aceptar los términos para continuar."
    );
    return false;
  }

  limpiarError("terminos");
  return true;
}

// Validar inmediatamente cuando cambia la casilla.
document.querySelector("#terminos")
  .addEventListener("change", validarTerminos);

/* ==========================================
   PASO 8: VALIDACIÓN EN TIEMPO REAL
   ========================================== */

// Limpiar el error al comenzar a escribir
// nuevamente la confirmación de contraseña.
document.querySelector("#confirmar")
  .addEventListener("input", () => {
    const campo = document.querySelector("#confirmar");

    if (campo.value) {
      limpiarError("confirmar");
    }
  });

/* ==========================================
   PASO 9: CONTROL DEL EVENTO SUBMIT
   ========================================== */

const form = document.querySelector("#form-registro");

form.addEventListener("submit", (e) => {

  // Evitar que el navegador envíe el formulario
  // y recargue la página automáticamente.
  e.preventDefault();

  // Ejecutar todas las validaciones del formulario.
  const resultados = [
    validarNombre(),
    validarEmail(),
    validarUsername(),
    validarPassword(),
    validarConfirmar(),
    validarRol(),
    validarEquipo(),
    validarHoras(),
    validarTerminos()
  ];

  // Comprobar que todas las funciones devuelvan true.
  const todoValido = resultados.every(r => r === true);

  if (todoValido) {

    // Mostrar el mensaje de registro exitoso.
    const mensajeExito = document.querySelector("#mensaje-exito");

    mensajeExito.classList.remove("oculto");
    mensajeExito.classList.add("visible");

    // Restablecer el formulario después de 2 segundos.
    setTimeout(() => {

      form.reset();

      limpiarTodo();

      // Ocultar nuevamente el campo condicional.
      grupoEquipo.classList.add("oculto");

      // Desactivar required del campo Equipo,
      // porque después del reset ya no hay rol seleccionado.
      campoEquipo.required = false;

      // Ocultar el mensaje de éxito.
      mensajeExito.classList.remove("visible");
      mensajeExito.classList.add("oculto");

    }, 2000);

  } else {

    // Buscar el primer campo con error.
    const primerInvalido = form.querySelector(".invalido");

    // Llevar el foco al campo para corregirlo.
    if (primerInvalido) {
      primerInvalido.focus();
    }

  }

/* ==========================================
   PASO 10: FORTALEZA DE CONTRASEÑA
   ========================================== */

// Evaluar los requisitos de la contraseña.
function evaluarFortaleza(valor) {
  let puntos = 0;

  if (valor.length >= 8) {
    puntos++;
  }

  if (/[A-Z]/.test(valor)) {
    puntos++;
  }

  if (/[0-9]/.test(valor)) {
    puntos++;
  }

  if (/[^A-Za-z0-9]/.test(valor)) {
    puntos++;
  }

  const niveles = [
    "",
    "Débil",
    "Regular",
    "Buena",
    "Fuerte"
  ];

  const colores = [
    "",
    "#C62828",
    "#F57F17",
    "#1565C0",
    "#2E7D32"
  ];

  return {
    nivel: niveles[puntos],
    color: colores[puntos],
    puntos
  };
}


// Actualizar el indicador mientras se escribe.
const campoPassword = document.querySelector("#password");

campoPassword.addEventListener("input", () => {

  // Destructuring de las propiedades del resultado.
  const { nivel, color, puntos } =
    evaluarFortaleza(campoPassword.value);

  let indicador = document.querySelector("#fortaleza");

  // Crear el indicador si todavía no existe.
  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "fortaleza";

    campoPassword.insertAdjacentElement(
      "afterend",
      indicador
    );
  }

  // Actualizar texto y color.
  indicador.textContent =
    puntos > 0 ? `Contraseña: ${nivel}` : "";

  indicador.style.color = color;
});

});
