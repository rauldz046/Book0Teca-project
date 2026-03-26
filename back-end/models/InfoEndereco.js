const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InfoEndereco = sequelize.define(
  "InfoEndereco",
  {
    idInfoEnd: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Logradouro: DataTypes.STRING(150),
    Bairro: DataTypes.STRING(100),
    Numero: DataTypes.INTEGER,
    Cidade: DataTypes.STRING(45),
    Estado: DataTypes.STRING(45),
    Nacionalidade: DataTypes.STRING(100),
    CEP: DataTypes.STRING(20),
    Complemento: DataTypes.STRING(300),

    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "infoendereco",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = InfoEndereco;