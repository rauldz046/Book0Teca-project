const ControleSolicitacoes = require("../models/ControleSolicitacoes");
const TiposSolicitacao = require("../models/TiposSolicitacao");
const EtapasTipoSolicitacao = require("../models/EtapasTipoSolicitacao");
const FormularioSolicitacao = require("../models/FormularioSolicitacao");

const controller = {};

/* CRIAR SOLICITAÇÃO */
controller.criar = async (req, res) => {
  const { Descricao, CriadaPor, FormularioId, TiposSolicitacaoId } = req.body;
  try {
    // Toda solicitação começa na etapa 1 (Aberto)
    const etapaInicial = await EtapasTipoSolicitacao.findOne({
      where: { Ordem: 1 },
    });

    if (!etapaInicial) {
      return res.status(500).json({ message: "Etapa inicial não configurada no sistema" });
    }

    const solicitacao = await ControleSolicitacoes.create({
      Descricao,
      CriadaPor,
      FormularioId: FormularioId || null,
      TiposSolicitacao: TiposSolicitacaoId,
      Etapas: etapaInicial.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Solicitação criada", solicitacao });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET ALL */
controller.findAll = async (req, res) => {
  try {
    const solicitacoes = await ControleSolicitacoes.findAll({
      include: [
        { model: FormularioSolicitacao, as: "formulario" },
        { model: TiposSolicitacao, as: "tipo", attributes: ["Descricao"] },
        { model: EtapasTipoSolicitacao, as: "etapa", attributes: ["Descricao", "Ordem", "Final"] },
      ],
    });
    return res.status(200).json(solicitacoes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.findById = async (req, res) => {
  try {
    const sol = await ControleSolicitacoes.findByPk(req.params.id, {
      include: [
        { model: FormularioSolicitacao, as: "formulario" },
        { model: TiposSolicitacao, as: "tipo" },
        { model: EtapasTipoSolicitacao, as: "etapa" },
      ],
    });
    if (!sol) return res.status(404).json({ message: "Solicitação não encontrada" });
    return res.status(200).json(sol);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* AVANÇAR ETAPA */
controller.avancarEtapa = async (req, res) => {
  const { idSolicitacao } = req.body;
  try {
    const sol = await ControleSolicitacoes.findByPk(idSolicitacao, {
      include: [{ model: EtapasTipoSolicitacao, as: "etapa" }],
    });

    if (!sol) return res.status(404).json({ message: "Solicitação não encontrada" });

    if (sol.etapa.Final === 1) {
      return res.status(400).json({ message: "Solicitação já está em etapa final" });
    }

    const proximaEtapa = await EtapasTipoSolicitacao.findOne({
      where: { Ordem: sol.etapa.Ordem + 1 },
    });

    if (!proximaEtapa) {
      return res.status(404).json({ message: "Próxima etapa não encontrada" });
    }

    await ControleSolicitacoes.update(
      { Etapas: proximaEtapa.id, updated_at: new Date() },
      { where: { Id: idSolicitacao } }
    );

    return res.status(200).json({
      message: "Etapa avançada",
      novaEtapa: proximaEtapa.Descricao,
      final: proximaEtapa.Final === 1,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CANCELAR — força pra etapa "Cancelado" (Final = 1) */
controller.cancelar = async (req, res) => {
  const { idSolicitacao } = req.body;
  try {
    const etapaCancelado = await EtapasTipoSolicitacao.findOne({
      where: { Descricao: "Cancelado" },
    });

    if (!etapaCancelado) {
      return res.status(500).json({ message: "Etapa 'Cancelado' não configurada no sistema" });
    }

    const [updated] = await ControleSolicitacoes.update(
      { Etapas: etapaCancelado.id, updated_at: new Date() },
      { where: { Id: idSolicitacao } }
    );

    if (!updated) return res.status(404).json({ message: "Solicitação não encontrada" });
    return res.status(200).json({ message: "Solicitação cancelada" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* LISTAR TIPOS DE SOLICITAÇÃO */
controller.findTipos = async (req, res) => {
  try {
    const tipos = await TiposSolicitacao.findAll();
    return res.status(200).json(tipos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* LISTAR ETAPAS */
controller.findEtapas = async (req, res) => {
  try {
    const etapas = await EtapasTipoSolicitacao.findAll({
      order: [["Ordem", "ASC"]],
    });
    return res.status(200).json(etapas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
