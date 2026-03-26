const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/Usuarios.controller");

router.get("/findAll", UsuarioController.getUsers);
router.post("/login", UsuarioController.loginValidation);
router.post("/cretateUser", UsuarioController.UsuariosCreate);
router.post("/updateUser", UsuarioController.updateUser);
router.post("/deleteUser", UsuarioController.deleteUser);
router.post("/updateStatus", UsuarioController.updateStatus);
router.post("/updatePassword", UsuarioController.updatePassword);

module.exports = router;