DROP SCHEMA IF EXISTS bookoteca;
CREATE SCHEMA bookoteca;
USE bookoteca;

-- =============================
-- TABELAS BASE (SEM DEPENDÊNCIA)
-- =============================

CREATE TABLE StatusAtividadeGeral (
  idStatus INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(300) NOT NULL,
  created_date DATE,
  updated_date DATE,
  deleted_date DATE
);

CREATE TABLE PerfilFuncionarios (
  idPerfil INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(300) NOT NULL,
  created_date DATE,
  updated_date DATE,
  deleted_date DATE
);

CREATE TABLE InfoEndereco (
  idInfoEnd INT AUTO_INCREMENT PRIMARY KEY,
  Logradouro VARCHAR(150) NOT NULL,
  Bairro VARCHAR(100) NOT NULL,
  Numero INT NOT NULL,
  Cidade VARCHAR(45) NOT NULL,
  Estado VARCHAR(45) NOT NULL,
  Nacionalidade VARCHAR(100),
  CEP VARCHAR(20),
  Complemento VARCHAR(300),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE InfoBancario (
  IdInfoBancario INT AUTO_INCREMENT PRIMARY KEY,
  NomeBanco VARCHAR(150),
  CodigoBanco INT,
  TipoConta VARCHAR(150),
  NumeroAgencia INT,
  DigitoAgencia INT,
  NumeroConta INT,
  DigitoConta INT,
  CodigosPix VARCHAR(500),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE Autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NomeAutor VARCHAR(500) NOT NULL,
  SobreAutor VARCHAR(1500),
  PalavrasChave JSON,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE CompraStatus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(800),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE OrdemEntregaStatus (
  idStatus INT PRIMARY KEY,
  Descricao VARCHAR(1500),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE TiposSolicitacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(1000),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE EtapasTipoSolicitacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(150),
  Ordem INT,
  Final INT,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE FormularioSolicitacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  FormularioJSON JSON,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

-- =============================
-- TABELAS DEPENDENTES
-- =============================

CREATE TABLE UsuariosSistema (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  Nome VARCHAR(150),
  CPF VARCHAR(45),
  Telefone VARCHAR(45),
  Senha VARCHAR(300),
  Email VARCHAR(200),
  SenhaInicial TINYINT,
  Status INT,
  InfoEndereco INT,
  InfoBancario INT,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (Status) REFERENCES StatusAtividadeGeral(idStatus),
  FOREIGN KEY (InfoEndereco) REFERENCES InfoEndereco(idInfoEnd),
  FOREIGN KEY (InfoBancario) REFERENCES InfoBancario(IdInfoBancario)
);

CREATE TABLE FuncionariosSistema (
  idFuncionario INT AUTO_INCREMENT PRIMARY KEY,
  MatriculaFunc VARCHAR(250),
  NomeFunc VARCHAR(250),
  CPFFunc VARCHAR(45),
  EmailFunc VARCHAR(250),
  RegiaoFunc VARCHAR(2),
  SenhaFunc VARCHAR(300),
  SenhaInicialFunc TINYINT,
  CadastradoPor INT,
  idPerfilFuncionarios INT,
  StatusAtividadeGeral_idStatus INT,
  InfoBancario_IdInfoBancario INT,
  InfoEndereco_idInfoEnd INT,
  created_date DATE,
  update_date DATE,
  deleted_date DATE,
  FOREIGN KEY (idPerfilFuncionarios) REFERENCES PerfilFuncionarios(idPerfil),
  FOREIGN KEY (StatusAtividadeGeral_idStatus) REFERENCES StatusAtividadeGeral(idStatus),
  FOREIGN KEY (InfoBancario_IdInfoBancario) REFERENCES InfoBancario(IdInfoBancario),
  FOREIGN KEY (InfoEndereco_idInfoEnd) REFERENCES InfoEndereco(idInfoEnd)
);

CREATE TABLE LivrosCatalogo (
  idLivro INT AUTO_INCREMENT PRIMARY KEY,
  Titulo VARCHAR(50),
  ISBN VARCHAR(100),
  Autor INT,
  LivroFisico TINYINT,
  LivroDigital TINYINT,
  QtdLivros INT,
  PrecoCompra FLOAT,
  PrecoVenda FLOAT,
  PathDownload VARCHAR(1000),
  PalavrasChave JSON,
  Descricao VARCHAR(1000),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (Autor) REFERENCES Autores(id)
);

CREATE TABLE LVistoriasEmprestimos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  VistoriadoPor INT,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (VistoriadoPor) REFERENCES FuncionariosSistema(idFuncionario)
);

CREATE TABLE LVendasNotasFiscais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Livro INT,
  idUsuario INT,
  FuncionarioResponsavel INT,
  CompraStatus INT,
  ValorCompra FLOAT,
  ValorPago FLOAT,
  DataCompra DATE,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (Livro) REFERENCES LivrosCatalogo(idLivro),
  FOREIGN KEY (idUsuario) REFERENCES UsuariosSistema(idUsuario),
  FOREIGN KEY (FuncionarioResponsavel) REFERENCES FuncionariosSistema(idFuncionario),
  FOREIGN KEY (CompraStatus) REFERENCES CompraStatus(id)
);

CREATE TABLE LivrosEmprestimos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  AutorizadoPor INT,
  idLivro INT,
  idUser INT,
  IdVistoria INT,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (AutorizadoPor) REFERENCES FuncionariosSistema(idFuncionario),
  FOREIGN KEY (idLivro) REFERENCES LivrosCatalogo(idLivro),
  FOREIGN KEY (idUser) REFERENCES UsuariosSistema(idUsuario),
  FOREIGN KEY (IdVistoria) REFERENCES LVistoriasEmprestimos(id)
);

CREATE TABLE ControleSolicitacoes (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(150),
  CriadaPor INT,
  FormularioId INT,
  TiposSolicitacao INT,
  Etapas INT,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (FormularioId) REFERENCES FormularioSolicitacao(id),
  FOREIGN KEY (TiposSolicitacao) REFERENCES TiposSolicitacao(id),
  FOREIGN KEY (Etapas) REFERENCES EtapasTipoSolicitacao(id)
);