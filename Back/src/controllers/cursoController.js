const { getConnection, sql } = require("../config/db");

const obtenerCursos = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT Id, Nombre, Categoria, Duracion, CuposDisponibles, Activo
      FROM Cursos
      ORDER BY Id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los cursos",
      error: error.message
    });
  }
};

const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query(`
        SELECT Id, Nombre, Categoria, Duracion, CuposDisponibles, Activo
        FROM Cursos
        WHERE Id = @Id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        mensaje: "Curso no encontrado"
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el curso",
      error: error.message
    });
  }
};

const registrarCurso = async (req, res) => {
  try {
    const { Nombre, Categoria, Duracion, CuposDisponibles, Activo } = req.body;

    if (!Nombre || !Categoria || Duracion === "" || CuposDisponibles === "") {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const pool = await getConnection();

    await pool.request()
      .input("Nombre", sql.NVarChar(100), Nombre)
      .input("Categoria", sql.NVarChar(100), Categoria)
      .input("Duracion", sql.Int, Duracion)
      .input("CuposDisponibles", sql.Int, CuposDisponibles)
      .input("Activo", sql.Bit, Activo ? 1 : 0)
      .query(`
        INSERT INTO Cursos (Nombre, Categoria, Duracion, CuposDisponibles, Activo)
        VALUES (@Nombre, @Categoria, @Duracion, @CuposDisponibles, @Activo)
      `);

    res.status(201).json({
      mensaje: "Curso registrado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar el curso",
      error: error.message
    });
  }
};

const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query(`
        DELETE FROM Cursos
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        mensaje: "Curso no encontrado"
      });
    }

    res.json({
      mensaje: "Curso eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el curso",
      error: error.message
    });
  }
};

const obtenerEstadisticas = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        COUNT(*) AS totalCursos,
        SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS cursosActivos,
        SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS cursosInactivos
      FROM Cursos
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener estadísticas",
      error: error.message
    });
  }
};

const actualizarEstadoCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query(`
        UPDATE Cursos
        SET Activo = CASE 
          WHEN Activo = 1 THEN 0 
          ELSE 1 
        END
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        mensaje: "Curso no encontrado"
      });
    }

    res.json({
      mensaje: "Estado del curso actualizado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar el estado",
      error: error.message
    });
  }
};

module.exports = {
  obtenerCursos,
  obtenerCursoPorId,
  registrarCurso,
  eliminarCurso,
  obtenerEstadisticas,
  actualizarEstadoCurso
};