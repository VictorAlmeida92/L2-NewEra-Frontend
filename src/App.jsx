import { useEffect, useState } from 'react'

const apiUrl = (import.meta.env.VITE_ACCOUNT_API_URL || '').replace(/\/$/, '')

function App() {
  const [mode, setMode] = useState('register')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [apiOnline, setApiOnline] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!apiUrl) return

    fetch(`${apiUrl}/api/account/health`)
      .then((response) => {
        if (!response.ok) throw new Error('API indisponível')
        return response.json()
      })
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

  function changeMode(nextMode) {
    setMode(nextMode)
    setMessage('')
    setConfirmation('')
  }

  async function submit(event) {
    event.preventDefault()
    setMessage('')

    if (!apiUrl) {
      setMessage('A API ainda não foi configurada neste ambiente.')
      return
    }
    if (mode === 'register' && password !== confirmation) {
      setMessage('As senhas não conferem.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${apiUrl}/api/account/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.message || 'Não foi possível concluir a operação.')
      }

      if (mode === 'login' && payload.accessToken) {
        sessionStorage.setItem('l2newera.accountToken', payload.accessToken)
      }
      setMessage(payload.message || (mode === 'register' ? 'Conta criada.' : 'Login realizado.'))
      if (mode === 'register') {
        setMode('login')
        setConfirmation('')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro de comunicação com a API.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">LINEAGE2 NEWERA</p>
        <h1>Seu mundo começa aqui.</h1>
        <p className="hero-copy">
          Crie e gerencie sua conta do servidor com segurança. O portal não
          acessa o banco do jogo diretamente.
        </p>
        <div className="status-pill">
          <span className={apiOnline ? 'status-dot online' : 'status-dot'} />
          {apiOnline ? 'API local online' : apiUrl ? 'API configurada, aguardando resposta' : 'API não configurada'}
        </div>
      </section>

      <section className="card" aria-labelledby="account-title">
        <div className="tabs" role="tablist" aria-label="Conta">
          <button
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => changeMode('register')}
            role="tab"
            aria-selected={mode === 'register'}
          >
            Criar conta
          </button>
          <button
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => changeMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Entrar
          </button>
        </div>

        <h2 id="account-title">
          {mode === 'register' ? 'Crie sua conta' : 'Acesse sua conta'}
        </h2>
        <p className="muted">
          {mode === 'register'
            ? 'Teste local conectado à Account API e ao PostgreSQL do ambiente.'
            : 'O login web usa uma sessão própria, separada do protocolo do jogo.'}
        </p>

        <form onSubmit={submit}>
          <label>
            Login
            <input type="text" placeholder="Seu login" autoComplete="username" value={login} onChange={(event) => setLogin(event.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" placeholder="Mínimo de 8 caracteres" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {mode === 'register' && (
            <label>
              Confirmar senha
              <input type="password" placeholder="Repita a senha" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
            </label>
          )}
          <button className="primary-button" type="submit" disabled={submitting || !apiUrl}>
            {submitting ? 'Aguarde...' : mode === 'register' ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        {message && <p className="security-note" role="status">{message}</p>}

        <p className="security-note">
          Este teste envia somente login e senha para a Account API configurada.
          Nenhuma credencial do banco é enviada ao navegador.
        </p>
      </section>
    </main>
  )
}

export default App
