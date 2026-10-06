# Maximus Fitness — CRUD Aluno e Plano

Projeto web para apresentação da disciplina **Projeto de Desenvolvimento de Software**, implementando os módulos **Aluno** e **Plano** do Sistema de Gerenciamento da Maximus Fitness.

## Stack escolhida
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: MySQL
- Comunicação: API REST + JSON

React foi escolhido no lugar de Angular porque, para esta entrega, a equipe precisa de duas telas e CRUDs funcionando rapidamente; Angular adicionaria uma estrutura e conceitos que não são necessários para demonstrar os requisitos.

## Requisitos implementados
### Aluno
- Cadastrar
- Consultar por nome/CPF
- Editar
- Desativar (status INATIVO, preservando o registro)
- Validação de campos obrigatórios, CPF, e-mail e CPF duplicado

Campos: Nome, CPF, Data de Nascimento, Telefone, E-mail, Endereço e Histórico de Saúde.

### Plano
- Cadastrar
- Consultar por tipo/status
- Editar
- Desativar (status INATIVO, preservando o registro)
- Validação de campos obrigatórios, valor/duração e duplicidade de tipo+duração

Campos: Tipo, Valor, Duração, Descrição e Status.

## Como executar
### 1. Banco
Abra o MySQL Workbench/phpMyAdmin e execute `database/schema.sql`.

### 2. Configurar backend
Entre em `backend`, copie `.env.example` para `.env` e ajuste usuário/senha do MySQL.

### 3. Instalar dependências
Na pasta raiz:

```bash
npm install
npm run install:all
```

### 4. Rodar
Na pasta raiz:

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Roteiro rápido para apresentar
1. Mostrar a tela **Gerenciar Alunos**.
2. Cadastrar um aluno.
3. Mostrar que ele apareceu no banco/listagem.
4. Pesquisar por nome ou CPF.
5. Editar o aluno.
6. Desativar e mostrar o status INATIVO.
7. Abrir **Gerenciar Planos**.
8. Cadastrar um plano.
9. Pesquisar por tipo/status.
10. Editar e desativar o plano.

## Observação sobre a especificação
O documento usa `Tipo` nos requisitos funcionais do Plano, enquanto o diagrama de classes apresenta o atributo como `nome`. Nesta implementação, foi adotado `tipo`, por ser o campo explicitamente solicitado nos RF005–RF008.
