// models/Status.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define(
  "Status",
  {
    idStatus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Descricao: {
      type: DataTypes.STRING(150),
    }
  },
  {
    tableName: "StatusAtividadeGeral", // nome da sua tabela
    timestamps: false,
  }
);

module.exports = Status;