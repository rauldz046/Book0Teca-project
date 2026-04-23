const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Autor = require("./Autores");

const Livro = sequelize.define(
  "Livro",
  {
    idLivro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Titulo: DataTypes.STRING(50),
    ISBN: DataTypes.STRING(100),
    Autor: DataTypes.INTEGER,
    LivroFisico: DataTypes.TINYINT,
    LivroDigital: DataTypes.TINYINT,
    QtdLivros: DataTypes.INTEGER,
    PrecoCompra: DataTypes.FLOAT,
    PrecoVenda: DataTypes.FLOAT,
    PathDownload: DataTypes.STRING(1000),
    PalavrasChave: DataTypes.JSON,
    Descricao: DataTypes.STRING(1000),
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "LivrosCatalogo",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Livro.belongsTo(Autor, {
  foreignKey: "Autor",
  targetKey: "id",
  as: "autorInfo",
});

module.exports = Livro;
