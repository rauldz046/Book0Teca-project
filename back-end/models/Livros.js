// // models/Livro.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
// const Autores = require("./Autores");

// const Livro = sequelize.define(
//   "Livro",
//   {
//     idLivro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     Titulo: DataTypes.STRING,
//     ISBN: DataTypes.STRING,
//     Autor: DataTypes.INTEGER,
//     PrecoVenda: DataTypes.FLOAT,
//   },
//   {
//     tableName: "LivrosCatalogo",
//     timestamps: false,
//   },
// );

// // relacionamento
// Livro.belongsTo(Autores, { foreignKey: "Autor" });

// module.exports = Livro;
