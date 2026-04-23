const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FormularioSolicitacao = sequelize.define(
  "FormularioSolicitacao",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    FormularioJSON: DataTypes.JSON,
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "FormularioSolicitacao",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = FormularioSolicitacao;
