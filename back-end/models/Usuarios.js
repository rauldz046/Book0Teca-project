const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = require("./StatusAtividadeGeral");
const InfoEndereco = require("./InfoEndereco");
const InfoBancario = require("./InfoBancario");

const Usuario = sequelize.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: DataTypes.STRING(150),
    CPF: DataTypes.STRING(45),
    Telefone: DataTypes.STRING(45),
    Senha: DataTypes.STRING(300),
    Email: DataTypes.STRING(200),
    SenhaInicial: DataTypes.TINYINT,
    Status: DataTypes.INTEGER,
    InfoEndereco: DataTypes.INTEGER,
    InfoBancario: DataTypes.INTEGER,
    fotoperfil: DataTypes.STRING(20),

    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "usuariossistema",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

/* RELAÇÕES */

Usuario.belongsTo(Status, {
  foreignKey: "Status",
  targetKey: "idStatus",
  as: "statusInfo"
});

Usuario.belongsTo(InfoEndereco, {
  foreignKey: "InfoEndereco",
  targetKey: "idInfoEnd",
  as: "endereco"
});

Usuario.belongsTo(InfoBancario, {
  foreignKey: "InfoBancario",
  targetKey: "IdInfoBancario",
  as: "banco"
});

module.exports = Usuario;