const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4001;
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors({ origin: true }));
app.use(express.json());

// ─── DB helpers ───────────────────────────────────────────────────────────────

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function nextId(collection, field = "id") {
  if (!collection.length) return 1;
  return Math.max(...collection.map((r) => r[field] || 0)) + 1;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── STATUS ───────────────────────────────────────────────────────────────────

app.get("/", (_, res) =>
  res.json({
    status: "Mock server rodando",
    rotas: ["/usuarios", "/funcionarios", "/livros", "/autores", "/emprestimos", "/vendas", "/solicitacoes", "/enderecos", "/bancos"],
  })
);

// ─── HELPERS p/ ENDEREÇO + BANCÁRIO ──────────────────────────────────────────
function isEnderecoPreenchido(p) {
  if (!p || typeof p !== "object") return false;
  return Object.values(p).some((v) => v !== null && v !== undefined && v !== "");
}
function isBancoPreenchido(p) {
  if (!p || typeof p !== "object") return false;
  return Object.values(p).some((v) => v !== null && v !== undefined && v !== "");
}
function criarEndereco(db, payload) {
  const novo = {
    idInfoEnd: nextId(db.infoEndereco, "idInfoEnd"),
    Logradouro: payload.Logradouro || "",
    Bairro: payload.Bairro || "",
    Numero: payload.Numero ?? null,
    Cidade: payload.Cidade || "",
    Estado: payload.Estado || "",
    Nacionalidade: payload.Nacionalidade || "Brasileira",
    CEP: payload.CEP || "",
    Complemento: payload.Complemento || "",
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.infoEndereco.push(novo);
  return novo;
}
function criarBanco(db, payload) {
  const novo = {
    IdInfoBancario: nextId(db.infoBancario, "IdInfoBancario"),
    NomeBanco: payload.NomeBanco || "",
    CodigoBanco: payload.CodigoBanco ?? null,
    TipoConta: payload.TipoConta || "Corrente",
    NumeroAgencia: payload.NumeroAgencia ?? null,
    DigitoAgencia: payload.DigitoAgencia ?? null,
    NumeroConta: payload.NumeroConta ?? null,
    DigitoConta: payload.DigitoConta ?? null,
    CodigosPix: payload.CodigosPix || "",
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.infoBancario.push(novo);
  return novo;
}
function atualizarEndereco(db, id, payload) {
  const idx = db.infoEndereco.findIndex((e) => e.idInfoEnd == id);
  if (idx === -1) return null;
  db.infoEndereco[idx] = { ...db.infoEndereco[idx], ...payload, updated_at: today() };
  return db.infoEndereco[idx];
}
function atualizarBanco(db, id, payload) {
  const idx = db.infoBancario.findIndex((b) => b.IdInfoBancario == id);
  if (idx === -1) return null;
  db.infoBancario[idx] = { ...db.infoBancario[idx], ...payload, updated_at: today() };
  return db.infoBancario[idx];
}

// ─── ENDEREÇOS ────────────────────────────────────────────────────────────────
app.get("/enderecos/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.infoEndereco.filter((e) => !e.deleted_at));
});
app.get("/enderecos/:id", (req, res) => {
  const db = loadDB();
  const e = db.infoEndereco.find((x) => x.idInfoEnd == req.params.id && !x.deleted_at);
  if (!e) return res.status(404).json({ message: "Endereço não encontrado" });
  res.json(e);
});
app.post("/enderecos/create", (req, res) => {
  const db = loadDB();
  const novo = criarEndereco(db, req.body || {});
  saveDB(db);
  res.status(201).json(novo);
});
app.post("/enderecos/update", (req, res) => {
  const { idInfoEnd, ...dados } = req.body;
  const db = loadDB();
  const upd = atualizarEndereco(db, idInfoEnd, dados);
  if (!upd) return res.status(404).json({ message: "Endereço não encontrado" });
  saveDB(db);
  res.json(upd);
});

// ─── BANCO ────────────────────────────────────────────────────────────────────
app.get("/bancos/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.infoBancario.filter((b) => !b.deleted_at));
});
app.get("/bancos/:id", (req, res) => {
  const db = loadDB();
  const b = db.infoBancario.find((x) => x.IdInfoBancario == req.params.id && !x.deleted_at);
  if (!b) return res.status(404).json({ message: "Banco não encontrado" });
  res.json(b);
});
app.post("/bancos/create", (req, res) => {
  const db = loadDB();
  const novo = criarBanco(db, req.body || {});
  saveDB(db);
  res.status(201).json(novo);
});
app.post("/bancos/update", (req, res) => {
  const { IdInfoBancario, ...dados } = req.body;
  const db = loadDB();
  const upd = atualizarBanco(db, IdInfoBancario, dados);
  if (!upd) return res.status(404).json({ message: "Banco não encontrado" });
  saveDB(db);
  res.json(upd);
});

// ─── USUARIOS ─────────────────────────────────────────────────────────────────

app.get("/usuarios/findAll", (_, res) => {
  const db = loadDB();
  const result = db.usuarios
    .filter((u) => !u.deleted_at)
    .map(({ Senha, ...u }) => ({
      ...u,
      statusInfo: db.statusAtividadeGeral.find((s) => s.idStatus === u.Status) || null,
      endereco: db.infoEndereco.find((e) => e.idInfoEnd === u.InfoEndereco) || null,
      banco: db.infoBancario.find((b) => b.IdInfoBancario === u.InfoBancario) || null,
    }));
  res.json(result);
});

app.get("/usuarios/:id", (req, res) => {
  const db = loadDB();
  const u = db.usuarios.find((u) => u.idUsuario == req.params.id && !u.deleted_at);
  if (!u) return res.status(404).json({ message: "Usuário não encontrado" });
  const { Senha, ...rest } = u;
  res.json({
    ...rest,
    statusInfo: db.statusAtividadeGeral.find((s) => s.idStatus === u.Status) || null,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === u.InfoEndereco) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === u.InfoBancario) || null,
  });
});

