import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { GALLERY_PROMO_SLIDES } from '@/lib/content'

export function GalleryPromo() {
  const [index, setIndex] = useState(0)
  const count = GALLERY_PROMO_SLIDES.length
  const slide = GALLERY_PROMO_SLIDES[index]

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count)

  // Auto-advance every 5s (paused while the tab is hidden).
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count)
    }, 5000)
    return () => clearInterval(id)
  }, [count])

  // Preload all slide images so transitions don't flash.
  useEffect(() => {
    GALLERY_PROMO_SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [])

  return (
    <section id="gallery-promo" className="relative overflow-hidden">
      {/* Per-slide photo background (cross-faded) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          aria-hidden
        />
      </AnimatePresence>
      {/* Flat scrim (solid, not a gradient) for text legibility */}
      <div className="absolute inset-0 bg-ink-900/55" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-4xl flex-col items-center justify-center px-4 py-28 text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="font-display text-2xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            {slide.title}
          </motion.h2>
        </AnimatePresence>

        <Link
          to="/galereya"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-accent-600"
        >
          Gallereýa &amp; arhiw
          <ArrowRight className="h-5 w-5" />
        </Link>

        {/* Dots */}
        <div className="mt-10 flex items-center gap-2">
          {GALLERY_PROMO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slaýd ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? 'h-2.5 w-6 rounded-full bg-accent-500 transition-all'
                  : 'h-2.5 w-2.5 rounded-full bg-white/50 transition-all hover:bg-white/80'
              }
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Öňki"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 sm:left-6"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Indiki"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 sm:right-6"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  )
}
