import type { MouseEvent } from 'react'

/**
 * Smoothly scroll to an in-page anchor (e.g. "#faq"), accounting for the fixed
 * navbar height. Returns true if it handled an anchor (so callers can skip
 * default navigation), false for real routes/external links.
 */
export function scrollToAnchor(href: string, e?: MouseEvent): boolean {
  if (!href.startsWith('#')) return false
  const el = document.querySelector(href)
  if (!el) return false
  e?.preventDefault()
  const navOffset = 88
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', href)
  return true
}
