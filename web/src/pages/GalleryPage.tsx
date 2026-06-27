import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImageOff, Play, RefreshCw, ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import { getCategories, getMedia } from '@/lib/smm/store'
import type { Category, MediaItem } from '@/lib/smm/types'
import { cn } from '@/lib/utils'

const RECENT_COUNT = 24

/** Bento tile sizing — featured tiles span extra columns/rows. */
const TILE_SIZE = {
  normal: '',
  wide: 'sm:col-span-2',
  tall: 'row-span-2',
  big: 'col-span-2 row-span-2',
} as const

function tileSize(index: number, item: MediaItem): keyof typeof TILE_SIZE {
  const ar = item.w / item.h || 1
  // Videos are landscape and eye-catching — let them go wide.
  if (item.type === 'video') return index % 4 === 0 ? 'big' : 'wide'
  const slot = index % 12
  if (slot === 0) return 'big'
  if ((slot === 5 || slot === 11) && ar >= 1.2) return 'wide'
  if ((slot === 3 || slot === 8) && ar <= 0.85) return 'tall'
  return 'normal'
}

function videoMime(src: string): string {
  if (src.endsWith('.webm')) return 'video/webm'
  if (src.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}

/** Grid video that autoplays (muted, looped) only while in view — dynamic but light. */
function GridVideo({ item }: { item: MediaItem }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={item.src}
      poster={item.thumb}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}

function Tile({ item, index, onOpen }: { item: MediaItem; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const isVideo = item.type === 'video'
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${item.title} — ${isVideo ? 'wideony aç' : 'suraty ulalt'}`}
      className={cn(
        'group relative block h-full w-full overflow-hidden rounded-2xl border border-base bg-ink-100 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
        TILE_SIZE[tileSize(index, item)],
      )}
    >
      {isVideo ? (
        <GridVideo item={item} />
      ) : (
        <img
          src={item.thumb}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500 group-hover:scale-105',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {/* Hover overlay (flat, no gradient) */}
      <span className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/35">
        {isVideo ? (
          <Play className="h-10 w-10 text-white opacity-90 [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.5))]" fill="currentColor" />
        ) : (
          <ZoomIn className="h-9 w-9 scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
        )}
      </span>
      {isVideo && (
        <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Wideo
        </span>
      )}
    </button>
  )
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [activeId, setActiveId] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  function load() {
    setStatus('loading')
    Promise.all([getMedia(), getCategories()])
      .then(([m, c]) => {
        setMedia(m)
        setCats(c)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }
  useEffect(load, [])

  const tabs = useMemo(
    () => [{ id: 'all', label: 'Hemmesi' }, { id: 'recent', label: 'Soňky suratlar' }, ...cats],
    [cats],
  )

  const list = useMemo(() => {
    if (activeId === 'recent') return media.slice(0, RECENT_COUNT)
    if (activeId === 'all') return media
    return media.filter((m) => m.category === activeId)
  }, [media, activeId])

  const slides = useMemo(
    () =>
      list.map((m) =>
        m.type === 'video'
          ? {
              type: 'video' as const,
              poster: m.thumb,
              width: m.w,
              height: m.h,
              autoPlay: true,
              sources: [{ src: m.src, type: videoMime(m.src) }],
            }
          : { src: m.src, description: m.title },
      ),
    [list],
  )

  return (
    <div className="min-h-screen bg-base">
      <header className="bg-alt pb-10 pt-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-5xl"
          >
            Gallereýa &amp; arhiw
          </motion.h1>
          <span className="mx-auto mt-4 block h-1 w-20 rounded-full bg-accent-500" />
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Biziň şatlykly pursatlarymyz, dabaralarymyz we ýatdan çykmajak günlerimiz —
            <span className="font-semibold text-ink-800"> {media.length} media</span>.
          </p>
        </div>
      </header>

      {/* Sticky category filter (single scroll-row on mobile) */}
      <div className="sticky top-16 z-30 border-y border-base bg-base/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-6 sm:py-3 [&::-webkit-scrollbar]:hidden">
          {tabs.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={cn(
                'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm',
                cat.id === activeId
                  ? 'border-accent-500 bg-accent-500 text-white'
                  : 'border-base bg-card text-ink-700 hover:border-accent-300 hover:text-accent-600',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {status === 'loading' ? (
          <div className="flex justify-center py-24">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-ink-200 border-t-accent-500" />
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 py-24 text-muted">
            <p>Media ýüklenip bilmedi.</p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              <RefreshCw className="h-4 w-4" /> Gaýtadan synanyş
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid auto-rows-[120px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[150px] sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:auto-rows-[170px] xl:grid-cols-6"
            >
              {list.length === 0 ? (
                <div className="col-span-full flex flex-col items-center gap-3 py-20 text-muted">
                  <ImageOff className="h-10 w-10" />
                  <p>Bu kategoriýada media ýok.</p>
                </div>
              ) : (
                list.map((item, i) => (
                  <Tile key={item.id} item={item} index={i} onOpen={() => setLightboxIndex(i)} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Video]}
        video={{ autoPlay: true, controls: true, playsInline: true, loop: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: 'rgba(20, 18, 15, 0.92)' } }}
      />
    </div>
  )
}
