const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InfoBancario = sequelize.define(
  "InfoBancario",
  {
    IdInfoBancario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    NomeBanco: DataTypes.STRING(150),
    CodigoBanco: DataTypes.INTEGER,
    TipoConta: DataTypes.STRING(150),
    NumeroAgencia: DataTypes.INTEGER,
    DigitoAgencia: DataTypes.INTEGER,
    NumeroConta: DataTypes.INTEGER,
    DigitoConta: DataTypes.INTEGER,
    CodigosPix: DataTypes.STRING(500),

    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "infoBancario",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = InfoBancario;