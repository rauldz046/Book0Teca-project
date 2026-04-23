const Autor = require("../models/Autores");

const controller = {};

/* GET ALL */
controller.findAll = async (req, res) => {
  try {
    const autores = await Autor.findAll();
    return res.status(200).json(autores);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
controller.findById = async (req, res) => {
  try {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) return res.status(404).json({ message: "Autor não encontrado" });
    return res.status(200).json(autor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* CREATE */
controller.createAutor = async (req, res) => {
  try {
    const autor = await Autor.create({
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(201).json(autor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* UPDATE — BUG CORRIGIDO: usava req.params.id mas rota não tinha :id */
controller.updateAutor = async (req, res) => {
  const { id, ...dados } = req.body;
  try {
    const [updated] = await Autor.update(
      { ...dados, updated_at: new Date() },
      { where: { id } }
    );
    if (!updated) return res.status(404).json({ message: "Autor não encontrado" });
    return res.status(200).json({ message: "Atualizado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* DELETE — BUG CORRIGIDO: mesmo problema do update */
controller.deleteAutor = async (req, res) => {
  const { id } = req.body;
  try {
    const deleted = await Autor.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Autor não encontrado" });
    return res.status(200).json({ message: "Deletado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
