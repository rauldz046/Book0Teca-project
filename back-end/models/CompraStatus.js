const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CompraStatus = sequelize.define(
  "CompraStatus",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Descricao: DataTypes.STRING(800),
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "CompraStatus",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = CompraStatus;
