// controllers/LivroController.js
const Livro = require("../models/Livros");


const controller = {}

  controller.createLivro = async (req, res) => {
    const livro = req.body;
    return res.json(livro);
  },

  controller.findAllLivros = async function(req, res) {
    const livros = await Livro.findAll({
      include: [{ model: Autor }],
    });
    return res.json(livros);
  };

module.exports = controller



