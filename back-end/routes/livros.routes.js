const express = require("express");
const router = express.Router();
const LivroController = require("../controllers/Livros.controller");

router.get("/findAll",      LivroController.findAll);
router.get("/buscar",       LivroController.buscar);        // ?titulo=&autorId=&tipo=fisico|digital
router.get("/:id",          LivroController.findById);
router.post("/create",      LivroController.createLivro);
router.post("/update",      LivroController.updateLivro);
router.post("/estoque",     LivroController.entradaEstoque); // entrada de lote (RF21)
router.post("/delete",      LivroController.deleteLivro);

module.exports = router;
