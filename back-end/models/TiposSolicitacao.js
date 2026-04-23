const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TiposSolicitacao = sequelize.define(
  "TiposSolicitacao",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Descricao: DataTypes.STRING(1000),
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "TiposSolicitacao",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = TiposSolicitacao;
