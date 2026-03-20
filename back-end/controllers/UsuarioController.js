const Usuario = require("../models/Usuarios");

const controller = {};

// CREATE
controller.createUsers = async (req, res) => {
  try {
    const user = await Usuario.create(req.body);
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET ALL
controller.getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll();
    return res.json(users);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET BY ID
controller.getUserById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// UPDATE
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

// DELETE
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
