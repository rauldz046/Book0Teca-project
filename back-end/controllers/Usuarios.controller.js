const Usuario = require("../models/Usuarios");
const Status = require("../models/StatusAtividadeGeral");
const InfoEndereco = require("../models/InfoEndereco");
const InfoBancario = require("../models/InfoBancario");

const controller = {};

controller.UsuariosCreate = async (req, res) => {
  const data = req.body;
  const senhaHash = await bcrypt.hash(data.Senha, 10);
  try {
    const user = await Usuario.create({
      Nome: data.Nome,
      CPF: data.CPF,
      Telefone: data.Telefone,
      Senha: senhaHash,
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
    return res.status(500).json(err.message);
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
    const users = await Usuario.findAll({
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: InfoEndereco, as: "endereco" },
        { model: InfoBancario, as: "banco" },
      ],
    });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.getUserById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

controller.updateStatus = async (req, res) => {
  const data = req.body;
  try {
    const newStatus = await Status.findOne(data, {
      where: { Descricao: data.Descricao },
    });

    if (newStatus) {
      await Usuario.update(data, {
        where: { idUsuario: data.idUsuario },
        attributes: { Status: newStatus.idStatus },
      });
      return resres.status(200).json({ message: "Atualizado" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};


controller.updateUser = async (req, res) => {
  const data = req.body;
  try {
    await Usuario.update(req.body, {
      where: { idUsuario: data.idUsuario },
    });
    return res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

controller.updatePassword = async (req, res) => {
  const data = req.body;
  const senhaHash = await bcrypt.hash(data.Senha, 10);
  try {
    await Usuario.update(req.body, {
      where: { idUsuario: data.idUsuario },
      attributes: { Senha: senhaHash },
    });
    return res.json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

controller.deleteUser = async (req, res) => {
  const data = req.body;
  try {
    await Usuario.destroy({
      where: { idUsuario: data.idUsuario },
      attributes: { Status: 2, deleted_at: Date.now() },
    });
    return res.json({ message: "Deletado" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = controller;
