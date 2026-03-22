// controllers/AutorController.js
const Autor = require("../models/Autores");

const controller = {}
  controller.createAutor = async (req, res)=> {
    try {
      const autor = await Autor.create(req.body);
      return res.json(autor);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  controller.findAll = async (req, res) => {
    try {
      const autores = await Autor.findAll();
      return res.json(autores);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  controller.updateAutor = async (req, res) => {
    try {
      await Autor.update(req.body, {
        where: { id: req.params.id },
      });
      return res.json({ message: "Atualizado" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  controller.deleteAutor = async (req, res) => {
    try {
      await Autor.destroy({
        where: { id: req.params.id },
      });
      return res.json({ message: "Deletado" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

module.exports = controller;