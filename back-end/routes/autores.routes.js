const express = require("express");
const router = express.Router();
const AutorController = require("../controllers/Autores.controller");

router.get("/findAll",        AutorController.findAll);
router.get("/:id",            AutorController.findById);
router.post("/createAutor",   AutorController.createAutor);
router.post("/updateAutor",   AutorController.updateAutor);  // body: { id, ...campos }
router.post("/deleteAutor",   AutorController.deleteAutor);  // body: { id }

module.exports = router;
