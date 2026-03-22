// models/Usuario.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    Nome: {
      type: DataTypes.STRING(150),
    },

    CPF: {
      type: DataTypes.STRING(45),
    },

    Telefone: {
      type: DataTypes.STRING(45),
    },

    Senha: {
      type: DataTypes.STRING(300),
    },

    Email: {
      type: DataTypes.STRING(200),
    },

    SenhaInicial: {
      type: DataTypes.TINYINT,
    },

    Status: {
      type: DataTypes.INTEGER,
    },

    InfoEndereco: {
      type: DataTypes.INTEGER,
    },

    InfoBancario: {
      type: DataTypes.INTEGER,
    },

    created_at: {
      type: DataTypes.DATEONLY,
    },

    updated_at: {
      type: DataTypes.DATEONLY,
    },

    deleted_at: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "UsuariosSistema",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = Usuario;
