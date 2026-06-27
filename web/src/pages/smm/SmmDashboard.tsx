import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckSquare,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  MinusSquare,
  Play,
  Square,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import {
  bulkDeleteMedia,
  categoryLabel,
  deleteMedia,
  getCategories,
  getMedia,
  logout,
  uploadMedia,
} from '@/lib/smm/store'
import type { Category, MediaItem } from '@/lib/smm/types'
import { MediaModal } from '@/components/smm/MediaModal'
import { SmmTeachers } from '@/pages/smm/SmmTeachers'
import { ToastContainer, useToasts } from '@/components/smm/Toast'
import { cn } from '@/lib/utils'

type Pending = { file: File; url: string }

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-base bg-card p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
        {icon}
      </span>
      <div>
        <div className="text-xl font-bold text-ink-900">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </div>
  )
}

/** Map raw API / JS errors to user-friendly Turkmen messages. */
function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)

  // Network / connection errors
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('net::'))
    return 'Internet birikmesi ýok ýa-da serwer jogap bermeýär. Biraz soň gaýtadan synanyşyň.'

  // Timeout
  if (msg.includes('timeout') || msg.includes('Timeout'))
    return 'Serwer wagty geçdi. Biraz soň gaýtadan synanyşyň.'

  // Auth / session
  if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('unauthenticated'))
    return 'Sessiýaňyzyň möhleti gutardy. Täzeden giriň.'

  // Forbidden
  if (msg.includes('403') || msg.toLowerCase().includes('forbidden'))
    return 'Bu hereket üçin rugsadyňyz ýok.'

  // Not found
  if (msg.includes('404') || msg.toLowerCase().includes('not found'))
    return 'Soralan media tapylmady — eýýäm öçürilen bolmagy mümkin.'

  // File too large
  if (msg.includes('413') || msg.toLowerCase().includes('too large') || msg.toLowerCase().includes('size'))
    return 'Faýl gaty uly. Has kiçi faýl ýüklemäge synanyşyň.'

  // Unsupported format
  if (msg.includes('415') || msg.toLowerCase().includes('unsupported'))
    return 'Bu faýl formaty goldanylmaýar. JPG, PNG, WEBP ýa-da MP4 ulanyň.'

  // Server errors (5xx)
  if (msg.includes('500') || msg.includes('502') || msg.includes('503'))
    return 'Serwer säwligi ýüze çykdy. Biraz soň gaýtadan synanyşyň.'

  // If the API already sent a Turkmen message, keep it
  if (/[äöüýňž]/i.test(msg)) return msg

  // Generic fallback
  return 'Näbelli säwlik ýüze çykdy. Gaýtadan synanyşyň.'
}

