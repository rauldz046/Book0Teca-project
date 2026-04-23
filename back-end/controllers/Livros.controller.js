const Livro = require("../models/Livros");
const Autor = require("../models/Autores");

const controller = {};

/* GET ALL */
controller.findAll = async (req, res) => {
  try {
    const livros = await Livro.findAll({
      include: [{ model: Autor, as: "autorInfo", attributes: ["NomeAutor"] }],
    });
    return res.status(200).json(livros);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.findById = async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id, {
      include: [{ model: Autor, as: "autorInfo", attributes: ["NomeAutor", "SobreAutor"] }],
    });
    if (!livro) return res.status(404).json({ message: "Livro não encontrado" });
    return res.status(200).json(livro);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* BUSCA POR FILTROS (título, autor, tipo) — atende RF06 */
controller.buscar = async (req, res) => {
  const { titulo, autorId, tipo } = req.query;
  const where = {};

  if (titulo) {
    const { Op } = require("sequelize");
    where.Titulo = { [Op.like]: `%${titulo}%` };
  }
  if (autorId) where.Autor = autorId;
  if (tipo === "fisico") where.LivroFisico = 1;
  if (tipo === "digital") where.LivroDigital = 1;

  try {
    const livros = await Livro.findAll({
      where,
      include: [{ model: Autor, as: "autorInfo", attributes: ["NomeAutor"] }],
    });
    return res.status(200).json(livros);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CREATE */
controller.createLivro = async (req, res) => {
  try {
    const livro = await Livro.create({
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(201).json(livro);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
controller.updateLivro = async (req, res) => {
  const { idLivro, ...dados } = req.body;
  try {
    const [updated] = await Livro.update(
      { ...dados, updated_at: new Date() },
      { where: { idLivro } }
    );
    if (!updated) return res.status(404).json({ message: "Livro não encontrado" });
    return res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ENTRADA DE ESTOQUE — atende RF21 */
controller.entradaEstoque = async (req, res) => {
  const { idLivro, quantidade } = req.body;
  try {
    const livro = await Livro.findByPk(idLivro);
    if (!livro) return res.status(404).json({ message: "Livro não encontrado" });

    const novaQtd = (livro.QtdLivros || 0) + quantidade;
    await Livro.update(
      { QtdLivros: novaQtd, updated_at: new Date() },
      { where: { idLivro } }
    );
    return res.status(200).json({ message: "Estoque atualizado", QtdLivros: novaQtd });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* SOFT DELETE */
controller.deleteLivro = async (req, res) => {
  const { idLivro } = req.body;
  try {
    await Livro.destroy({ where: { idLivro } });
    return res.status(200).json({ message: "Livro removido do catálogo" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
