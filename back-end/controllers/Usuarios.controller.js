const Usuario = require("../models/Usuarios");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const Status = require("../models/StatusAtividadeGeral");
const InfoEndereco = require("../models/InfoEndereco");
const InfoBancario = require("../models/InfoBancario");

const controller = {};

/* CREATE — usa transação ACID (RNF04) */
controller.UsuariosCreate = async (req, res) => {
  const { payloadUser, payloadBanco, payloadEndereco } = req.body;
  const t = await sequelize.transaction();

  try {
    const senhaHash = await bcrypt.hash(payloadUser.Senha, 10);

    const banco = await InfoBancario.create(
      { ...payloadBanco, created_at: new Date(), updated_at: new Date() },
      { transaction: t }
    );

    const endereco = await InfoEndereco.create(
      { ...payloadEndereco, created_at: new Date(), updated_at: new Date() },
      { transaction: t }
    );

    const user = await Usuario.create(
      {
        ...payloadUser,
        Senha: senhaHash,
        Status: 1,
        InfoEndereco: endereco.idInfoEnd,
        InfoBancario: banco.IdInfoBancario,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json(user);
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/* LOGIN */
controller.loginValidation = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const infoUser = await Usuario.findOne({ where: { Email: email } });

    if (!infoUser) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, infoUser.Senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Nunca retornar a senha — LGPD + segurança básica
    const infoSessao = {
      idUsuario: infoUser.idUsuario,
      Nome: infoUser.Nome,
      Email: infoUser.Email,
      Status: infoUser.Status,
      CPF: infoUser.CPF,
      Telefone: infoUser.Telefone,
      InfoEndereco: infoUser.InfoEndereco,
      InfoBancario: infoUser.InfoBancario,
      created_at: infoUser.created_at,
      updated_at: infoUser.updated_at,
    };

    return res.status(200).json({ message: "valid", infoSessao });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/* GET ALL */
controller.getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ["Senha"] },
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: InfoEndereco, as: "endereco" },
        { model: InfoBancario, as: "banco" },
      ],
    });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.getUserById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["Senha"] },
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: InfoEndereco, as: "endereco" },
        { model: InfoBancario, as: "banco" },
      ],
    });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE STATUS — BUG CORRIGIDO (era resres + lógica errada do update) */
controller.updateStatus = async (req, res) => {
  const { idUsuario, idStatus } = req.body;
  try {
    const [updated] = await Usuario.update(
      { Status: idStatus, updated_at: new Date() },
      { where: { idUsuario } }
    );
    if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json({ message: "Status atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE USER */
controller.updateUser = async (req, res) => {
  const { idUsuario, ...dados } = req.body;
  try {
    const [updated] = await Usuario.update(
      { ...dados, updated_at: new Date() },
      { where: { idUsuario } }
    );
    if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE PASSWORD */
controller.updatePassword = async (req, res) => {
  const { idUsuario, Senha } = req.body;
  try {
    const senhaHash = await bcrypt.hash(Senha, 10);
    const [updated] = await Usuario.update(
      { Senha: senhaHash, SenhaInicial: 0, updated_at: new Date() },
      { where: { idUsuario } }
    );
    if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json({ message: "Senha atualizada" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* SOFT DELETE — BUG CORRIGIDO (destroy não aceita attributes) */
controller.deleteUser = async (req, res) => {
  const { idUsuario } = req.body;
  try {
    // paranoid: true no model garante que deleted_at seja preenchido automaticamente
    // Antes do destroy, desativa o status
    await Usuario.update(
      { Status: 2, updated_at: new Date() },
      { where: { idUsuario } }
    );
    await Usuario.destroy({ where: { idUsuario } });
    return res.status(200).json({ message: "Usuário desativado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
