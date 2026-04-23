const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Funcionario = require("./Funcionarios");

const Vistoria = sequelize.define(
  "Vistoria",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    VistoriadoPor: DataTypes.INTEGER,
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "LVistoriasEmprestimos",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Vistoria.belongsTo(Funcionario, {
  foreignKey: "VistoriadoPor",
  targetKey: "idFuncionario",
  as: "funcionario",
});

module.exports = Vistoria;
