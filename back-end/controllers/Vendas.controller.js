const sequelize = require("../config/database");
const Venda = require("../models/LVendasNotasFiscais");
const Livro = require("../models/Livros");
const Usuario = require("../models/Usuarios");
const Funcionario = require("../models/Funcionarios");
const CompraStatus = require("../models/CompraStatus");

const controller = {};

/* REGISTRAR VENDA — atende RF08, RF09, RF19 (baixa automática), RNF04 (ACID) */
controller.registrarVenda = async (req, res) => {
  const { idLivro, idUsuario, FuncionarioResponsavel, ValorPago } = req.body;
  const t = await sequelize.transaction();

  try {
    const livro = await Livro.findByPk(idLivro);
    if (!livro) {
      await t.rollback();
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    // Bloqueia compra se estoque zerado — RF37
    if (livro.LivroFisico && livro.QtdLivros <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Livro físico sem estoque disponível" });
    }

    const venda = await Venda.create(
      {
        Livro: idLivro,
        idUsuario,
        FuncionarioResponsavel: FuncionarioResponsavel || null,
        CompraStatus: 1, // 1 = Pendente — aguarda confirmação de pagamento
        ValorCompra: livro.PrecoVenda,
        ValorPago: ValorPago || 0,
        DataCompra: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    // Baixa de estoque só pra livro físico — digital não reduz qtd (RF09)
    if (livro.LivroFisico) {
      await Livro.update(
        { QtdLivros: livro.QtdLivros - 1, updated_at: new Date() },
        { where: { idLivro }, transaction: t }
      );
    }

    await t.commit();
    return res.status(201).json({ message: "Venda registrada", venda });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/* GET ALL */
controller.findAll = async (req, res) => {
  try {
    const vendas = await Venda.findAll({
      include: [
        { model: Livro, as: "livro", attributes: ["idLivro", "Titulo", "LivroFisico", "LivroDigital"] },
        { model: Usuario, as: "usuario", attributes: ["idUsuario", "Nome", "Email"] },
        { model: Funcionario, as: "funcionario", attributes: ["idFuncionario", "NomeFunc"] },
        { model: CompraStatus, as: "status", attributes: ["Descricao"] },
      ],
    });
    return res.status(200).json(vendas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.findById = async (req, res) => {
  try {
    const venda = await Venda.findByPk(req.params.id, {
      include: [
        { model: Livro, as: "livro" },
        { model: Usuario, as: "usuario", attributes: { exclude: ["Senha"] } },
        { model: CompraStatus, as: "status" },
      ],
    });
    if (!venda) return res.status(404).json({ message: "Venda não encontrada" });
    return res.status(200).json(venda);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CONFIRMAR PAGAMENTO — atende RF27, RF28 */
controller.confirmarPagamento = async (req, res) => {
  const { idVenda, ValorPago } = req.body;
  try {
    const venda = await Venda.findByPk(idVenda);
    if (!venda) return res.status(404).json({ message: "Venda não encontrada" });

    // Status 2 = Pago
    await Venda.update(
      { CompraStatus: 2, ValorPago, updated_at: new Date() },
      { where: { id: idVenda } }
    );

    return res.status(200).json({ message: "Pagamento confirmado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CANCELAR VENDA — atende RF39 */
controller.cancelarVenda = async (req, res) => {
  const { idVenda } = req.body;
  const t = await sequelize.transaction();

  try {
    const venda = await Venda.findByPk(idVenda);
    if (!venda) {
      await t.rollback();
      return res.status(404).json({ message: "Venda não encontrada" });
    }

    // Só cancela se ainda estiver pendente
    if (venda.CompraStatus !== 1) {
      await t.rollback();
      return res.status(400).json({ message: "Não é possível cancelar uma venda já paga ou processada" });
    }

    // Devolve ao estoque se era físico
    const livro = await Livro.findByPk(venda.Livro);
    if (livro && livro.LivroFisico) {
      await Livro.increment("QtdLivros", {
        by: 1,
        where: { idLivro: venda.Livro },
        transaction: t,
      });
    }

    // Status 3 = Cancelado
    await Venda.update(
      { CompraStatus: 3, updated_at: new Date() },
      { where: { id: idVenda }, transaction: t }
    );

    await t.commit();
    return res.status(200).json({ message: "Venda cancelada" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/* RELATÓRIO DE VENDAS POR PERÍODO — atende RF30 */
controller.relatorioVendas = async (req, res) => {
  const { dataInicio, dataFim } = req.query;
  const { Op } = require("sequelize");

  try {
    const where = {};
    if (dataInicio && dataFim) {
      where.DataCompra = { [Op.between]: [dataInicio, dataFim] };
    }

    const vendas = await Venda.findAll({
      where,
      include: [
        { model: Livro, as: "livro", attributes: ["Titulo"] },
        { model: Usuario, as: "usuario", attributes: ["Nome"] },
        { model: CompraStatus, as: "status", attributes: ["Descricao"] },
      ],
    });

    const totalArrecadado = vendas
      .filter((v) => v.CompraStatus === 2)
      .reduce((acc, v) => acc + (v.ValorPago || 0), 0);

    return res.status(200).json({ vendas, totalArrecadado });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
