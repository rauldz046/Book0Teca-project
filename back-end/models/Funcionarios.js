const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = require("./StatusAtividadeGeral");
const InfoEndereco = require("./InfoEndereco");
const InfoBancario = require("./InfoBancario");
const PerfilFuncionarios = require("./PerfilFuncionarios"); // se existir

const Funcionario = sequelize.define(
  "Funcionario",
  {
    idFuncionario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    MatriculaFunc: DataTypes.STRING(250),
    NomeFunc: DataTypes.STRING(250),
    CPFFunc: DataTypes.STRING(45),
    EmailFunc: DataTypes.STRING(250),
    RegiaoFunc: DataTypes.STRING(2),
    SenhaFunc: DataTypes.STRING(300),
    SenhaInicialFunc: DataTypes.TINYINT,
    CadastradoPor: DataTypes.INTEGER,
    idPerfilFuncionarios: DataTypes.INTEGER,
    StatusAtividadeGeral_idStatus: DataTypes.INTEGER,
    InfoBancario_IdInfoBancario: DataTypes.INTEGER,
    InfoEndereco_idInfoEnd: DataTypes.INTEGER,

    created_date: DataTypes.DATEONLY,
    update_date: DataTypes.DATEONLY,
    deleted_date: DataTypes.DATEONLY,
  },
  {
    tableName: "funcionariossistema", // ajuste se o nome real for outro
    timestamps: true,
    paranoid: true,
    createdAt: "created_date",
    updatedAt: "update_date",
    deletedAt: "deleted_date",
  }
);

/* RELAÇÕES */

Funcionario.belongsTo(Status, {
  foreignKey: "StatusAtividadeGeral_idStatus",
  targetKey: "idStatus",
  as: "statusInfo",
});

Funcionario.belongsTo(InfoEndereco, {
  foreignKey: "InfoEndereco_idInfoEnd",
  targetKey: "idInfoEnd",
  as: "endereco",
});

Funcionario.belongsTo(InfoBancario, {
  foreignKey: "InfoBancario_IdInfoBancario",
  targetKey: "IdInfoBancario",
  as: "banco",
});

Funcionario.belongsTo(PerfilFuncionarios, {
  foreignKey: "idPerfilFuncionarios",
  targetKey: "idPerfil",
  as: "perfil"
});

module.exports = Funcionario;