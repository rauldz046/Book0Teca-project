
const Funcionario = require("../models/Funcionarios");
const Status = require("../models/StatusAtividadeGeral");
const InfoEndereco = require("../models/InfoEndereco");
const InfoBancario = require("../models/InfoBancario");
const PerfilFuncionario = require("../models/PerfilFuncionarios");

const controller = {};

/* CREATE */
controller.FuncionariosCreate = async (req, res) => {
  const data = req.body;
  const senhaHash = await bcrypt.hash(data.SenhaFunc, 10);

  try {
    const funcionario = await Funcionario.create({
      MatriculaFunc: data.MatriculaFunc,
      NomeFunc: data.NomeFunc,
      CPFFunc: data.CPFFunc,
      EmailFunc: data.EmailFunc,
      RegiaoFunc: data.RegiaoFunc,
      SenhaFunc: senhaHash,
      SenhaInicialFunc: data.SenhaInicialFunc,
      CadastradoPor: data.CadastradoPor,
      idPerfilFuncionarios: data.idPerfilFuncionarios,
      StatusAtividadeGeral_idStatus: data.StatusAtividadeGeral_idStatus,
      InfoBancario_IdInfoBancario: data.InfoBancario_IdInfoBancario,
      InfoEndereco_idInfoEnd: data.InfoEndereco_idInfoEnd,
      created_date: new Date(),
      update_date: new Date(),
    });

    res.status(200).json(funcionario);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* LOGIN */
controller.loginValidation = async (req, res) => {
  const { email, senha } = req.body; 

  try {
    const infoUser = await Funcionario.findOne({
      where: { EmailFunc: email },
    });

    if (!infoUser || !senha) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    // const senhaValida = await bcrypt.compare(senha, infoUser.Senha);

    // if (!senhaValida) {
    //   return res.status(401).json({ message: "Usuário ou senha inválidos" });

    // }

    const infoSessao = {
      idFuncionario: infoUser.idFuncionario,
      MatriculaFunc: infoUser.MatriculaFunc,
      NomeFunc: infoUser.NomeFunc,
      EmailFunc: infoUser.EmailFunc,
      CPFFunc: infoUser.CPFFunc,
      RegiaoFunc: infoUser.RegiaoFunc,
      TelefoneFunc: infoUser.TelefoneFunc,
      CadastradioPor: infoUser.CadastradoPor,
      idPerfilFuncionarios: infoUser.idPerfilFuncionarios,
      StatusAtividadeGeral_idStatus: infoUser.StatusAtividadeGeral_idStatus,
      created_at: infoUser.created_at,
      updated_at: infoUser.updated_at,
    };
    

    return res.status(200).json({ menssage: "sucesso", infoSessao });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/* GET ALL */
controller.getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll({
      include: [
        { model: Status, as: "statusInfo", attributes: ["Descricao"] },
        { model: InfoEndereco, as: "endereco" },
        { model: InfoBancario, as: "banco" },
        { model: PerfilFuncionario, as: "perfil" },
      ],
    });

    res.status(200).json(funcionarios);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


/* UPDATE */
controller.updateFuncionario = async (req, res) => {
  const data = req.body;

  try {
    await Funcionario.update(data, {
      where: { idFuncionario: data.idFuncionario },
    });

    res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* UPDATE PASSWORD */
controller.updatePassword = async (req, res) => {
  const data = req.body;
  const senhaHash = await bcrypt.hash(data.SenhaFunc, 10);

  try {
    await Funcionario.update(
      { SenhaFunc: senhaHash },
      { where: { idFuncionario: data.idFuncionario } }
    );

    res.json({ message: "Senha Atualizada" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* UPDATE STATUS */
controller.updateStatus = async (req, res) => {
  const data = req.body;

  try {
    const newStatus = await Status.findOne({
      where: { Descricao: data.Descricao },
    });

    if (!newStatus) {
      return res.status(404).json({ message: "Status não encontrado" });
    }

    await Funcionario.update(
      { StatusAtividadeGeral_idStatus: newStatus.idStatus },
      { where: { idFuncionario: data.idFuncionario } }
    );

    res.status(200).json({ message: "Status atualizado" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* DELETE (PARANOID) */
controller.deleteFuncionario = async (req, res) => {
  const data = req.body;

  try {
    await Funcionario.destroy({
      where: { idFuncionario: data.idFuncionario },
    });

    res.json({ message: "Deletado" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = controller;