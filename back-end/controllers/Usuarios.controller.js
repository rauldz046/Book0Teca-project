const Usuario = require("../models/Usuarios");

const controller = {};

controller.UsuariosCreate = async (req, res) => {
  const data = req.body;
  try {
    const user = await Usuario.create({
      Nome: data.Nome,
      CPF: data.CPF,
      Telefone: data.Telefone,
      Senha: data.Senha,
      Email: data.Email,
      SenhaInicial: data.SenhaInicial,
      Status: data.Status,
      InfoEndereco: data.InfoEndereco,
      InfoBancario: data.InfoBancario,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    res.status(200).json(user);
  } catch (err) {
     
  }
};

controller.loginValidation = async (req, res) => {
  const data = req.body;
  try {
    const infoUser = await Usuario.findOne({
      where: { Email: data.email, Senha: data.senha },
    });
    return res.status(200).json(infoUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll();
    return res.json(users);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.getUserById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.updateUser = async (req, res) => {
  try {
    await Usuario.update(req.body, {
      where: { idUsuario: req.params.id },
    });
    return res.json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.deleteUser = async (req, res) => {
  try {
    await Usuario.destroy({
      where: { idUsuario: req.params.id },
    });
    return res.json({ message: "Deletado" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = controller;
