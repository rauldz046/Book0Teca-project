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
    Nome: DataTypes.STRING,
    Email: DataTypes.STRING,
    CPF: DataTypes.STRING,
    Senha: DataTypes.STRING,
  },
  {
    tableName: "UsuariosSistema",
    timestamps: false,
  },
);

module.exports = Usuario;