app.post("/usuarios/login", async (req, res) => {
  const { email, senha } = req.body;
  const db = loadDB();
  const u = db.usuarios.find((u) => u.Email === email && !u.deleted_at);
  if (!u) return res.status(401).json({ message: "Usuário não encontrado" });
  const ok = await bcrypt.compare(senha, u.Senha);
  if (!ok) return res.status(401).json({ message: "Senha incorreta" });
  const { Senha, ...rest } = u;
  const infoSessao = {
    ...rest,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === u.InfoEndereco) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === u.InfoBancario) || null,
  };
  res.json({ message: "sucesso", infoSessao });
});

app.post("/usuarios/createUser", async (req, res) => {
  const db = loadDB();

  // Aceita formato { payloadUser, payloadEndereco, payloadBanco } ou flat
  const body = req.body || {};
  const payloadUser = body.payloadUser || body;
  const payloadEndereco = body.payloadEndereco;
  const payloadBanco = body.payloadBanco;

  let idEndereco = payloadUser.InfoEndereco ?? null;
  if (isEnderecoPreenchido(payloadEndereco)) {
    const e = criarEndereco(db, payloadEndereco);
    idEndereco = e.idInfoEnd;
  }

  let idBanco = payloadUser.InfoBancario ?? null;
  if (isBancoPreenchido(payloadBanco)) {
    const b = criarBanco(db, payloadBanco);
    idBanco = b.IdInfoBancario;
  }

  const senhaHash = payloadUser.Senha ? await bcrypt.hash(payloadUser.Senha, 10) : null;

  const { Senha: _s, InfoEndereco: _ie, InfoBancario: _ib, ...rest } = payloadUser;
  const newUser = {
    idUsuario: nextId(db.usuarios, "idUsuario"),
    ...rest,
    Senha: senhaHash,
    SenhaInicial: payloadUser.SenhaInicial ?? 1,
    Status: payloadUser.Status ?? 1,
    fotoperfil: payloadUser.fotoperfil ?? null,
    InfoEndereco: idEndereco,
    InfoBancario: idBanco,
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.usuarios.push(newUser);
  saveDB(db);
  const { Senha, ...result } = newUser;
  res.status(201).json({
    ...result,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === idEndereco) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === idBanco) || null,
  });
});

