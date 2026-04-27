DROP SCHEMA IF EXISTS bookoteca;
CREATE SCHEMA bookoteca;
USE bookoteca;

-- =============================
-- TABELAS BASE (SEM DEPENDÊNCIA)
-- =============================

CREATE TABLE StatusAtividadeGeral (
  idStatus INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(300) NOT NULL,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
);

CREATE TABLE PerfilFuncionarios (
  idPerfil INT AUTO_INCREMENT PRIMARY KEY,
  Descricao VARCHAR(150),
  created_at DATE,
  updated_at DATE,
  deleted_at DATE
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
  fotoperfil VARCHAR(2000),
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
  Capa VARCHAR(1000),
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
  Quantidade INT DEFAULT 1;
  EnderecoEntrega TEXT;
  FormaPagamento VARCHAR(32);
  DataCompra DATE,
  created_at DATE,
  updated_at DATE,
  deleted_at DATE,
  FOREIGN KEY (Livro) REFERENCES LivrosCatalogo(idLivro),
  FOREIGN KEY (idUsuario) REFERENCES UsuariosSistema(idUsuario),
  FOREIGN KEY (FuncionarioResponsavel) REFERENCES FuncionariosSistema(idFuncionario),
  FOREIGN KEY (CompraStatus) REFERENCES CompraStatus(id)
);

-- ALTER TABLE LVendasNotasFiscais ADD COLUMN Quantidade INT DEFAULT 1;
-- ALTER TABLE LVendasNotasFiscais ADD COLUMN enderecoEntrega TEXT;
-- ALTER TABLE LVendasNotasFiscais ADD COLUMN formaPagamento VARCHAR(32);

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


-- INSERTS 
INSERT INTO PerfilFuncionarios (Descricao, created_at, updated_at) VALUES
('Administrador', CURDATE(), CURDATE()),
('Bibliotecario', CURDATE(), CURDATE()),
('Financeiro', CURDATE(), CURDATE()),
('Estoque', CURDATE(), CURDATE()),
('Usuario', CURDATE(), CURDATE());

INSERT INTO StatusAtividadeGeral (Descricao, created_at, updated_at) VALUES
('Ativo', CURDATE(), CURDATE()),
('Inativo', CURDATE(), CURDATE()),
('Bloqueado', CURDATE(), CURDATE()),
('Pendente', CURDATE(), CURDATE()),
('Suspenso', CURDATE(), CURDATE());

INSERT INTO InfoEndereco 
(Logradouro, Bairro, Numero, Cidade, Estado, CEP, created_at, updated_at) VALUES
('Rua A', 'Centro', 100, 'Belo Horizonte', 'MG', '30000-000', CURDATE(), CURDATE()),
('Rua B', 'Savassi', 200, 'Belo Horizonte', 'MG', '30000-001', CURDATE(), CURDATE()),
('Av Brasil', 'Funcionários', 300, 'Belo Horizonte', 'MG', '30000-002', CURDATE(), CURDATE()),
('Rua das Flores', 'Jardim', 400, 'Contagem', 'MG', '30000-003', CURDATE(), CURDATE()),
('Av Principal', 'Industrial', 500, 'Betim', 'MG', '30000-004', CURDATE(), CURDATE());

INSERT INTO InfoBancario 
(NomeBanco, CodigoBanco, TipoConta, NumeroAgencia, NumeroConta, created_at, updated_at) VALUES
('Banco do Brasil', 1, 'Corrente', 1234, 98765, CURDATE(), CURDATE()),
('Caixa', 104, 'Poupança', 5678, 12345, CURDATE(), CURDATE()),
('Bradesco', 237, 'Corrente', 1111, 22222, CURDATE(), CURDATE()),
('Itaú', 341, 'Corrente', 2222, 33333, CURDATE(), CURDATE()),
('Santander', 33, 'Corrente', 3333, 44444, CURDATE(), CURDATE());

