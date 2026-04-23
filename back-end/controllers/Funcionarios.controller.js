const bcrypt = require("bcrypt"); // BUG CORRIGIDO — estava faltando este import
const Funcionario = require("../models/Funcionarios");
const Status = require("../models/StatusAtividadeGeral");
const InfoEndereco = require("../models/InfoEndereco");
const InfoBancario = require("../models/InfoBancario");
const PerfilFuncionario = require("../models/PerfilFuncionarios");

const controller = {};

/* CREATE */
controller.FuncionariosCreate = async (req, res) => {
  const data = req.body;
  try {
    const senhaHash = await bcrypt.hash(data.SenhaFunc, 10);

    const funcionario = await Funcionario.create({
      MatriculaFunc: data.MatriculaFunc,
      NomeFunc: data.NomeFunc,
      CPFFunc: data.CPFFunc,
      EmailFunc: data.EmailFunc,
      RegiaoFunc: data.RegiaoFunc,
      SenhaFunc: senhaHash,
      SenhaInicialFunc: 1,
      CadastradoPor: data.CadastradoPor,
      idPerfilFuncionarios: data.idPerfilFuncionarios,
      StatusAtividadeGeral_idStatus: data.StatusAtividadeGeral_idStatus || 1,
      InfoBancario_IdInfoBancario: data.InfoBancario_IdInfoBancario,
      InfoEndereco_idInfoEnd: data.InfoEndereco_idInfoEnd,
      created_date: new Date(),
      update_date: new Date(),
    });

    return res.status(201).json(funcionario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* LOGIN */
controller.loginValidation = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const infoUser = await Funcionario.findOne({ where: { EmailFunc: email } });

    if (!infoUser) {
      return res.status(401).json({ message: "Funcionário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, infoUser.SenhaFunc);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const infoSessao = {
      idFuncionario: infoUser.idFuncionario,
      MatriculaFunc: infoUser.MatriculaFunc,
      NomeFunc: infoUser.NomeFunc,
      EmailFunc: infoUser.EmailFunc,
      CPFFunc: infoUser.CPFFunc,
      RegiaoFunc: infoUser.RegiaoFunc,
      CadastradoPor: infoUser.CadastradoPor,
      idPerfilFuncionarios: infoUser.idPerfilFuncionarios,
      StatusAtividadeGeral_idStatus: infoUser.StatusAtividadeGeral_idStatus,
      created_date: infoUser.created_date,
    };

    return res.status(200).json({ message: "sucesso", infoSessao });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/* GET ALL */
controller.getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll({
      attributes: { exclude: ["SenhaFunc"] },
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: InfoEndereco, as: "endereco" },
        { model: InfoBancario, as: "banco" },
        { model: PerfilFuncionario, as: "perfil", attributes: ["Descricao"] },
      ],
    });
    return res.status(200).json(funcionarios);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.getFuncionarioById = async (req, res) => {
  try {
    const func = await Funcionario.findByPk(req.params.id, {
      attributes: { exclude: ["SenhaFunc"] },
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: PerfilFuncionario, as: "perfil", attributes: ["Descricao"] },
      ],
    });
    if (!func) return res.status(404).json({ message: "Funcionário não encontrado" });
    return res.status(200).json(func);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
controller.updateFuncionario = async (req, res) => {
  const { idFuncionario, ...dados } = req.body;
  try {
    const [updated] = await Funcionario.update(
      { ...dados, update_date: new Date() },
      { where: { idFuncionario } }
    );
    if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
    return res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE PASSWORD */
controller.updatePassword = async (req, res) => {
  const { idFuncionario, SenhaFunc } = req.body;
  try {
    const senhaHash = await bcrypt.hash(SenhaFunc, 10);
    const [updated] = await Funcionario.update(
      { SenhaFunc: senhaHash, SenhaInicialFunc: 0, update_date: new Date() },
      { where: { idFuncionario } }
    );
    if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
    return res.status(200).json({ message: "Senha atualizada" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE STATUS */
controller.updateStatus = async (req, res) => {
  const { idFuncionario, idStatus } = req.body;
  try {
    const [updated] = await Funcionario.update(
      { StatusAtividadeGeral_idStatus: idStatus, update_date: new Date() },
      { where: { idFuncionario } }
    );
    if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
    return res.status(200).json({ message: "Status atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* SOFT DELETE */
controller.deleteFuncionario = async (req, res) => {
  const { idFuncionario } = req.body;
  try {
    await Funcionario.update(
      { StatusAtividadeGeral_idStatus: 2, update_date: new Date() },
      { where: { idFuncionario } }
    );
    await Funcionario.destroy({ where: { idFuncionario } });
    return res.status(200).json({ message: "Funcionário desativado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
