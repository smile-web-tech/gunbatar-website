import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  variant: ToastVariant
  text: string
}

const ICON = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const

const STYLE = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
} as const

const ICON_COLOR = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-sky-500',
} as const

const AUTO_DISMISS_MS = {
  success: 4000,
  error: 6000,
  info: 5000,
} as const

let _nextId = 0

/**
 * Hook that provides `toast()` push and the current toast list.
 *
 * Usage:
 * ```tsx
 * const { toasts, toast, dismissToast } = useToasts()
 * toast('error', 'Ýüklemek başa barmady.')
 * ```
 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (variant: ToastVariant, text: string) => {
      const id = `toast-${++_nextId}`
      setToasts((t) => [...t, { id, variant, text }])
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS[variant])
    },
    [dismissToast],
  )

  return { toasts, toast, dismissToast }
}

/**
 * Render this once in the dashboard layout. It stacks toasts bottom-right.
 */
export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2.5 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast: t, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const Icon = ICON[t.variant]

  // Auto-dismiss via parent timeout, but also allow manual close.
  useEffect(() => {
    // parent handles auto-dismiss, this is just cleanup guard
    return () => {}
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'pointer-events-auto flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
        STYLE[t.variant],
      )}
      role="alert"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_COLOR[t.variant])} />
      <p className="flex-1 text-sm font-medium leading-snug">{t.text}</p>
      <button
        type="button"
        onClick={() => onDismiss(t.id)}
        className="mt-0.5 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Ýapmak"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
