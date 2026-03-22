const express = require("express");
const router = express.Router();

const UsuariosRoutes = require("./usuarios.routes");
const LivrosRoutes = require("./livros.routes");
const AutoresRoutes = require("./autores.routes");

router.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

router.use("/usuarios", UsuariosRoutes);
router.use("/livros", LivrosRoutes);
router.use("/autores", AutoresRoutes);

module.exports = router;