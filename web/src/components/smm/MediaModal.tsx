import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { MediaItem } from '@/lib/smm/types'

/**
 * Lightweight media viewer. The <video> is only rendered while the modal is
 * open and uses preload="metadata" + a poster, so video bytes are fetched only
 * when the admin actually opens a clip (never in the grid).
 */
export function MediaModal({ item, onClose }: { item: MediaItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/85 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Ýapmak"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-6 w-6" />
          </button>
          <motion.div
            className="max-h-[88vh] max-w-5xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                poster={item.thumb}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="max-h-[88vh] w-auto rounded-xl bg-black"
              />
            ) : (
              <img
                src={item.src}
                alt={item.title}
                className="max-h-[88vh] w-auto rounded-xl object-contain"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
