// controllers/AutorController.js
const Autor = require("../models/Autores");

const controller = {}
  controller.createLivro = async (req, res)=> {
    try {
      const autor = await Autor.create(req.body);
      return res.json(autor);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  controller.findAllasync = async (req, res) => {
    try {
      const autores = await Autor.findAll();
      return res.json(autores);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

module.exports = controller;