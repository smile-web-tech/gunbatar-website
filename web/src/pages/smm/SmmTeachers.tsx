import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, UserPlus, X } from 'lucide-react'
import { createTeacher, deleteTeacher, getTeachers } from '@/lib/smm/store'
import type { Teacher } from '@/lib/smm/types'

type Toast = (type: 'success' | 'error' | 'info', message: string) => void

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : 'Säwlik ýüze çykdy.'
}

export function SmmTeachers({ toast }: { toast: Toast }) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getTeachers()
      .then(setTeachers)
      .catch((e) => toast('error', errMsg(e)))
      .finally(() => setLoading(false))
  }, [toast])

  function pickPhoto(file: File | null) {
    if (preview) URL.revokeObjectURL(preview)
    if (file && file.type.startsWith('image/')) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    } else if (file) {
      toast('error', 'Diňe surat saýlaň.')
    }
  }

  function resetForm() {
    if (preview) URL.revokeObjectURL(preview)
    setName('')
    setRole('')
    setPhoto(null)
    setPreview('')
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) return toast('error', 'Mugallymyň suratyny saýlaň.')
    if (!name.trim()) return toast('error', 'Mugallymyň adyny ýazyň.')
    setSaving(true)
    try {
      const t = await createTeacher({ photo, name: name.trim(), role: role.trim() })
      setTeachers((prev) => [...prev, t])
      resetForm()
      toast('success', 'Mugallym goşuldy.')
    } catch (err) {
      toast('error', errMsg(err))
    } finally {
      setSaving(false)
    }
  }

  async function remove(t: Teacher) {
    if (!window.confirm(`"${t.name}" pozulsyn?`)) return
    try {
      await deleteTeacher(t.id)
      setTeachers((prev) => prev.filter((x) => x.id !== t.id))
      toast('success', 'Mugallym pozuldy.')
    } catch (err) {
      toast('error', errMsg(err))
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Add teacher */}
      <section className="rounded-2xl border border-base bg-card p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
          <UserPlus className="h-5 w-5 text-accent-500" /> Täze mugallym goş
        </h2>
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
          {/* Photo picker */}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="relative flex h-40 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-base bg-base text-muted transition-colors hover:border-accent-300"
          >
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <span className="flex flex-col items-center gap-1 px-2 text-center text-xs">
                <ImagePlus className="h-6 w-6 text-accent-500" />
                Surat saýla
              </span>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickPhoto(e.target.files?.[0] ?? null)}
            />
          </button>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-800">Ady</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Meselem: Kerwen Baýlyýew"
                  className="w-full rounded-xl border border-base bg-base px-3 py-2.5 text-sm text-fg outline-none focus:border-accent-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-800">Wezipesi</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Meselem: Iňlis dili mugallym"
                  className="w-full rounded-xl border border-base bg-base px-3 py-2.5 text-sm text-fg outline-none focus:border-accent-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Goş
              </button>
              {(name || role || photo) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 rounded-xl border border-base px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  <X className="h-4 w-4" /> Arassala
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* Teachers grid */}
      <div className="mt-8">
        <h2 className="mb-5 text-lg font-bold text-ink-900">
          Mugallymlar <span className="text-muted">({teachers.length})</span>
        </h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-accent-500" />
          </div>
        ) : teachers.length === 0 ? (
          <p className="py-16 text-center text-muted">Mugallym ýok.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="group relative overflow-hidden rounded-2xl border border-base bg-card shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden bg-ink-100">
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="truncate text-sm font-bold text-ink-900">{t.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted">{t.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(t)}
                  aria-label="Poz"
                  className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
