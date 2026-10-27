# Maximus Fitness — CRUD Aluno e Plano

Sistema web desenvolvido para a disciplina **Projeto de Desenvolvimento de Software**, com o objetivo de implementar dois módulos independentes de um sistema de gerenciamento de academia: **Aluno** e **Plano**.

O projeto permite cadastrar, consultar, editar, desativar e reativar registros, utilizando uma interface web integrada a um banco de dados relacional.

## Tecnologias utilizadas

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de dados:** MySQL
- **Comunicação:** API REST utilizando JSON
- **Ambiente de desenvolvimento:** Visual Studio Code

## Funcionalidades implementadas

### Módulo Aluno

- Cadastrar novos alunos.
- Consultar e pesquisar alunos por nome ou CPF.
- Editar informações cadastrais.
- Desativar alunos, alterando o status para `INATIVO`.
- Reativar alunos pelo formulário de edição, alterando o status para `ATIVO`.
- Validar campos obrigatórios, formato de CPF e e-mail.
- Impedir o cadastro de CPFs duplicados.

**Campos:** Nome, CPF, Data de Nascimento, Telefone, E-mail, Endereço, Histórico de Saúde e Status.

### Módulo Plano

- Cadastrar novos planos.
- Consultar e pesquisar planos por tipo.
- Filtrar planos por status.
- Editar informações dos planos.
- Desativar planos, alterando o status para `INATIVO`.
- Reativar planos pelo formulário de edição.
- Validar campos obrigatórios, valor e duração.
- Tratar duplicidade de planos conforme as restrições do banco de dados.

**Campos:** Tipo, Valor, Duração, Descrição e Status.

## Operações CRUD

O sistema implementa as operações de gerenciamento de dados:

| Operação | Funcionalidade |
|---|---|
| Create | Cadastro de alunos e planos |
| Read | Consulta e pesquisa de registros |
| Update | Edição de informações e atualização de status |
| Delete | Desativação lógica, sem exclusão física do registro |

A exclusão lógica preserva os dados no banco de dados e permite a reativação posterior.

## Estrutura do projeto

```text
trabalho-pds/
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   └── server.js
│   └── package.json
├── database/
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

## Como executar o projeto

### 1. Pré-requisitos

É necessário ter instalado:

- Node.js e npm
- MySQL Server
- MySQL Workbench ou outro cliente MySQL

### 2. Configurar o banco de dados

Abra o MySQL Workbench e execute o arquivo:

`database/schema.sql`

O script prepara o banco de dados e as tabelas necessárias para o funcionamento do sistema.

### 3. Configurar o backend

Na pasta `backend`, configure o arquivo `.env` com os dados de conexão do MySQL, conforme as variáveis utilizadas em `src/db.js`.

**Importante:** não publique o arquivo `.env` com senhas no GitHub.

### 4. Instalar as dependências

Abra o terminal na pasta raiz do projeto e execute:

```bash
npm install
npm run install:all
```

### 5. Iniciar o sistema

Na pasta raiz, execute:

```bash
npm run dev
```

### 6. Acessar o sistema

**Frontend:**

http://localhost:5173

**API Backend:**

http://localhost:3001

**Verificação da conexão com o banco:**

http://localhost:3001/api/health

## Roteiro de apresentação

1. Apresentar o objetivo do Maximus Fitness e as tecnologias utilizadas.
2. Demonstrar a interface do módulo Aluno.
3. Cadastrar um novo aluno.
4. Pesquisar o aluno pelo nome ou CPF.
5. Editar as informações cadastradas.
6. Desativar o aluno e demonstrar o status `INATIVO`.
7. Reativar o aluno e demonstrar o status `ATIVO`.
8. Acessar o módulo Plano.
9. Cadastrar e pesquisar um plano.
10. Editar, desativar e reativar um plano.
11. Demonstrar os registros armazenados no MySQL.
12. Explicar a comunicação entre frontend, backend e banco de dados.

## Considerações finais

O projeto Maximus Fitness demonstra a implementação de operações CRUD em dois módulos independentes, integrando uma interface React, uma API REST desenvolvida com Express e um banco de dados MySQL.

A utilização de desativação lógica permite preservar os registros e recuperar seu status posteriormente, evitando a exclusão definitiva dos dados.