INSERT INTO Autores (NomeAutor, SobreAutor, created_at, updated_at) VALUES
('Machado de Assis', 'Autor brasileiro', CURDATE(), CURDATE()),
('Clarice Lispector', 'Autora modernista', CURDATE(), CURDATE()),
('Jorge Amado', 'Autor baiano', CURDATE(), CURDATE()),
('Monteiro Lobato', 'Literatura infantil', CURDATE(), CURDATE()),
('Carlos Drummond', 'Poeta brasileiro', CURDATE(), CURDATE());

INSERT INTO CompraStatus (Descricao, created_at, updated_at) VALUES
('Pendente', CURDATE(), CURDATE()),
('Pago', CURDATE(), CURDATE()),
('Cancelado', CURDATE(), CURDATE()),
('Aguardando', CURDATE(), CURDATE()),
('Reembolsado', CURDATE(), CURDATE());

INSERT INTO TiposSolicitacao (Descricao, created_at, updated_at) VALUES
('Suporte', CURDATE(), CURDATE()),
('Financeiro', CURDATE(), CURDATE()),
('Emprestimo', CURDATE(), CURDATE()),
('Compra', CURDATE(), CURDATE()),
('Cadastro', CURDATE(), CURDATE());

INSERT INTO EtapasTipoSolicitacao (Descricao, Ordem, Final, created_at, updated_at) VALUES
('Aberto', 1, 0, CURDATE(), CURDATE()),
('Em análise', 2, 0, CURDATE(), CURDATE()),
('Aprovado', 3, 0, CURDATE(), CURDATE()),
('Finalizado', 4, 1, CURDATE(), CURDATE()),
('Cancelado', 5, 1, CURDATE(), CURDATE());

INSERT INTO FormularioSolicitacao (FormularioJSON, created_at, updated_at) VALUES
('{"campo":"nome"}', CURDATE(), CURDATE()),
('{"campo":"email"}', CURDATE(), CURDATE()),
('{"campo":"telefone"}', CURDATE(), CURDATE()),
('{"campo":"livro"}', CURDATE(), CURDATE()),
('{"campo":"descricao"}', CURDATE(), CURDATE());

INSERT INTO UsuariosSistema
(Nome, CPF, Telefone, Email, Senha, SenhaInicial, Status, InfoEndereco, InfoBancario,fotoperfil, created_at, updated_at)
VALUES
('João Silva','11111111111','31999999901','joao@email.com','123',1,1,1,1,'',CURDATE(),CURDATE()),
('Maria Souza','22222222222','31999999902','maria@email.com','123',1,1,2,2,'',CURDATE(),CURDATE()),
('Pedro Costa','33333333333','31999999903','pedro@email.com','123',1,1,3,3,'',CURDATE(),CURDATE()),
('Ana Lima','44444444444','31999999904','ana@email.com','123',1,1,4,4,'',CURDATE(),CURDATE()),
('Lucas Rocha','55555555555','31999999905','lucas@email.com','123',1,1,5,5,'',CURDATE(),CURDATE());

INSERT INTO FuncionariosSistema
(MatriculaFunc, NomeFunc, CPFFunc, EmailFunc, RegiaoFunc, SenhaFunc, SenhaInicialFunc,
 idPerfilFuncionarios, StatusAtividadeGeral_idStatus,
 InfoBancario_IdInfoBancario, InfoEndereco_idInfoEnd,
 created_date, update_date)
VALUES
('F001','Admin','111','admin@email.com','MG','TecInfo@2025.1',0,1,1,1,1,CURDATE(),CURDATE()),
('F002','Bruna Lima','222','bru@email.com','MG','123',1,2,1,2,2,CURDATE(),CURDATE()),
('F003','Marcos Silva','333','marc@email.com','MG','123',1,3,1,3,3,CURDATE(),CURDATE()),
('F004','Juliana Rocha','444','ju@email.com','MG','123',1,4,1,4,4,CURDATE(),CURDATE()),
('F005','Paulo Souza','555','paulo@email.com','MG','123',1,5,1,5,5,CURDATE(),CURDATE());

INSERT INTO LVistoriasEmprestimos (VistoriadoPor, created_at, updated_at) VALUES
(1,CURDATE(),CURDATE()),
(2,CURDATE(),CURDATE()),
(3,CURDATE(),CURDATE()),
(4,CURDATE(),CURDATE()),
(5,CURDATE(),CURDATE());