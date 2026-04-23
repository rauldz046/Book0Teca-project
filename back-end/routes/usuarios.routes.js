const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/Usuarios.controller");

router.get("/findAll",        UsuarioController.getUsers);
router.get("/:id",            UsuarioController.getUserById);
router.post("/login",         UsuarioController.loginValidation);
router.post("/createUser",    UsuarioController.UsuariosCreate);
router.post("/updateUser",    UsuarioController.updateUser);
router.post("/updateStatus",  UsuarioController.updateStatus);
router.post("/updatePassword",UsuarioController.updatePassword);
router.post("/deleteUser",    UsuarioController.deleteUser);

module.exports = router;
