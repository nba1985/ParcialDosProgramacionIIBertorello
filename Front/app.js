const API_URL = "http://localhost:3000/api/cursos";

const formulario = document.querySelector("#formCurso");
const nombre = document.querySelector("#nombre");
const categoria = document.querySelector("#categoria");
const duracion = document.querySelector("#duracion");
const cupos = document.querySelector("#cupos");
const activo = document.querySelector("#activo");
const listado = document.querySelector("#listadoCursos");
const mensaje = document.querySelector("#mensaje");

const btnCargar = document.querySelector("#btnCargar");
const btnTodos = document.querySelector("#btnTodos");
const btnActivos = document.querySelector("#btnActivos");
const btnConCupos = document.querySelector("#btnConCupos");

const totalCursos = document.querySelector("#totalCursos");
const cursosActivos = document.querySelector("#cursosActivos");
const cursosInactivos = document.querySelector("#cursosInactivos");

let cursosActuales = [];

async function cargarCursos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("Error al obtener cursos");
    }

    const cursos = await respuesta.json();
    cursosActuales = cursos;
    mostrarCursos(cursosActuales);

  } catch (error) {
    mensaje.textContent = "No se pudo conectar con la API.";
    mensaje.className = "error";
  }
}

async function cargarEstadisticas() {
  try {
    const respuesta = await fetch(`${API_URL}/estadisticas/general`);

    if (!respuesta.ok) {
      throw new Error("Error estadísticas");
    }

    const datos = await respuesta.json();

    totalCursos.textContent = datos.totalCursos;
    cursosActivos.textContent = datos.cursosActivos;
    cursosInactivos.textContent = datos.cursosInactivos;

  } catch (error) {
    console.error(error);
  }
}

function mostrarCursos(cursos) {
  listado.innerHTML = "";

  if (cursos.length === 0) {
    listado.innerHTML = `<p class="sin-resultados">No hay cursos para mostrar.</p>`;
    return;
  }

  cursos.forEach(curso => {
    const estaActivo = curso.Activo === true || curso.Activo === 1;
    const textoActivo = estaActivo ? "Activo" : "Inactivo";
    const claseActivo = estaActivo ? "activo" : "inactivo";

    listado.innerHTML += `
      <div class="tarjeta">
        <h3>${curso.Nombre}</h3>
        <p><strong>Categoría:</strong> ${curso.Categoria}</p>
        <p><strong>Duración:</strong> ${curso.Duracion} horas</p>
        <p><strong>Cupos:</strong> ${curso.CuposDisponibles}</p>
        <p class="${claseActivo}">${textoActivo}</p>

        <button onclick="cambiarEstadoCurso(${curso.Id})">
          Cambiar estado
        </button>

        <button class="eliminar" onclick="eliminarCurso(${curso.Id})">
          Eliminar
        </button>
      </div>
    `;
  });
}

async function guardarCurso(evento) {
  evento.preventDefault();

  const nuevoCurso = {
    Nombre: nombre.value.trim(),
    Categoria: categoria.value.trim(),
    Duracion: parseInt(duracion.value),
    CuposDisponibles: parseInt(cupos.value),
    Activo: activo.value === "true"
  };

  if (
    nuevoCurso.Nombre === "" ||
    nuevoCurso.Categoria === "" ||
    isNaN(nuevoCurso.Duracion) ||
    isNaN(nuevoCurso.CuposDisponibles)
  ) {
    mensaje.textContent = "Debe completar todos los datos correctamente.";
    mensaje.className = "error";
    return;
  }

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCurso)
    });

    if (!respuesta.ok) {
      throw new Error("Error al guardar");
    }

    mensaje.textContent = "Curso guardado correctamente.";
    mensaje.className = "ok";
    formulario.reset();

    cargarCursos();
    cargarEstadisticas();

  } catch (error) {
    mensaje.textContent = "Error al guardar el curso.";
    mensaje.className = "error";
  }
}

async function eliminarCurso(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("Error al eliminar");
    }

    mensaje.textContent = "Curso eliminado correctamente.";
    mensaje.className = "ok";

    cargarCursos();
    cargarEstadisticas();

  } catch (error) {
    mensaje.textContent = "Error al eliminar el curso.";
    mensaje.className = "error";
  }
}

async function cambiarEstadoCurso(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}/estado`, {
      method: "PUT"
    });

    if (!respuesta.ok) {
      throw new Error("Error al actualizar estado");
    }

    mensaje.textContent = "Estado actualizado correctamente.";
    mensaje.className = "ok";

    cargarCursos();
    cargarEstadisticas();

  } catch (error) {
    mensaje.textContent = "Error al actualizar el estado.";
    mensaje.className = "error";
  }
}

function mostrarTodos() {
  mostrarCursos(cursosActuales);
  mensaje.textContent = "Mostrando todos los cursos.";
  mensaje.className = "ok";
}

function mostrarActivos() {
  const activos = cursosActuales.filter(curso => curso.Activo === true || curso.Activo === 1);
  mostrarCursos(activos);
  mensaje.textContent = "Mostrando cursos activos.";
  mensaje.className = "ok";
}

function mostrarConCupos() {
  const conCupos = cursosActuales.filter(curso => curso.CuposDisponibles > 0);
  mostrarCursos(conCupos);
  mensaje.textContent = "Mostrando cursos con cupos disponibles.";
  mensaje.className = "ok";
}

formulario.addEventListener("submit", guardarCurso);
btnCargar.addEventListener("click", () => {
  cargarCursos();
  cargarEstadisticas();
});
btnTodos.addEventListener("click", mostrarTodos);
btnActivos.addEventListener("click", mostrarActivos);
btnConCupos.addEventListener("click", mostrarConCupos);

cargarCursos();
cargarEstadisticas();