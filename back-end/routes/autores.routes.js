const express = require("express");
const router = express.Router();

const AutorController = require("../controllers/Autores.controller");

router.get("/findAll", AutorController.findAll);
router.post("/cretaeAutor", AutorController.createAutor);
router.post("/updateAutor", AutorController.updateAutor);
router.post("/deleteAutor", AutorController.deleteAutor);

module.exports = router;