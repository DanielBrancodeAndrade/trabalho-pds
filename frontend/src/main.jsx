import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from 'react-router-dom';

import {
  Users,
  CreditCard,
  Search,
  Plus,
  Pencil,
  Ban,
  X,
  Dumbbell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import './styles.css';

const API = 'http://localhost:3001/api';

async function api(path, opts = {}) {
  const r = await fetch(API + path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...opts
  });

  const d = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(d.message || 'Erro na operação.');
  }

  return d;
}

const initialAluno = {
  nome: '',
  cpf: '',
  data_nascimento: '',
  telefone: '',
  email: '',
  endereco: '',
  historico_saude: ''
};

const initialPlano = {
  tipo: '',
  valor: '',
  duracao: '',
  descricao: '',
  status: 'ATIVO'
};

function Layout({ children }) {
  return (
    <div className="app">
      <aside>
        <div className="brand">
          <div className="brand-icon">
            <Dumbbell size={22} />
          </div>

          <div>
            <strong>MAXIMUS</strong>
            <span>FITNESS</span>
          </div>
        </div>

        <nav>
          <NavLink to="/alunos">
            <Users size={19} />
            Alunos
          </NavLink>

          <NavLink to="/planos">
            <CreditCard size={19} />
            Planos
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          Sistema de Gerenciamento
          <br />
          Maximus Fitness
        </div>
      </aside>

      <main>
        <header>
          <div>
            <small>GERENCIAMENTO DE ACADEMIA</small>
            <h1>Maximus Fitness</h1>
          </div>

          <span className="online">
            <i /> Sistema online
          </span>
        </header>

        {children}
      </main>
    </div>
  );
}

