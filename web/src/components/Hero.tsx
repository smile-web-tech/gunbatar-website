import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { HERO } from '@/lib/content'
import { scrollToAnchor } from '@/lib/scroll'

/** Typewriter that respects prefers-reduced-motion (shows full text instantly). */
function useTypewriter(text: string, speed = 70) {
  const [out, setOut] = useState('')
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOut(text)
      return
    }
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export function Hero() {
  const typed = useTypewriter(HERO.title)
  const containerRef = useRef<HTMLDivElement>(null)

  // 3D parallax: tilt the layered container toward the cursor (original effect).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const moveX = ((e.clientX - window.innerWidth / 2) * -0.006).toFixed(3)
        const moveY = ((e.clientY - window.innerHeight / 2) * 0.012).toFixed(3)
        el.style.setProperty('--move-x', `${moveX}deg`)
        el.style.setProperty('--move-y', `${moveY}deg`)
      })
    }
    const reset = () => {
      el.style.setProperty('--move-x', '0deg')
      el.style.setProperty('--move-y', '0deg')
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <section className="layers relative">
      <div ref={containerRef} className="layers__container">
        {/* Back: sky / glow */}
        <div
          className="layers__item layer-sky"
          style={{ backgroundImage: 'url(/hero/fony.webp)' }}
          aria-hidden
        />
        {/* Mid: the education center building */}
        <div
          className="layers__item layer-building"
          style={{ backgroundImage: 'url(/hero/bashkent.webp)' }}
          aria-hidden
        />
        {/* Front: floating content */}
        <div className="layer-content px-4">
          <div className="text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl [text-shadow:0_2px_6px_rgba(0,0,0,0.55),0_10px_34px_rgba(0,0,0,0.45)]">
              {typed || ' '}
              <span className="ml-1 inline-block w-[3px] animate-pulse bg-accent-400 align-middle text-transparent">
                |
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-white/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_18px_rgba(0,0,0,0.4)] sm:text-xl">
              {HERO.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#gerek-maglumatlar"
                onClick={(e) => scrollToAnchor('#gerek-maglumatlar', e)}
                className="rounded-full bg-accent-500 px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-accent-600"
              >
                Gerek maglumatlar
              </a>
              <a
                href="#derslerimiz"
                onClick={(e) => scrollToAnchor('#derslerimiz', e)}
                className="rounded-full border border-ink-300 bg-white/85 px-7 py-3 text-base font-semibold text-ink-900 backdrop-blur transition-colors hover:bg-white"
              >
                Okatýan derslerimiz
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#gerek-maglumatlar"
        onClick={(e) => scrollToAnchor('#gerek-maglumatlar', e)}
        aria-label="Aşak"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/90 transition-colors hover:text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </a>
    </section>
  )
}
