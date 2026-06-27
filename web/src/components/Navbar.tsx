import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/content'
import { SmartLink } from '@/components/SmartLink'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4">
      <nav
        className={cn(
          'w-full max-w-6xl rounded-b-2xl border border-t-0 transition-all duration-300',
          scrolled
            ? 'border-ink-100 bg-white/95 shadow-md backdrop-blur'
            : 'border-ink-100/70 bg-white/85 shadow-sm backdrop-blur',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Günbatar Şapagy">
          <img
            src="/images/LOGO.png"
            alt="Günbatar Şapagy"
            className="h-10 w-auto"
            width={140}
            height={40}
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <SmartLink
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-accent-50 hover:text-accent-600"
              >
                <img src={item.icon} alt="" aria-hidden className="h-4 w-4 object-contain" />
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menýu"
          className="rounded-lg p-2 text-ink-800 transition-colors hover:bg-ink-50 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-900/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-white p-5 shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <img src="/images/LOGO.png" alt="" className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Ýapmak"
                  className="rounded-lg p-2 text-ink-800 hover:bg-ink-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <SmartLink
                      href={item.href}
                      onNavigate={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-accent-50 hover:text-accent-600"
                    >
                      <img src={item.icon} alt="" aria-hidden className="h-5 w-5 object-contain" />
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
