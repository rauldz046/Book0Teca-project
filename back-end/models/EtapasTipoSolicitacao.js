const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EtapasTipoSolicitacao = sequelize.define(
  "EtapasTipoSolicitacao",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Descricao: DataTypes.STRING(150),
    Ordem: DataTypes.INTEGER,
    Final: DataTypes.INTEGER, // 0 = em andamento, 1 = etapa final
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "EtapasTipoSolicitacao",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = EtapasTipoSolicitacao;
