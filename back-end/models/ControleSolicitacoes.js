const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const FormularioSolicitacao = require("./FormularioSolicitacao");
const TiposSolicitacao = require("./TiposSolicitacao");
const EtapasTipoSolicitacao = require("./EtapasTipoSolicitacao");

const ControleSolicitacoes = sequelize.define(
  "ControleSolicitacoes",
  {
    Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Descricao: DataTypes.STRING(150),
    CriadaPor: DataTypes.INTEGER,   // FK para UsuariosSistema ou FuncionariosSistema — sem FK direta no model pra evitar circular
    FormularioId: DataTypes.INTEGER,
    TiposSolicitacao: DataTypes.INTEGER,
    Etapas: DataTypes.INTEGER,
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "ControleSolicitacoes",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

ControleSolicitacoes.belongsTo(FormularioSolicitacao, {
  foreignKey: "FormularioId",
  targetKey: "id",
  as: "formulario",
});

ControleSolicitacoes.belongsTo(TiposSolicitacao, {
  foreignKey: "TiposSolicitacao",
  targetKey: "id",
  as: "tipo",
});

ControleSolicitacoes.belongsTo(EtapasTipoSolicitacao, {
  foreignKey: "Etapas",
  targetKey: "id",
  as: "etapa",
});

module.exports = ControleSolicitacoes;
