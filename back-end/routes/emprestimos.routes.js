const express = require("express");
const router = express.Router();
const EmprestimoController = require("../controllers/Emprestimos.controller");

router.get("/findAll",          EmprestimoController.findAll);
router.get("/:id",              EmprestimoController.findById);
router.post("/registrar",       EmprestimoController.registrarEmprestimo);  // RF12, RF13
router.post("/devolver",        EmprestimoController.confirmarDevolucao);   // RF14, RF20

module.exports = router;