app.post("/usuarios/updateUser", (req, res) => {
  const body = req.body || {};
  const dados = body.payloadUser || body;
  const idUsuario = dados.idUsuario;
  const db = loadDB();
  const idx = db.usuarios.findIndex((u) => u.idUsuario == idUsuario);
  if (idx === -1) return res.status(404).json({ message: "Usuário não encontrado" });

  // endereço aninhado
  if (body.payloadEndereco && isEnderecoPreenchido(body.payloadEndereco)) {
    if (db.usuarios[idx].InfoEndereco) {
      atualizarEndereco(db, db.usuarios[idx].InfoEndereco, body.payloadEndereco);
    } else {
      const novo = criarEndereco(db, body.payloadEndereco);
      db.usuarios[idx].InfoEndereco = novo.idInfoEnd;
    }
  }

  // bancário aninhado
  if (body.payloadBanco && isBancoPreenchido(body.payloadBanco)) {
    if (db.usuarios[idx].InfoBancario) {
      atualizarBanco(db, db.usuarios[idx].InfoBancario, body.payloadBanco);
    } else {
      const novo = criarBanco(db, body.payloadBanco);
      db.usuarios[idx].InfoBancario = novo.IdInfoBancario;
    }
  }

  const { idUsuario: _x, payloadEndereco: _pe, payloadBanco: _pb, payloadUser: _pu, ...patch } = body;
  const merge = body.payloadUser ? { ...dados } : patch;
  delete merge.idUsuario;

  db.usuarios[idx] = { ...db.usuarios[idx], ...merge, updated_at: today() };
  saveDB(db);
  res.json({ message: "Atualizado", usuario: { ...db.usuarios[idx], Senha: undefined } });
});

app.post("/usuarios/updateStatus", (req, res) => {
  const { idUsuario, idStatus } = req.body;
  const db = loadDB();
  const idx = db.usuarios.findIndex((u) => u.idUsuario == idUsuario);
  if (idx === -1) return res.status(404).json({ message: "Usuário não encontrado" });
  db.usuarios[idx].Status = idStatus;
  db.usuarios[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Status atualizado" });
});

app.post("/usuarios/updatePassword", async (req, res) => {
  const { idUsuario, Senha } = req.body;
  const db = loadDB();
  const idx = db.usuarios.findIndex((u) => u.idUsuario == idUsuario);
  if (idx === -1) return res.status(404).json({ message: "Usuário não encontrado" });
  db.usuarios[idx].Senha = await bcrypt.hash(Senha, 10);
  db.usuarios[idx].SenhaInicial = 0;
  db.usuarios[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Senha atualizada" });
});

app.post("/usuarios/deleteUser", (req, res) => {
  const { idUsuario } = req.body;
  const db = loadDB();
  const idx = db.usuarios.findIndex((u) => u.idUsuario == idUsuario);
  if (idx === -1) return res.status(404).json({ message: "Usuário não encontrado" });
  db.usuarios[idx].deleted_at = today();
  saveDB(db);
  res.json({ message: "Usuário removido" });
});

// ─── FUNCIONARIOS ─────────────────────────────────────────────────────────────

app.get("/funcionarios/findAll", (_, res) => {
  const db = loadDB();
  const result = db.funcionarios
    .filter((f) => !f.deleted_date)
    .map(({ SenhaFunc, ...f }) => ({
      ...f,
      statusInfo: db.statusAtividadeGeral.find((s) => s.idStatus === f.StatusAtividadeGeral_idStatus) || null,
      perfil: db.perfilFuncionarios.find((p) => p.idPerfil === f.idPerfilFuncionarios) || null,
      endereco: db.infoEndereco.find((e) => e.idInfoEnd === f.InfoEndereco_idInfoEnd) || null,
      banco: db.infoBancario.find((b) => b.IdInfoBancario === f.InfoBancario_IdInfoBancario) || null,
    }));
  res.json(result);
});

app.get("/funcionarios/:id", (req, res) => {
  const db = loadDB();
  const f = db.funcionarios.find((f) => f.idFuncionario == req.params.id && !f.deleted_date);
  if (!f) return res.status(404).json({ message: "Funcionário não encontrado" });
  const { SenhaFunc, ...rest } = f;
  res.json({
    ...rest,
    statusInfo: db.statusAtividadeGeral.find((s) => s.idStatus === f.StatusAtividadeGeral_idStatus) || null,
    perfil: db.perfilFuncionarios.find((p) => p.idPerfil === f.idPerfilFuncionarios) || null,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === f.InfoEndereco_idInfoEnd) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === f.InfoBancario_IdInfoBancario) || null,
  });
});

