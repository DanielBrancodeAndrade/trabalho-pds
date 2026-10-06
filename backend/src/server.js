import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const ok = (res, data) => res.json(data);
const fail = (res, status, message) => res.status(status).json({ message });

app.get('/api/health', async (_req,res) => {
  try { await pool.query('SELECT 1'); ok(res,{status:'ok', message:'API e MySQL conectados.'}); }
  catch (e) { fail(res,500,'Banco de dados indisponível.'); }
});

// ALUNOS
app.get('/api/alunos', async (req,res) => {
  try {
    const q = (req.query.q || '').trim();
    const like = `%${q}%`;
    const [rows] = await pool.query(
      `SELECT id_aluno, nome, cpf, DATE_FORMAT(data_nascimento,'%Y-%m-%d') data_nascimento,
              telefone, email, endereco, historico_saude, status
       FROM aluno WHERE ?='' OR nome LIKE ? OR cpf LIKE ? ORDER BY id_aluno DESC`, [q,like,like]);
    ok(res,rows);
  } catch (e) { console.error(e); fail(res,500,'Erro ao consultar informações!'); }
});

app.post('/api/alunos', async (req,res) => {
  const {nome,cpf,data_nascimento,telefone,email,endereco,historico_saude} = req.body;
  if (![nome,cpf,data_nascimento,telefone,email,endereco,historico_saude].every(v => String(v ?? '').trim())) return fail(res,400,'Preencha todos os campos obrigatórios!');
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) return fail(res,400,'CPF inválido. Verifique os números digitados!');
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail(res,400,'E-mail com formato inválido!');
  try {
    const [r] = await pool.query(`INSERT INTO aluno (nome,cpf,data_nascimento,telefone,email,endereco,historico_saude) VALUES (?,?,?,?,?,?,?)`,[nome,cpf,data_nascimento,telefone,email,endereco,historico_saude]);
    const [rows] = await pool.query('SELECT * FROM aluno WHERE id_aluno=?',[r.insertId]);
    ok(res.status(201),rows[0]);
  } catch(e) { if(e.code==='ER_DUP_ENTRY') return fail(res,409,'CPF já cadastrado no sistema!'); console.error(e); fail(res,500,'Erro ao cadastrar aluno!'); }
});

app.put('/api/alunos/:id', async (req,res) => {
  const {id}=req.params; const {nome,cpf,data_nascimento,telefone,email,endereco,historico_saude}=req.body;
  if (![nome,cpf,data_nascimento,telefone,email,endereco,historico_saude].every(v => String(v ?? '').trim())) return fail(res,400,'Preencha todos os campos obrigatórios!');
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) return fail(res,400,'CPF inválido. Verifique os números digitados!');
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail(res,400,'E-mail com formato inválido!');
  try {
    await pool.query(`UPDATE aluno SET nome=?,cpf=?,data_nascimento=?,telefone=?,email=?,endereco=?,historico_saude=? WHERE id_aluno=?`,[nome,cpf,data_nascimento,telefone,email,endereco,historico_saude,id]);
    const [rows]=await pool.query('SELECT * FROM aluno WHERE id_aluno=?',[id]); if(!rows.length) return fail(res,404,'Aluno não encontrado!'); ok(res,rows[0]);
  } catch(e) { if(e.code==='ER_DUP_ENTRY') return fail(res,409,'CPF já cadastrado no sistema!'); console.error(e); fail(res,500,'Erro ao atualizar informações!'); }
});

app.patch('/api/alunos/:id/desativar', async (req,res) => {
  try { const [r]=await pool.query("UPDATE aluno SET status='INATIVO' WHERE id_aluno=? AND status='ATIVO'",[req.params.id]); if(!r.affectedRows) return fail(res,409,'Aluno já desativado no sistema!'); ok(res,{message:'Operação realizada com sucesso!'}); }
  catch(e){console.error(e);fail(res,500,'Erro ao desativar aluno!');}
});

// PLANOS
app.get('/api/planos', async (req,res) => {
  try { const q=(req.query.q||'').trim(); const status=(req.query.status||'').trim(); const [rows]=await pool.query(`SELECT id_plano,tipo,valor,duracao,descricao,status FROM plano WHERE (?='' OR tipo LIKE ?) AND (?='' OR status=?) ORDER BY id_plano DESC`,[q,`%${q}%`,status,status]); ok(res,rows); }
  catch(e){console.error(e);fail(res,500,'Erro ao consultar informações!');}
});

app.post('/api/planos', async (req,res) => {
  const {tipo,valor,duracao,descricao,status='ATIVO'}=req.body;
  if(!String(tipo??'').trim() || valor===undefined || valor==='' || duracao===undefined || duracao==='' || !String(status).trim()) return fail(res,400,'Preencha todos os campos obrigatórios!');
  if(Number(valor)<0 || Number(duracao)<=0) return fail(res,400,'Valor inválido!');
  try { const [r]=await pool.query(`INSERT INTO plano (tipo,valor,duracao,descricao,status) VALUES (?,?,?,?,?)`,[tipo,Number(valor),Number(duracao),descricao||'',status]); const [rows]=await pool.query('SELECT * FROM plano WHERE id_plano=?',[r.insertId]); ok(res.status(201),rows[0]); }
  catch(e){ if(e.code==='ER_DUP_ENTRY') return fail(res,409,'Plano já cadastrado no sistema!'); console.error(e);fail(res,500,'Erro ao cadastrar plano!'); }
});

app.put('/api/planos/:id', async (req,res) => {
  const {tipo,valor,duracao,descricao,status}=req.body;
  if(!String(tipo??'').trim() || valor===undefined || valor==='' || duracao===undefined || duracao==='' || !String(status).trim()) return fail(res,400,'Preencha todos os campos obrigatórios!');
  if(Number(valor)<0 || Number(duracao)<=0) return fail(res,400,'Valor inválido!');
  try { await pool.query(`UPDATE plano SET tipo=?,valor=?,duracao=?,descricao=?,status=? WHERE id_plano=?`,[tipo,Number(valor),Number(duracao),descricao||'',status,req.params.id]); const [rows]=await pool.query('SELECT * FROM plano WHERE id_plano=?',[req.params.id]); if(!rows.length)return fail(res,404,'Plano não encontrado!');ok(res,rows[0]); }
  catch(e){if(e.code==='ER_DUP_ENTRY')return fail(res,409,'Plano já cadastrado no sistema!');console.error(e);fail(res,500,'Erro ao atualizar informações!');}
});

app.patch('/api/planos/:id/desativar', async (req,res) => {
  try { const [r]=await pool.query("UPDATE plano SET status='INATIVO' WHERE id_plano=? AND status='ATIVO'",[req.params.id]); if(!r.affectedRows)return fail(res,409,'Plano já desativado no sistema!');ok(res,{message:'Operação realizada com sucesso!'}); } catch(e){console.error(e);fail(res,500,'Erro ao desativar plano!');}
});

app.listen(Number(process.env.PORT||3001),()=>console.log(`API Maximus Fitness em http://localhost:${process.env.PORT||3001}`));
