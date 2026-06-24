const express = require("express");
const router = express.Router();

const {
  obtenerCursos,
  obtenerCursoPorId,
  registrarCurso,
  eliminarCurso
} = require("../controllers/cursoController");

router.get("/", obtenerCursos);
router.get("/:id", obtenerCursoPorId);
router.post("/", registrarCurso);
router.delete("/:id", eliminarCurso);

module.exports = router;