app.post("/funcionarios/login", async (req, res) => {
  const { email, senha } = req.body;
  const db = loadDB();
  const f = db.funcionarios.find((f) => f.EmailFunc === email && !f.deleted_date);
  if (!f) return res.status(401).json({ message: "Funcionário não encontrado" });
  const ok = await bcrypt.compare(senha, f.SenhaFunc);
  if (!ok) return res.status(401).json({ message: "Senha incorreta" });
  const { SenhaFunc, ...rest } = f;
  const infoSessao = {
    ...rest,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === f.InfoEndereco_idInfoEnd) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === f.InfoBancario_IdInfoBancario) || null,
  };
  res.json({ message: "sucesso", infoSessao });
});

app.post("/funcionarios/create", async (req, res) => {
  const db = loadDB();
  const body = req.body || {};
  const payloadFunc = body.payloadFuncionario || body;
  const payloadEndereco = body.payloadEndereco;
  const payloadBanco = body.payloadBanco;

  let idEndereco = payloadFunc.InfoEndereco_idInfoEnd ?? null;
  if (isEnderecoPreenchido(payloadEndereco)) {
    const e = criarEndereco(db, payloadEndereco);
    idEndereco = e.idInfoEnd;
  }

  let idBanco = payloadFunc.InfoBancario_IdInfoBancario ?? null;
  if (isBancoPreenchido(payloadBanco)) {
    const b = criarBanco(db, payloadBanco);
    idBanco = b.IdInfoBancario;
  }

  const senhaHash = payloadFunc.SenhaFunc ? await bcrypt.hash(payloadFunc.SenhaFunc, 10) : null;

  // mapeamento Status/idPerfil — front pode usar 'Status' como alias
  const statusId =
    payloadFunc.StatusAtividadeGeral_idStatus ||
    payloadFunc.Status ||
    1;

  const {
    SenhaFunc: _s,
    Status: _st,
    StatusAtividadeGeral_idStatus: _st2,
    InfoEndereco_idInfoEnd: _ie,
    InfoBancario_IdInfoBancario: _ib,
    ...rest
  } = payloadFunc;

  const newFunc = {
    idFuncionario: nextId(db.funcionarios, "idFuncionario"),
    ...rest,
    SenhaFunc: senhaHash,
    SenhaInicialFunc: payloadFunc.SenhaInicialFunc ?? 1,
    StatusAtividadeGeral_idStatus: statusId,
    InfoEndereco_idInfoEnd: idEndereco,
    InfoBancario_IdInfoBancario: idBanco,
    created_date: today(),
    update_date: today(),
    deleted_date: null,
  };
  db.funcionarios.push(newFunc);
  saveDB(db);
  const { SenhaFunc, ...result } = newFunc;
  res.status(201).json({
    ...result,
    endereco: db.infoEndereco.find((e) => e.idInfoEnd === idEndereco) || null,
    banco: db.infoBancario.find((b) => b.IdInfoBancario === idBanco) || null,
  });
});

app.post("/funcionarios/update", (req, res) => {
  const body = req.body || {};
  const dados = body.payloadFuncionario || body;
  const idFuncionario = dados.idFuncionario;
  const db = loadDB();
  const idx = db.funcionarios.findIndex((f) => f.idFuncionario == idFuncionario);
  if (idx === -1) return res.status(404).json({ message: "Funcionário não encontrado" });

  if (body.payloadEndereco && isEnderecoPreenchido(body.payloadEndereco)) {
    if (db.funcionarios[idx].InfoEndereco_idInfoEnd) {
      atualizarEndereco(db, db.funcionarios[idx].InfoEndereco_idInfoEnd, body.payloadEndereco);
    } else {
      const novo = criarEndereco(db, body.payloadEndereco);
      db.funcionarios[idx].InfoEndereco_idInfoEnd = novo.idInfoEnd;
    }
  }
  if (body.payloadBanco && isBancoPreenchido(body.payloadBanco)) {
    if (db.funcionarios[idx].InfoBancario_IdInfoBancario) {
      atualizarBanco(db, db.funcionarios[idx].InfoBancario_IdInfoBancario, body.payloadBanco);
    } else {
      const novo = criarBanco(db, body.payloadBanco);
      db.funcionarios[idx].InfoBancario_IdInfoBancario = novo.IdInfoBancario;
    }
  }

  const merge = body.payloadFuncionario ? { ...dados } : { ...body };
  delete merge.idFuncionario;
  delete merge.payloadEndereco;
  delete merge.payloadBanco;
  delete merge.payloadFuncionario;
  // alias Status -> StatusAtividadeGeral_idStatus
  if (merge.Status != null && merge.StatusAtividadeGeral_idStatus == null) {
    merge.StatusAtividadeGeral_idStatus = merge.Status;
  }
  delete merge.Status;

  db.funcionarios[idx] = { ...db.funcionarios[idx], ...merge, update_date: today() };
  saveDB(db);
  res.json({ message: "Atualizado", funcionario: { ...db.funcionarios[idx], SenhaFunc: undefined } });
});

