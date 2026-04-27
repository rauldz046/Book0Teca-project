const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Livro = require("./Livros");
const Usuario = require("./Usuarios");
const Funcionario = require("./Funcionarios");
const CompraStatus = require("./CompraStatus");

const Venda = sequelize.define(
  "Venda",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Livro: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER,
    FuncionarioResponsavel: DataTypes.INTEGER,
    CompraStatus: DataTypes.INTEGER,
    ValorCompra: DataTypes.FLOAT,
    ValorPago: DataTypes.FLOAT,
    // TC-COMP-06: quantidade comprada (default 1, validado no controller)
    Quantidade: { type: DataTypes.INTEGER, defaultValue: 1 },
    // TC-COMP-04: snapshot do endereço de entrega no momento da compra,
    // armazenado como JSON serializado para preservar histórico mesmo se o
    // endereço do usuário mudar depois.
    enderecoEntrega: { type: DataTypes.TEXT, allowNull: true },
    // TC-COMP-04: forma de pagamento escolhida (PIX, BOLETO, CARTÃO, etc.)
    formaPagamento: { type: DataTypes.STRING(32), allowNull: true },
    DataCompra: DataTypes.DATEONLY,
    created_at: DataTypes.DATEONLY,
    updated_at: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATEONLY,
  },
  {
    tableName: "LVendasNotasFiscais",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Venda.belongsTo(Livro, {
  foreignKey: "Livro",
  targetKey: "idLivro",
  as: "livro",
});

Venda.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
  as: "usuario",
});

Venda.belongsTo(Funcionario, {
  foreignKey: "FuncionarioResponsavel",
  targetKey: "idFuncionario",
  as: "funcionario",
});

Venda.belongsTo(CompraStatus, {
  foreignKey: "CompraStatus",
  targetKey: "id",
  as: "status",
});

module.exports = Venda;
