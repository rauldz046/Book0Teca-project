const express = require("express");
const router = express.Router();

const FuncionariosController = require("../controllers/Funcionarios.controller");

router.get("/findAll",FuncionariosController.getFuncionarios);
router.post("/login",FuncionariosController.loginValidation);
router.post("/cretatefunc",FuncionariosController.FuncionariosCreate);
router.post("/updatefunc",FuncionariosController.updateFuncionario);
router.post("/deletefunc",FuncionariosController.deleteFuncionario);
router.post("/updatestatusfunc",FuncionariosController.updateStatus);
router.post("/updatepasswordfunc",FuncionariosController.updatePassword);

module.exports = router;