app.post("/funcionarios/updateStatus", (req, res) => {
  const { idFuncionario, idStatus } = req.body;
  const db = loadDB();
  const idx = db.funcionarios.findIndex((f) => f.idFuncionario == idFuncionario);
  if (idx === -1) return res.status(404).json({ message: "Funcionário não encontrado" });
  db.funcionarios[idx].StatusAtividadeGeral_idStatus = idStatus;
  db.funcionarios[idx].update_date = today();
  saveDB(db);
  res.json({ message: "Status atualizado" });
});

app.post("/funcionarios/updatePassword", async (req, res) => {
  const { idFuncionario, SenhaFunc } = req.body;
  const db = loadDB();
  const idx = db.funcionarios.findIndex((f) => f.idFuncionario == idFuncionario);
  if (idx === -1) return res.status(404).json({ message: "Funcionário não encontrado" });
  db.funcionarios[idx].SenhaFunc = await bcrypt.hash(SenhaFunc, 10);
  db.funcionarios[idx].SenhaInicialFunc = 0;
  db.funcionarios[idx].update_date = today();
  saveDB(db);
  res.json({ message: "Senha atualizada" });
});

app.post("/funcionarios/delete", (req, res) => {
  const { idFuncionario } = req.body;
  const db = loadDB();
  const idx = db.funcionarios.findIndex((f) => f.idFuncionario == idFuncionario);
  if (idx === -1) return res.status(404).json({ message: "Funcionário não encontrado" });
  db.funcionarios[idx].StatusAtividadeGeral_idStatus = 2;
  db.funcionarios[idx].deleted_date = today();
  db.funcionarios[idx].update_date = today();
  saveDB(db);
  res.json({ message: "Funcionário desativado" });
});

// ─── AUTORES ──────────────────────────────────────────────────────────────────

app.get("/autores/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.autores);
});

app.get("/autores/:id", (req, res) => {
  const db = loadDB();
  const autor = db.autores.find((a) => a.id == req.params.id);
  if (!autor) return res.status(404).json({ message: "Autor não encontrado" });
  res.json(autor);
});

app.post("/autores/createAutor", (req, res) => {
  const db = loadDB();
  const newAutor = { id: nextId(db.autores), ...req.body };
  db.autores.push(newAutor);
  saveDB(db);
  res.status(201).json(newAutor);
});

app.post("/autores/updateAutor", (req, res) => {
  const { id, ...dados } = req.body;
  const db = loadDB();
  const idx = db.autores.findIndex((a) => a.id == id);
  if (idx === -1) return res.status(404).json({ message: "Autor não encontrado" });
  db.autores[idx] = { ...db.autores[idx], ...dados };
  saveDB(db);
  res.json({ message: "Atualizado" });
});

app.post("/autores/deleteAutor", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const idx = db.autores.findIndex((a) => a.id == id);
  if (idx === -1) return res.status(404).json({ message: "Autor não encontrado" });
  db.autores.splice(idx, 1);
  saveDB(db);
  res.json({ message: "Autor removido" });
});

// ─── LIVROS ───────────────────────────────────────────────────────────────────

function enrichLivro(livro, db) {
  const FALLBACK_CAPA =
    "https://via.placeholder.com/240x340/e2e8f0/64748b?text=Sem+Capa";
  return {
    ...livro,
    autorInfo: db.autores.find((a) => a.id === livro.Autor) || null,
    // aliases em lowercase esperados pelo front
    capa: livro.Capa || FALLBACK_CAPA,
    ano: livro.Ano ?? null,
    titulo: livro.Titulo,
    status:
      !livro.QtdLivros || livro.QtdLivros <= 0
        ? "Indisponível"
        : livro.QtdLivros <= 2
        ? "Últimas unidades"
        : "Disponível",
  };
}

app.get("/livros/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.livros.filter((l) => !l.deleted_at).map((l) => enrichLivro(l, db)));
});

