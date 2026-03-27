const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PerfilFuncionarios = sequelize.define(
  "PerfilFuncionarios",
  {
    idPerfil: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    Descricao: DataTypes.STRING(150),

    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "perfilfuncionarios",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = PerfilFuncionarios;