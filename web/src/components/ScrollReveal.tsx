import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  /** Tag to render as (keeps semantics correct, e.g. 'li', 'section'). */
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Fade + rise into view once, replacing the original site's
 * "customAnimationIn" scroll animations with an accessible, performant version.
 */
export function ScrollReveal({ children, className, delay = 0, as = 'div' }: Props) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}