app.get("/livros/buscar", (req, res) => {
  const { titulo, autorId, tipo } = req.query;
  const db = loadDB();
  let result = db.livros.filter((l) => !l.deleted_at);
  if (titulo) result = result.filter((l) => l.Titulo.toLowerCase().includes(titulo.toLowerCase()));
  if (autorId) result = result.filter((l) => l.Autor == autorId);
  if (tipo === "fisico") result = result.filter((l) => l.LivroFisico === 1);
  if (tipo === "digital") result = result.filter((l) => l.LivroDigital === 1);
  res.json(result.map((l) => enrichLivro(l, db)));
});

app.get("/livros/:id", (req, res) => {
  const db = loadDB();
  const livro = db.livros.find((l) => l.idLivro == req.params.id && !l.deleted_at);
  if (!livro) return res.status(404).json({ message: "Livro não encontrado" });
  res.json(enrichLivro(livro, db));
});

app.post("/livros/create", (req, res) => {
  const db = loadDB();
  const newLivro = {
    idLivro: nextId(db.livros, "idLivro"),
    ...req.body,
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.livros.push(newLivro);
  saveDB(db);
  res.status(201).json(newLivro);
});

app.post("/livros/update", (req, res) => {
  const { idLivro, ...dados } = req.body;
  const db = loadDB();
  const idx = db.livros.findIndex((l) => l.idLivro == idLivro);
  if (idx === -1) return res.status(404).json({ message: "Livro não encontrado" });
  db.livros[idx] = { ...db.livros[idx], ...dados, updated_at: today() };
  saveDB(db);
  res.json({ message: "Atualizado" });
});

app.post("/livros/estoque", (req, res) => {
  const { idLivro, quantidade } = req.body;
  const db = loadDB();
  const idx = db.livros.findIndex((l) => l.idLivro == idLivro);
  if (idx === -1) return res.status(404).json({ message: "Livro não encontrado" });
  const novaQtd = (db.livros[idx].QtdLivros || 0) + quantidade;
  db.livros[idx].QtdLivros = novaQtd;
  db.livros[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Estoque atualizado", QtdLivros: novaQtd });
});

app.post("/livros/delete", (req, res) => {
  const { idLivro } = req.body;
  const db = loadDB();
  const idx = db.livros.findIndex((l) => l.idLivro == idLivro);
  if (idx === -1) return res.status(404).json({ message: "Livro não encontrado" });
  db.livros[idx].deleted_at = today();
  saveDB(db);
  res.json({ message: "Livro removido do catálogo" });
});

// ─── EMPRESTIMOS ──────────────────────────────────────────────────────────────

function enrichEmprestimo(e, db) {
  return {
    ...e,
    livro: db.livros.find((l) => l.idLivro === e.idLivro) || null,
    usuario: (() => { const u = db.usuarios.find((u) => u.idUsuario === e.idUser); if (!u) return null; const { Senha, ...r } = u; return r; })(),
    autorizador: (() => { const f = db.funcionarios.find((f) => f.idFuncionario === e.AutorizadoPor); if (!f) return null; const { SenhaFunc, ...r } = f; return r; })(),
    vistoria: db.lvistoriasEmprestimos.find((v) => v.id === e.IdVistoria) || null,
  };
}

app.get("/emprestimos/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.livrosEmprestimos.filter((e) => !e.deleted_at).map((e) => enrichEmprestimo(e, db)));
});

app.get("/emprestimos/:id", (req, res) => {
  const db = loadDB();
  const e = db.livrosEmprestimos.find((e) => e.id == req.params.id && !e.deleted_at);
  if (!e) return res.status(404).json({ message: "Empréstimo não encontrado" });
  res.json(enrichEmprestimo(e, db));
});

app.post("/emprestimos/registrar", (req, res) => {
  const { AutorizadoPor, idLivro, idUser } = req.body;
  const db = loadDB();

  const livroIdx = db.livros.findIndex((l) => l.idLivro == idLivro);
  if (livroIdx === -1) return res.status(404).json({ message: "Livro não encontrado" });
  if (db.livros[livroIdx].QtdLivros < 1) return res.status(400).json({ message: "Estoque insuficiente" });

  const vistoria = { id: nextId(db.lvistoriasEmprestimos), VistoriadoPor: AutorizadoPor, created_at: today(), updated_at: today(), deleted_at: null };
  db.lvistoriasEmprestimos.push(vistoria);

  const emprestimo = { id: nextId(db.livrosEmprestimos), AutorizadoPor, idLivro, idUser, IdVistoria: vistoria.id, created_at: today(), updated_at: today(), deleted_at: null };
  db.livrosEmprestimos.push(emprestimo);

  db.livros[livroIdx].QtdLivros -= 1;
  db.livros[livroIdx].updated_at = today();

  saveDB(db);
  res.status(201).json(enrichEmprestimo(emprestimo, db));
});

app.post("/emprestimos/devolver", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const idx = db.livrosEmprestimos.findIndex((e) => e.id == id);
  if (idx === -1) return res.status(404).json({ message: "Empréstimo não encontrado" });

  const e = db.livrosEmprestimos[idx];
  const livroIdx = db.livros.findIndex((l) => l.idLivro === e.idLivro);
  if (livroIdx !== -1) {
    db.livros[livroIdx].QtdLivros += 1;
    db.livros[livroIdx].updated_at = today();
  }

  db.livrosEmprestimos[idx].deleted_at = today();
  db.livrosEmprestimos[idx].updated_at = today();

  saveDB(db);
  res.json({ message: "Devolução confirmada" });
});