function Toast({ msg, error }) {
  if (!msg) return null;

  return (
    <div className={'toast ' + (error ? 'error' : '')}>
      {error ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}

      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <h2>{title}</h2>

          <button className="icon-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* =========================
   ALUNOS
========================= */

function Alunos() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initialAluno);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      setItems(
        await api('/alunos?q=' + encodeURIComponent(q))
      );
    } catch (e) {
      notify(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  function notify(m, err = false) {
    setMsg(m);
    setError(err);

    setTimeout(() => {
      setMsg('');
    }, 2800);
  }

  const openNew = () => {
    setForm(initialAluno);
    setModal('new');
  };

  const openEdit = (a) => {
    setForm({ ...a });
    setModal('edit');
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      if (modal === 'new') {
        await api('/alunos', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      } else {
        await api('/alunos/' + form.id_aluno, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      }

      setModal(null);
      notify('Operação realizada com sucesso!');
      load();
    } catch (e) {
      notify(e.message, true);
    }
  };

  const deactivate = async (a) => {
    if (!confirm(`Desativar o aluno ${a.nome}?`)) {
      return;
    }

    try {
      await api('/alunos/' + a.id_aluno + '/desativar', {
        method: 'PATCH'
      });

      notify('Operação realizada com sucesso!');
      load();
    } catch (e) {
      notify(e.message, true);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h2>Gerenciar Alunos</h2>
          <p>
            Cadastro, consulta, edição e desativação de alunos.
          </p>
        </div>

        <button className="primary" onClick={openNew}>
          <Plus size={18} />
          Novo Aluno
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />

          <input
            placeholder="Pesquisar por nome ou CPF"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && load()
            }
          />

          <button onClick={load}>Buscar</button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  Nenhum aluno encontrado!
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id_aluno}>
                  <td>
                    <strong>{a.nome}</strong>
                  </td>

                  <td>{a.cpf}</td>
                  <td>{a.telefone}</td>
                  <td>{a.email}</td>

                  <td>
                    <span
                      className={
                        'badge ' + a.status.toLowerCase()
                      }
                    >
                      {a.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="action edit"
                      title="Editar"
                      onClick={() => openEdit(a)}
                    >
                      <Pencil size={16} />
                    </button>

                    {a.status === 'ATIVO' && (
                      <button
                        className="action ban"
                        title="Desativar"
                        onClick={() => deactivate(a)}
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast msg={msg} error={error} />

      {modal && (
        <Modal
          title={
            modal === 'new'
              ? 'Cadastrar Aluno'
              : 'Editar Aluno'
          }
          onClose={() => setModal(null)}
        >
          <AlunoForm
            form={form}
            setForm={setForm}
            onSubmit={save}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </section>
  );
}

/* =========================
   FORMULÁRIO DE ALUNO
========================= */

function AlunoForm({
  form,
  setForm,
  onSubmit,
  onCancel
}) {
  const field = (
    key,
    label,
    type = 'text',
    full = false
  ) => (
    <label className={full ? 'full' : ''}>
      {label}

      <input
        required
        type={type}
        value={form[key] ?? ''}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: e.target.value
          })
        }
      />
    </label>
  );

  return (
    <form onSubmit={onSubmit} className="form-grid">
      {field('nome', 'Nome completo')}

      {field(
        'cpf',
        'CPF (000.000.000-00)'
      )}

      {field(
        'data_nascimento',
        'Data de nascimento',
        'date'
      )}

      {field('telefone', 'Telefone')}

      {field('email', 'E-mail', 'email')}

      {field('endereco', 'Endereço')}

      {field(
        'historico_saude',
        'Histórico de saúde',
        'text',
        true
      )}

      <div className="form-actions full">
        <button
          type="button"
          className="secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="primary"
          type="submit"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}

/* =========================
   PLANOS
========================= */

function Planos() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initialPlano);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      setItems(
        await api(
          '/planos?q=' +
            encodeURIComponent(q) +
            '&status=' +
            encodeURIComponent(status)
        )
      );
    } catch (e) {
      notify(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  function notify(m, err = false) {
    setMsg(m);
    setError(err);

    setTimeout(() => {
      setMsg('');
    }, 2800);
  }

  const openNew = () => {
    setForm(initialPlano);
    setModal('new');
  };

  const openEdit = (p) => {
    setForm({ ...p });
    setModal('edit');
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      if (modal === 'new') {
        await api('/planos', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      } else {
        await api('/planos/' + form.id_plano, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      }

      setModal(null);
      notify('Operação realizada com sucesso!');
      load();
    } catch (e) {
      notify(e.message, true);
    }
  };

  const deactivate = async (p) => {
    if (!confirm(`Desativar o plano ${p.tipo}?`)) {
      return;
    }

    try {
      await api(
        '/planos/' + p.id_plano + '/desativar',
        {
          method: 'PATCH'
        }
      );

      notify('Operação realizada com sucesso!');
      load();
    } catch (e) {
      notify(e.message, true);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h2>Gerenciar Planos</h2>
          <p>
            Cadastro, consulta, edição e desativação de planos.
          </p>
        </div>

        <button className="primary" onClick={openNew}>
          <Plus size={18} />
          Novo Plano
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />

          <input
            placeholder="Pesquisar por tipo do plano"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && load()
            }
          />

          <button onClick={load}>Buscar</button>
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setTimeout(load, 0);
          }}
        >
          <option value="">
            Todos os status
          </option>

          <option value="ATIVO">
            Ativo
          </option>

          <option value="INATIVO">
            Inativo
          </option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Duração</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  Nenhum resultado encontrado!
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id_plano}>
                  <td>
                    <strong>{p.tipo}</strong>
                  </td>

                  <td>
                    R${' '}
                    {Number(p.valor)
                      .toFixed(2)
                      .replace('.', ',')}
                  </td>

                  <td>
                    {p.duracao}{' '}
                    {p.duracao == 1
                      ? 'dia'
                      : 'dias'}
                  </td>

                  <td>
                    {p.descricao || '—'}
                  </td>

                  <td>
                    <span
                      className={
                        'badge ' +
                        p.status.toLowerCase()
                      }
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="action edit"
                      title="Editar"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil size={16} />
                    </button>

                    {p.status === 'ATIVO' && (
                      <button
                        className="action ban"
                        title="Desativar"
                        onClick={() =>
                          deactivate(p)
                        }
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast msg={msg} error={error} />

      {modal && (
        <Modal
          title={
            modal === 'new'
              ? 'Cadastrar Plano'
              : 'Editar Plano'
          }
          onClose={() => setModal(null)}
        >
          <PlanoForm
            form={form}
            setForm={setForm}
            onSubmit={save}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </section>
  );
}

/* =========================
   FORMULÁRIO DE PLANO
========================= */

function PlanoForm({
  form,
  setForm,
  onSubmit,
  onCancel
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="form-grid"
    >
      <label>
        Tipo do plano

        <input
          required
          value={form.tipo}
          onChange={(e) =>
            setForm({
              ...form,
              tipo: e.target.value
            })
          }
        />
      </label>

      <label>
        Valor (R$)

        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={form.valor}
          onChange={(e) =>
            setForm({
              ...form,
              valor: e.target.value
            })
          }
        />
      </label>

      <label>
        Duração (dias)

        <input
          required
          type="number"
          min="1"
          value={form.duracao}
          onChange={(e) =>
            setForm({
              ...form,
              duracao: e.target.value
            })
          }
        />
      </label>

      <label>
        Status

        <select
          required
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value
            })
          }
        >
          <option value="ATIVO">
            Ativo
          </option>

          <option value="INATIVO">
            Inativo
          </option>
        </select>
      </label>

      <label className="full">
        Descrição

        <input
          value={form.descricao || ''}
          onChange={(e) =>
            setForm({
              ...form,
              descricao: e.target.value
            })
          }
        />
      </label>

      <div className="form-actions full">
        <button
          type="button"
          className="secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="primary"
          type="submit"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}

/* =========================
   APP
========================= */

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Alunos />}
        />

        <Route
          path="/alunos"
          element={<Alunos />}
        />

        <Route
          path="/planos"
          element={<Planos />}
        />
      </Routes>
    </Layout>
  );
}

createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);