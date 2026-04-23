const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Funcionario = require("./Funcionarios");
const Livro = require("./Livros");
const Usuario = require("./Usuarios");
const Vistoria = require("./LVistoriasEmprestimos");

const Emprestimo = sequelize.define(
  "Emprestimo",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    AutorizadoPor: DataTypes.INTEGER,
    idLivro: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    IdVistoria: DataTypes.INTEGER,
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "LivrosEmprestimos",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Emprestimo.belongsTo(Funcionario, {
  foreignKey: "AutorizadoPor",
  targetKey: "idFuncionario",
  as: "autorizador",
});

Emprestimo.belongsTo(Livro, {
  foreignKey: "idLivro",
  targetKey: "idLivro",
  as: "livro",
});

Emprestimo.belongsTo(Usuario, {
  foreignKey: "idUser",
  targetKey: "idUsuario",
  as: "usuario",
});

Emprestimo.belongsTo(Vistoria, {
  foreignKey: "IdVistoria",
  targetKey: "id",
  as: "vistoria",
});

module.exports = Emprestimo;
