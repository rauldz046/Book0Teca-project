const sequelize = require("../config/database");
const Emprestimo = require("../models/LivrosEmprestimos");
const Vistoria = require("../models/LVistoriasEmprestimos");
const Livro = require("../models/Livros");
const Usuario = require("../models/Usuarios");
const Funcionario = require("../models/Funcionarios");

// Regra de negócio: valor da multa diária por atraso (RF24 / RF38)
const MULTA_DIARIA = 2.5;

const controller = {};

/* REGISTRAR EMPRÉSTIMO — atende RF12, RF13, RF14, RF15 */
controller.registrarEmprestimo = async (req, res) => {
  const { idLivro, idUser, AutorizadoPor, VistoriadoPor } = req.body;
  const t = await sequelize.transaction();

  try {
    // Verifica disponibilidade em estoque (RF37)
    const livro = await Livro.findByPk(idLivro);
    if (!livro || livro.QtdLivros <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Livro sem estoque disponível para empréstimo" });
    }

    // Verifica se usuário tem multa pendente (RF17)
    // TODO: quando o módulo de multas estiver integrado, verificar aqui

    // Cria vistoria de saída
    const vistoria = await Vistoria.create(
      { VistoriadoPor, created_at: new Date(), updated_at: new Date() },
      { transaction: t }
    );

    // Registra o empréstimo
    const emprestimo = await Emprestimo.create(
      {
        AutorizadoPor,
        idLivro,
        idUser,
        IdVistoria: vistoria.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    // Baixa automática no estoque (RF19)
    await Livro.update(
      { QtdLivros: livro.QtdLivros - 1, updated_at: new Date() },
      { where: { idLivro }, transaction: t }
    );

    await t.commit();
    return res.status(201).json({ message: "Empréstimo registrado", emprestimo });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/* GET ALL — com joins para exibição na tela de empréstimos */
controller.findAll = async (req, res) => {
  try {
    const emprestimos = await Emprestimo.findAll({
      include: [
        { model: Livro, as: "livro", attributes: ["idLivro", "Titulo", "ISBN"] },
        { model: Usuario, as: "usuario", attributes: ["idUsuario", "Nome", "Email"] },
        { model: Funcionario, as: "autorizador", attributes: ["idFuncionario", "NomeFunc"] },
        { model: Vistoria, as: "vistoria" },
      ],
    });
    return res.status(200).json(emprestimos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.findById = async (req, res) => {
  try {
    const emp = await Emprestimo.findByPk(req.params.id, {
      include: [
        { model: Livro, as: "livro" },
        { model: Usuario, as: "usuario", attributes: { exclude: ["Senha"] } },
        { model: Funcionario, as: "autorizador", attributes: { exclude: ["SenhaFunc"] } },
      ],
    });
    if (!emp) return res.status(404).json({ message: "Empréstimo não encontrado" });
    return res.status(200).json(emp);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CONFIRMAR DEVOLUÇÃO — atende RF14, RF20 */
controller.confirmarDevolucao = async (req, res) => {
  const { idEmprestimo, VistoriadoPor, dataPrevisao } = req.body;
  const t = await sequelize.transaction();

  try {
    const emprestimo = await Emprestimo.findByPk(idEmprestimo);
    if (!emprestimo) {
      await t.rollback();
      return res.status(404).json({ message: "Empréstimo não encontrado" });
    }

    // Calcular multa por atraso (RF24)
    let multaAplicada = 0;
    const hoje = new Date();
    const previsao = new Date(dataPrevisao);

    if (hoje > previsao) {
      const diffMs = hoje - previsao;
      const diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      multaAplicada = diasAtraso * MULTA_DIARIA;
    }

    // Vistoria de devolução
    await Vistoria.create(
      { VistoriadoPor, created_at: hoje, updated_at: hoje },
      { transaction: t }
    );

    // Devolve ao estoque (RF20)
    await Livro.increment("QtdLivros", {
      by: 1,
      where: { idLivro: emprestimo.idLivro },
      transaction: t,
    });

    // Soft delete no empréstimo (sinaliza que foi encerrado)
    await Emprestimo.destroy({ where: { id: idEmprestimo }, transaction: t });

    await t.commit();

    return res.status(200).json({
      message: "Devolução confirmada",
      multaAplicada,
      aviso: multaAplicada > 0
        ? `Multa de R$ ${multaAplicada.toFixed(2)} gerada por atraso`
        : null,
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
