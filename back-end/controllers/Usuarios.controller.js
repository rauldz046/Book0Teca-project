const Usuario = require("../models/Usuarios");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const Status = require("../models/StatusAtividadeGeral");
const InfoEndereco = require("../models/InfoEndereco");
const InfoBancario = require("../models/InfoBancario");
const controller = {};

controller.UsuariosCreate = async (req, res) => {
  const data = req.body;
  const infoUser = data.payloadUser;
  const infoBanco = data.payloadBanco;
  const infoEndereco = data.payloadEndereco;
  const senhaHash = await bcrypt.hash(infoUser.Senha, 10);
  const t = await sequelize.transaction();
  try {
    const banco = await InfoBancario.create(
      { ...infoBanco, created_at: Date.now(), updated_at: Date.now() },
      { transaction: t },
    );
    const endereco = await InfoEndereco.create(
      { ...infoEndereco, created_at: Date.now(), updated_at: Date.now() },
      {
        transaction: t,
      },
    );
    const user = await Usuario.create(
      {
        ...infoUser,

        Senha: senhaHash,
        Status: 1,
        InfoEndereco: endereco.dataValues.idInfoEnd,
        InfoBancario: banco.dataValues.IdInfoBancario,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      { transaction: t },
    );

    await t.commit();

    res.status(200).json(user);
  } catch (err) {
    await t.rollback();
    return res.status(500).json(err.message);
  }
};

controller.loginValidation = async (req, res) => {
  const { email, senha } = req.body; // Desestruturação mais limpa

  try {
    const infoUser = await Usuario.findOne({
      where: { Email: email },
    });

    if (!infoUser || !senha) {
      return res.status(401).json("invalid");
    }

    // const senhaValida = await bcrypt.compare(senha, infoUser.Senha);

    // if (!senhaValida) {
    //   return res.status(401).json({ message: "invalid" });
    // }

    const infoSessao ={
      idUsuario: infoUser.idUsuario,
      Nome: infoUser.Nome,
      Email: infoUser.Email,
      Status: infoUser.Status,
      CPF: infoUser.CPF,
      Telefone: infoUser.Telefone,
      InfoEndereco: infoUser.InfoEndereco,
      InfoBancario: infoUser.InfoBancario,
      FotoPerfil: infoUser.fotoperfil,  
      created_at: infoUser.created_at,
      updated_at: infoUser.updated_at
    };
    

    return res.status(200).json({ menssage: "valid", infoSessao });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
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
};

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
};

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
