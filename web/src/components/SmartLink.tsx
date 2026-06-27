import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { scrollToAnchor } from '@/lib/scroll'
import { cn } from '@/lib/utils'

type Props = {
  href: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
}

/**
 * One link component for three cases:
 *  - "#anchor"  -> smooth-scroll on the current page (if on home), or
 *                  navigate to home + anchor (if on another page)
 *  - "/route"   -> client-side SPA navigation (react-router)
 *  - everything else (http, .html, mailto, tel) -> a plain <a>
 */
export function SmartLink({ href, children, className, onNavigate }: Props) {
  const { pathname } = useLocation()
  const isAnchor = href.startsWith('#')
  const isExternal =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.endsWith('.html')

  if (isAnchor) {
    const isHome = pathname === '/'

    if (isHome) {
      // On the home page — smooth-scroll to the anchor directly
      return (
        <a
          href={href}
          className={cn(className)}
          onClick={(e) => {
            scrollToAnchor(href, e)
            onNavigate?.()
          }}
        >
          {children}
        </a>
      )
    }

    // On another page — navigate to the home page with the anchor hash
    return (
      <Link to={`/${href}`} className={cn(className)} onClick={onNavigate}>
        {children}
      </Link>
    )
  }

  if (isExternal) {
    const props =
      href.startsWith('http')
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {}
    return (
      <a href={href} className={cn(className)} onClick={onNavigate} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={cn(className)} onClick={onNavigate}>
      {children}
    </Link>
  )
}
