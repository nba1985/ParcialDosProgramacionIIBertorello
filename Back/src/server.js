const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/../.env" });

const cursoRoutes = require("./routes/cursoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de Cursos funcionando");
});

app.use("/api/cursos", cursoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});