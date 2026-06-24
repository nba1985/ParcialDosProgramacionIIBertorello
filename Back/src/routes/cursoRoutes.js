const express = require("express");
const router = express.Router();

const {
  obtenerCursos,
  obtenerCursoPorId,
  registrarCurso,
  eliminarCurso,
  obtenerEstadisticas,
  actualizarEstadoCurso
} = require("../controllers/cursoController");

router.get("/", obtenerCursos);
router.get("/estadisticas/general", obtenerEstadisticas);
router.get("/:id", obtenerCursoPorId);
router.post("/", registrarCurso);
router.put("/:id/estado", actualizarEstadoCurso);
router.delete("/:id", eliminarCurso);

module.exports = router;