export function SmmDashboard({ onLogout }: { onLogout: () => void }) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const [filterCat, setFilterCat] = useState('all')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  const [pending, setPending] = useState<Pending[]>([])
  const [uploadCat, setUploadCat] = useState('')
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const [viewing, setViewing] = useState<MediaItem | null>(null)
  const [view, setView] = useState<'media' | 'teachers'>('media')

  // Bulk selection
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // Toast notifications
  const { toasts, toast, dismissToast } = useToasts()

  const loadData = useCallback(() => {
    setLoading(true)
    setLoadError(false)
    Promise.all([getMedia(), getCategories()])
      .then(([m, c]) => {
        setMedia(m)
        setCategories(c)
        setUploadCat(c[0]?.id ?? '')
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        setLoadError(true)
        toast('error', friendlyError(err))
      })
  }, [toast])

  useEffect(loadData, [loadData])

  const stats = useMemo(
    () => ({
      total: media.length,
      images: media.filter((m) => m.type === 'image').length,
      videos: media.filter((m) => m.type === 'video').length,
    }),
    [media],
  )

  const RECENT_COUNT = 24
  const filtered = useMemo(() => {
    let list = media
    if (filterCat === 'recent') list = media.slice(0, RECENT_COUNT)
    else if (filterCat !== 'all') list = media.filter((m) => m.category === filterCat)
    if (filterType !== 'all') list = list.filter((m) => m.type === filterType)
    return list
  }, [media, filterCat, filterType])

  // --- Bulk selection helpers ---

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((m) => m.id)))
    }
  }

  function exitSelectMode() {
    setSelectMode(false)
    setSelected(new Set())
  }

  async function doBulkDelete() {
    if (selected.size === 0) return
    const count = selected.size
    const confirmed = window.confirm(`${count} media pozulsyn?`)
    if (!confirmed) return

    setBulkDeleting(true)
    try {
      const ids = Array.from(selected)
      const { deleted, failed } = await bulkDeleteMedia(ids)
      if (deleted.length > 0) {
        const deletedSet = new Set(deleted)
        setMedia((m) => m.filter((x) => !deletedSet.has(x.id)))
        setSelected((prev) => {
          const next = new Set(prev)
          deleted.forEach((id) => next.delete(id))
          return next
        })
      }
      if (failed.length > 0) {
        toast('error', `${deleted.length} pozuldy, emma ${failed.length} sany pozulyp bilmedi.`)
      } else {
        toast('success', `${deleted.length} media üstünlikli pozuldy.`)
        exitSelectMode()
      }
    } catch (err) {
      toast('error', friendlyError(err))
    } finally {
      setBulkDeleting(false)
    }
  }

  // --- File handling ---

  function addFiles(files: FileList | null) {
    if (!files) return
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
    )
    if (valid.length === 0 && files.length > 0) {
      toast('error', 'Saýlanan faýllar goldanylmaýar. JPG, PNG, WEBP, MP4, WEBM ulanyň.')
      return
    }
    if (valid.length < files.length) {
      toast('info', `${files.length - valid.length} sany goldanylmaýan faýl aýryldy.`)
    }
    const next = valid.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPending((p) => [...p, ...next])
  }

  function removePending(i: number) {
    setPending((p) => {
      URL.revokeObjectURL(p[i].url)
      return p.filter((_, idx) => idx !== i)
    })
  }

  async function doUpload() {
    if (!pending.length || !uploadCat) return
    setUploading(true)
    let successCount = 0
    let failCount = 0
    for (const p of pending) {
      try {
        const item = await uploadMedia({ file: p.file, category: uploadCat, title })
        setMedia((m) => [item, ...m])
        successCount++
      } catch (err) {
        failCount++
        toast('error', `"${p.file.name}" ýüklenip bilmedi: ${friendlyError(err)}`)
      }
    }
    setPending([])
    setTitle('')
    setUploading(false)

    if (successCount > 0 && failCount === 0) {
      toast('success', `${successCount} media üstünlikli ýüklendi.`)
    } else if (successCount > 0 && failCount > 0) {
      toast('info', `${successCount} ýüklendi, ${failCount} başa barmady.`)
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm('Bu medianı pozmaly?')) return
    try {
      await deleteMedia(item.id)
      setMedia((m) => m.filter((x) => x.id !== item.id))
      toast('success', 'Media üstünlikli pozuldy.')
    } catch (err) {
      toast('error', friendlyError(err))
    }
  }

  // --- Select-all state for the header checkbox ---
  const allSelected = filtered.length > 0 && selected.size === filtered.length
  const someSelected = selected.size > 0 && selected.size < filtered.length

  return (
    <div className="min-h-screen bg-alt">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-base bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/images/LOGO.png" alt="" className="h-9 w-auto" />
            <div className="leading-tight">
              <div className="font-display text-sm font-bold text-ink-900">SMM paneli</div>
              <div className="text-xs text-muted">Günbatar Şapagy</div>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-base bg-base p-1">
            <button
              type="button"
              onClick={() => setView('media')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                view === 'media' ? 'bg-accent-500 text-white' : 'text-ink-700 hover:text-accent-600',
              )}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </button>
            <button
              type="button"
              onClick={() => setView('teachers')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                view === 'teachers'
                  ? 'bg-accent-500 text-white'
                  : 'text-ink-700 hover:text-accent-600',
              )}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Mugallymlar</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              logout()
              onLogout()
            }}
            className="flex items-center gap-2 rounded-lg border border-base px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-accent-300 hover:text-accent-600"
          >
            <LogOut className="h-4 w-4" /> Çyk
          </button>
        </div>
      </header>

      {view === 'teachers' ? (
        <SmmTeachers toast={toast} />
      ) : (
        <>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<LayoutGrid className="h-5 w-5" />} label="Jemi media" value={stats.total} />
          <Stat icon={<ImageIcon className="h-5 w-5" />} label="Suratlar" value={stats.images} />
          <Stat icon={<Film className="h-5 w-5" />} label="Wideolar" value={stats.videos} />
          <Stat
            icon={<LayoutGrid className="h-5 w-5" />}
            label="Kategoriýalar"
            value={categories.length}
          />
        </div>

        {/* Upload panel */}
        <section className="mt-8 rounded-2xl border border-base bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-ink-900">Täze media ýükle</h2>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-800">Kategoriýa</label>
                <select
                  value={uploadCat}
                  onChange={(e) => setUploadCat(e.target.value)}
                  className="w-full rounded-xl border border-base bg-base px-3 py-2.5 text-sm text-fg outline-none focus:border-accent-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-800">
                  At (islege görä)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mysal üçin: Mekdep bäsleşigi"
                  className="w-full rounded-xl border border-base bg-base px-3 py-2.5 text-sm text-fg outline-none focus:border-accent-400"
                />
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              addFiles(e.dataTransfer.files)
            }}
            onClick={() => fileInput.current?.click()}
            className={cn(
              'mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors',
              dragOver ? 'border-accent-500 bg-accent-50' : 'border-base bg-base hover:border-accent-300',
            )}
          >
            <Upload className="h-7 w-7 text-accent-500" />
            <p className="text-sm font-medium text-ink-800">
              Surat ýa-da wideo süýräp goýberiň, ýa-da basyp saýlaň
            </p>
            <p className="text-xs text-muted">JPG, PNG, WEBP, MP4, WEBM</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* Pending previews */}
          {pending.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-3">
                {pending.map((p, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-base bg-ink-100"
                  >
                    {p.file.type.startsWith('video/') ? (
                      <div className="flex h-full w-full items-center justify-center bg-ink-800 text-white">
                        <Film className="h-6 w-6" />
                      </div>
                    ) : (
                      <img src={p.url} alt="" className="h-full w-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      className="absolute right-1 top-1 rounded-full bg-ink-900/70 p-0.5 text-white hover:bg-ink-900"
                      aria-label="Aýyr"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={doUpload}
                disabled={uploading}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {pending.length} faýly ýükle
              </button>
            </div>
          )}
        </section>

        {/* Toolbar: Filters + bulk select toggle */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <FilterPill active={filterCat === 'all'} onClick={() => setFilterCat('all')}>
            Hemmesi
          </FilterPill>
          <FilterPill active={filterCat === 'recent'} onClick={() => setFilterCat('recent')}>
            Soňky
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c.id} active={filterCat === c.id} onClick={() => setFilterCat(c.id)}>
              {c.label}
            </FilterPill>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-base sm:block" />
          <FilterPill active={filterType === 'all'} onClick={() => setFilterType('all')}>
            Ählisi
          </FilterPill>
          <FilterPill active={filterType === 'image'} onClick={() => setFilterType('image')}>
            Suratlar
          </FilterPill>
          <FilterPill active={filterType === 'video'} onClick={() => setFilterType('video')}>
            Wideolar
          </FilterPill>

          {/* Bulk select toggle */}
          <span className="mx-1 hidden h-5 w-px bg-base sm:block" />
          <button
            type="button"
            onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
              selectMode
                ? 'border-accent-500 bg-accent-500 text-white'
                : 'border-base bg-card text-ink-700 hover:border-accent-300 hover:text-accent-600',
            )}
          >
            <CheckSquare className="h-4 w-4" />
            {selectMode ? 'Saýlawy ýatyr' : 'Saýla'}
          </button>
        </div>

        {/* Select-all bar (visible in select mode with items) */}
        {selectMode && filtered.length > 0 && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-base bg-card px-4 py-2.5 shadow-sm">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-accent-600"
              aria-label={allSelected ? 'Hemmesini aýyr' : 'Hemmesini saýla'}
            >
              {allSelected ? (
                <CheckSquare className="h-5 w-5 text-accent-500" />
              ) : someSelected ? (
                <MinusSquare className="h-5 w-5 text-accent-400" />
              ) : (
                <Square className="h-5 w-5 text-ink-400" />
              )}
              {allSelected ? 'Hemmesi saýlandy' : 'Hemmesini saýla'}
            </button>
            <span className="text-xs text-muted">
              {selected.size} / {filtered.length} saýlandy
            </span>
          </div>
        )}

        {/* Media grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-accent-500" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
              <p className="text-sm font-medium text-red-800">
                Media ýüklenip bilmedi. Internet birikmeňizi barlaň.
              </p>
              <button
                type="button"
                onClick={loadData}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-600"
              >
                Gaýtadan synanyş
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-muted">Media tapylmady.</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((item) => {
              const isSelected = selected.has(item.id)
              return (
                <div
                  key={item.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border shadow-sm transition-all',
                    selectMode && isSelected
                      ? 'border-accent-500 ring-2 ring-accent-400/40'
                      : 'border-base',
                    'bg-ink-100',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (selectMode) toggleSelect(item.id)
                      else setViewing(item)
                    }}
                    className="block aspect-square w-full"
                    aria-label={
                      selectMode
                        ? `${item.title} — ${isSelected ? 'saýlawy aýyr' : 'saýla'}`
                        : `${item.title} — aç`
                    }
                  >
                    <img
                      src={item.thumb}
                      alt={item.title}
                      loading="lazy"
                      className={cn(
                        'h-full w-full object-cover transition-transform duration-500',
                        !selectMode && 'group-hover:scale-105',
                      )}
                    />
                    {item.type === 'video' && !selectMode && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/55 text-white">
                          <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                        </span>
                      </span>
                    )}

                    {/* Selection checkbox overlay */}
                    {selectMode && (
                      <span
                        className={cn(
                          'absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                          isSelected
                            ? 'bg-accent-500 text-white shadow-sm'
                            : 'border-2 border-white bg-white/70 text-transparent shadow-sm',
                        )}
                      >
                        {isSelected && <CheckSquare className="h-4 w-4" />}
                      </span>
                    )}
                  </button>

                  {/* Badges + delete */}
                  {!selectMode && (
                    <>
                      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-700">
                        {categoryLabel(item.category)}
                      </span>
                      <span
                        className={cn(
                          'pointer-events-none absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white',
                          item.type === 'video' ? 'bg-accent-500' : 'bg-ink-700',
                        )}
                      >
                        {item.type === 'video' ? 'Wideo' : 'Surat'}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        aria-label="Poz"
                        className="absolute bottom-2 right-2 rounded-lg bg-white/90 p-1.5 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating bulk-delete action bar */}
      {selectMode && selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center p-4">
          <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-white px-5 py-3 shadow-2xl">
            <span className="text-sm font-semibold text-ink-800">
              {selected.size} media saýlandy
            </span>
            <button
              type="button"
              onClick={doBulkDelete}
              disabled={bulkDeleting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {bulkDeleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Saýlananlary poz
            </button>
            <button
              type="button"
              onClick={exitSelectMode}
              className="rounded-lg p-2 text-ink-600 transition-colors hover:bg-ink-50"
              aria-label="Saýlawy ýatyr"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
        </>
      )}

      <MediaModal item={viewing} onClose={() => setViewing(null)} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
        active
          ? 'border-accent-500 bg-accent-500 text-white'
          : 'border-base bg-card text-ink-700 hover:border-accent-300 hover:text-accent-600',
      )}
    >
      {children}
    </button>
  )
}