// ─── VENDAS ───────────────────────────────────────────────────────────────────

function enrichVenda(v, db) {
  const usuario = (() => {
    const u = db.usuarios.find((u) => u.idUsuario === v.idUsuario);
    if (!u) return null;
    const { Senha, ...r } = u;
    return {
      ...r,
      endereco: db.infoEndereco.find((e) => e.idInfoEnd === u.InfoEndereco) || null,
      banco: db.infoBancario.find((b) => b.IdInfoBancario === u.InfoBancario) || null,
    };
  })();
  return {
    ...v,
    livro: db.livros.find((l) => l.idLivro === v.Livro) || null,
    usuario,
    funcionario: (() => { const f = db.funcionarios.find((f) => f.idFuncionario === v.FuncionarioResponsavel); if (!f) return null; const { SenhaFunc, ...r } = f; return r; })(),
    status: db.compraStatus.find((s) => s.id === v.CompraStatus) || null,
    enderecoEntrega: usuario?.endereco || null,
    formaPagamento: usuario?.banco || null,
  };
}

app.get("/vendas/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.lvendasNotasFiscais.filter((v) => !v.deleted_at).map((v) => enrichVenda(v, db)));
});

app.get("/vendas/relatorio", (req, res) => {
  const { dataInicio, dataFim } = req.query;
  const db = loadDB();
  let vendas = db.lvendasNotasFiscais.filter((v) => !v.deleted_at);
  if (dataInicio) vendas = vendas.filter((v) => v.DataCompra >= dataInicio);
  if (dataFim) vendas = vendas.filter((v) => v.DataCompra <= dataFim);
  const total = vendas.reduce((sum, v) => sum + (v.ValorPago || 0), 0);
  res.json({ vendas: vendas.map((v) => enrichVenda(v, db)), total });
});

app.get("/vendas/:id", (req, res) => {
  const db = loadDB();
  const v = db.lvendasNotasFiscais.find((v) => v.id == req.params.id && !v.deleted_at);
  if (!v) return res.status(404).json({ message: "Venda não encontrada" });
  res.json(enrichVenda(v, db));
});

