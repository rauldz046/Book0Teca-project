const express = require("express");
const router = express.Router();

const LivroController = require("../controllers/Livros.controller");

router.get("/", LivroController.findAll);
router.post("/", LivroController.createLivro);

module.exports = router;