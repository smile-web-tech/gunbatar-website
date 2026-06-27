import { INFO_CARDS } from '@/lib/content'
import { SectionHeading } from '@/components/SectionHeading'
import { SmartLink } from '@/components/SmartLink'
import { ScrollReveal } from '@/components/ScrollReveal'

export function InfoCards() {
  return (
    <section id="gerek-maglumatlar" className="bg-base py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading>Gerek maglumatlaňyzy saýlaň</SectionHeading>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {INFO_CARDS.map((card, i) => (
            <ScrollReveal key={card.label} delay={(i % 4) * 0.08}>
              <SmartLink
                href={card.href}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-base bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lg"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 transition-colors group-hover:bg-accent-100">
                  <img src={card.icon} alt="" aria-hidden className="h-9 w-9 object-contain" />
                </span>
                <span className="text-sm font-semibold text-fg sm:text-base">{card.label}</span>
              </SmartLink>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
