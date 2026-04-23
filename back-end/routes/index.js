const express = require("express");
const router = express.Router();

const UsuariosRoutes      = require("./usuarios.routes");
const FuncionariosRoutes  = require("./funcionarios.routes");
const LivrosRoutes        = require("./livros.routes");
const AutoresRoutes       = require("./autores.routes");
const EmprestimosRoutes   = require("./emprestimos.routes");
const VendasRoutes        = require("./vendas.routes");
const SolicitacoesRoutes  = require("./solicitacoes.routes");

router.get("/", (req, res) => {
  res.json({
    status: "API BookOTeca funcionando 🚀",
    versao: "1.0.0",
    rotas: [
      "GET  /usuarios/findAll",
      "GET  /usuarios/:id",
      "POST /usuarios/login",
      "POST /usuarios/createUser",
      "POST /usuarios/updateUser",
      "POST /usuarios/updateStatus",
      "POST /usuarios/updatePassword",
      "POST /usuarios/deleteUser",
      "---",
      "GET  /funcionarios/findAll",
      "GET  /funcionarios/:id",
      "POST /funcionarios/login",
      "POST /funcionarios/create",
      "POST /funcionarios/update",
      "POST /funcionarios/updateStatus",
      "POST /funcionarios/updatePassword",
      "POST /funcionarios/delete",
      "---",
      "GET  /livros/findAll",
      "GET  /livros/buscar?titulo=&autorId=&tipo=fisico|digital",
      "GET  /livros/:id",
      "POST /livros/create",
      "POST /livros/update",
      "POST /livros/estoque",
      "POST /livros/delete",
      "---",
      "GET  /autores/findAll",
      "GET  /autores/:id",
      "POST /autores/createAutor",
      "POST /autores/updateAutor",
      "POST /autores/deleteAutor",
      "---",
      "GET  /emprestimos/findAll",
      "GET  /emprestimos/:id",
      "POST /emprestimos/registrar",
      "POST /emprestimos/devolver",
      "---",
      "GET  /vendas/findAll",
      "GET  /vendas/relatorio?dataInicio=&dataFim=",
      "GET  /vendas/:id",
      "POST /vendas/registrar",
      "POST /vendas/confirmarPagamento",
      "POST /vendas/cancelar",
      "---",
      "GET  /solicitacoes/findAll",
      "GET  /solicitacoes/tipos",
      "GET  /solicitacoes/etapas",
      "GET  /solicitacoes/:id",
      "POST /solicitacoes/criar",
      "POST /solicitacoes/avancar",
      "POST /solicitacoes/cancelar",
    ],
  });
});

router.use("/usuarios",     UsuariosRoutes);
router.use("/funcionarios", FuncionariosRoutes);
router.use("/livros",       LivrosRoutes);
router.use("/autores",      AutoresRoutes);
router.use("/emprestimos",  EmprestimosRoutes);
router.use("/vendas",       VendasRoutes);
router.use("/solicitacoes", SolicitacoesRoutes);

module.exports = router;
