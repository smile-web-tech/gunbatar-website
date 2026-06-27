import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FAQ } from '@/lib/content'
import { SectionHeading } from '@/components/SectionHeading'
import { cn } from '@/lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-base py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading>Köp soralýan soraglar</SectionHeading>

        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-base bg-card shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-fg sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-accent-500 transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
