import { useState } from 'react'
import { Lock, LogIn, ShieldCheck, User } from 'lucide-react'
import { login } from '@/lib/smm/store'

export function SmmLogin({ onAuthed }: { onAuthed: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      onAuthed()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Säwlik ýüze çykdy.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-alt px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/images/LOGO.png" alt="Günbatar Şapagy" className="h-14 w-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">SMM dolandyryş paneli</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <ShieldCheck className="h-4 w-4 text-accent-500" /> Howpsuz gir
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-base bg-card p-6 shadow-sm"
          noValidate
        >
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Ulanyjy ady</label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-base bg-base px-3 focus-within:border-accent-400">
            <User className="h-4 w-4 text-ink-400" />
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-fg outline-none"
              placeholder="admin"
            />
          </div>

          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Açar sözi</label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-base bg-base px-3 focus-within:border-accent-400">
            <Lock className="h-4 w-4 text-ink-400" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-fg outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Gir
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          Demo: <span className="font-semibold">admin</span> / <span className="font-semibold">gunbatar2026</span>
        </p>
      </div>
    </div>
  )
}
