import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  accent?: boolean
  className?: string
}

/** Centered section title with the brand's underline accent. */
export function SectionHeading({ children, accent, className }: Props) {
  return (
    <div className={cn('mb-10 text-center', className)}>
      <h2
        className={cn(
          'font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl',
          accent ? 'text-accent-500' : 'text-fg',
        )}
      >
        {children}
      </h2>
      <span className="mx-auto mt-4 block h-1 w-20 rounded-full bg-accent-500" />
    </div>
  )
}
