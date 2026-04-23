const express = require("express");
const router = express.Router();
const FuncionariosController = require("../controllers/Funcionarios.controller");

router.get("/findAll",          FuncionariosController.getFuncionarios);
router.get("/:id",              FuncionariosController.getFuncionarioById);
router.post("/login",           FuncionariosController.loginValidation);
router.post("/create",          FuncionariosController.FuncionariosCreate);
router.post("/update",          FuncionariosController.updateFuncionario);
router.post("/updateStatus",    FuncionariosController.updateStatus);
router.post("/updatePassword",  FuncionariosController.updatePassword);
router.post("/delete",          FuncionariosController.deleteFuncionario);

module.exports = router;
