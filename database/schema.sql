CREATE DATABASE IF NOT EXISTS maximus_fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maximus_fitness;

CREATE TABLE IF NOT EXISTS aluno (
  id_aluno INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL,
  endereco VARCHAR(180) NOT NULL,
  historico_saude TEXT NOT NULL,
  status ENUM('ATIVO','INATIVO') NOT NULL DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plano (
  id_plano INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(80) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  duracao INT NOT NULL,
  descricao VARCHAR(180),
  status ENUM('ATIVO','INATIVO') NOT NULL DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plano_tipo_duracao (tipo, duracao)
) ENGINE=InnoDB;

INSERT IGNORE INTO plano (id_plano,tipo,valor,duracao,descricao,status) VALUES
(1,'Mensal',89.90,30,'Plano mensal da academia','ATIVO'),
(2,'Trimestral',239.90,90,'Plano trimestral da academia','ATIVO'),
(3,'Semestral',449.90,180,'Plano semestral da academia','ATIVO'),
(4,'Diária',25.00,1,'Acesso por um dia','ATIVO');

INSERT IGNORE INTO aluno (id_aluno,nome,cpf,data_nascimento,telefone,email,endereco,historico_saude,status) VALUES
(1,'João da Silva','111.111.111-11','1998-04-12','(77) 99999-1111','joao@email.com','Rua A, 100 - Centro','Sem restrições informadas.','ATIVO'),
(2,'Maria Oliveira','222.222.222-22','2001-09-23','(77) 98888-2222','maria@email.com','Av. B, 250 - Candeias','Alergia a anti-inflamatório.','ATIVO');