app.post("/vendas/registrar", (req, res) => {
  const { Livro, idUsuario, FuncionarioResponsavel, ValorCompra } = req.body;
  const db = loadDB();

  const livroIdx = db.livros.findIndex((l) => l.idLivro == Livro);
  if (livroIdx === -1) return res.status(404).json({ message: "Livro não encontrado" });
  if (db.livros[livroIdx].LivroFisico && db.livros[livroIdx].QtdLivros < 1) {
    return res.status(400).json({ message: "Estoque insuficiente" });
  }

  const venda = {
    id: nextId(db.lvendasNotasFiscais),
    Livro,
    idUsuario,
    FuncionarioResponsavel,
    CompraStatus: 1,
    ValorCompra: ValorCompra || db.livros[livroIdx].PrecoVenda,
    ValorPago: 0,
    DataCompra: today(),
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.lvendasNotasFiscais.push(venda);

  if (db.livros[livroIdx].LivroFisico) {
    db.livros[livroIdx].QtdLivros -= 1;
    db.livros[livroIdx].updated_at = today();
  }

  saveDB(db);
  res.status(201).json(enrichVenda(venda, db));
});

app.post("/vendas/confirmarPagamento", (req, res) => {
  const { id, ValorPago } = req.body;
  const db = loadDB();
  const idx = db.lvendasNotasFiscais.findIndex((v) => v.id == id);
  if (idx === -1) return res.status(404).json({ message: "Venda não encontrada" });
  db.lvendasNotasFiscais[idx].CompraStatus = 2;
  db.lvendasNotasFiscais[idx].ValorPago = ValorPago || db.lvendasNotasFiscais[idx].ValorCompra;
  db.lvendasNotasFiscais[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Pagamento confirmado" });
});

app.post("/vendas/cancelar", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const idx = db.lvendasNotasFiscais.findIndex((v) => v.id == id);
  if (idx === -1) return res.status(404).json({ message: "Venda não encontrada" });
  db.lvendasNotasFiscais[idx].CompraStatus = 3;
  db.lvendasNotasFiscais[idx].updated_at = today();
  db.lvendasNotasFiscais[idx].deleted_at = today();
  saveDB(db);
  res.json({ message: "Venda cancelada" });
});

// ─── SOLICITACOES ─────────────────────────────────────────────────────────────

function enrichSolicitacao(s, db) {
  return {
    ...s,
    tipo: db.tiposSolicitacao.find((t) => t.id === s.TiposSolicitacao) || null,
    etapa: db.etapasTipoSolicitacao.find((e) => e.id === s.Etapas) || null,
    formulario: db.formularioSolicitacao.find((f) => f.id === s.FormularioId) || null,
  };
}

app.get("/solicitacoes/tipos", (_, res) => {
  const db = loadDB();
  res.json(db.tiposSolicitacao.filter((t) => !t.deleted_at));
});

app.get("/solicitacoes/etapas", (_, res) => {
  const db = loadDB();
  res.json(db.etapasTipoSolicitacao.filter((e) => !e.deleted_at));
});

app.get("/solicitacoes/findAll", (_, res) => {
  const db = loadDB();
  res.json(db.controleSolicitacoes.filter((s) => !s.deleted_at).map((s) => enrichSolicitacao(s, db)));
});

app.get("/solicitacoes/:id", (req, res) => {
  const db = loadDB();
  const s = db.controleSolicitacoes.find((s) => s.Id == req.params.id && !s.deleted_at);
  if (!s) return res.status(404).json({ message: "Solicitação não encontrada" });
  res.json(enrichSolicitacao(s, db));
});

app.post("/solicitacoes/criar", (req, res) => {
  const db = loadDB();
  const newSol = {
    Id: nextId(db.controleSolicitacoes, "Id"),
    ...req.body,
    Etapas: 1,
    created_at: today(),
    updated_at: today(),
    deleted_at: null,
  };
  db.controleSolicitacoes.push(newSol);
  saveDB(db);
  res.status(201).json(enrichSolicitacao(newSol, db));
});

app.post("/solicitacoes/avancar", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const idx = db.controleSolicitacoes.findIndex((s) => s.Id == id);
  if (idx === -1) return res.status(404).json({ message: "Solicitação não encontrada" });

  const etapaAtual = db.etapasTipoSolicitacao.find((e) => e.id === db.controleSolicitacoes[idx].Etapas);
  if (etapaAtual && etapaAtual.Final) return res.status(400).json({ message: "Solicitação já está na etapa final" });

  const proximaEtapa = db.etapasTipoSolicitacao.find((e) => e.Ordem === (etapaAtual ? etapaAtual.Ordem + 1 : 2));
  if (!proximaEtapa) return res.status(400).json({ message: "Não há próxima etapa" });

  db.controleSolicitacoes[idx].Etapas = proximaEtapa.id;
  db.controleSolicitacoes[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Etapa avançada", etapa: proximaEtapa });
});

app.post("/solicitacoes/cancelar", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const idx = db.controleSolicitacoes.findIndex((s) => s.Id == id);
  if (idx === -1) return res.status(404).json({ message: "Solicitação não encontrada" });
  db.controleSolicitacoes[idx].Etapas = 5;
  db.controleSolicitacoes[idx].deleted_at = today();
  db.controleSolicitacoes[idx].updated_at = today();
  saveDB(db);
  res.json({ message: "Solicitação cancelada" });
});

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n📚 Book0Teca Mock Server rodando em http://localhost:${PORT}`);
  console.log(`   Dados em: ${DB_PATH}\n`);
  console.log("   Credenciais de teste:");
  console.log("   Funcionário admin  → admin@bookoteca.com  / admin123");
  console.log("   Funcionário biblio → maria@bookoteca.com  / maria123");
  console.log("   Usuário            → joao@email.com       / joao123\n");
});
