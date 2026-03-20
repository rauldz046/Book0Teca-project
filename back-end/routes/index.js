const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");
const LivroController = require("../controllers/LivroController");
const AutorController = require("../controllers/AutorController");

router.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Usuarios
router.get('/usuarios', UsuarioController.getUsers);          // GET todos
router.get('/usuarios/:id', UsuarioController.getUserById);  // GET por ID
router.post('/usuarios', UsuarioController.createUsers);     // CREATE
router.put('/usuarios/:id', UsuarioController.updateUser);   // UPDATE
router.delete('/usuarios/:id', UsuarioController.deleteUser);// DELETE

// // Livros
// router.get("/livros", LivroController.findAll);
// router.post("/livros", LivroController.create);

// // Autores
// router.get("/autores", AutorController.findAll);
// router.post("/autores", AutorController.create);

module.exports = router;
