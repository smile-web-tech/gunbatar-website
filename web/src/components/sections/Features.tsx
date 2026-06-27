import { Check } from 'lucide-react'
import { FEATURES } from '@/lib/content'
import { SectionHeading } from '@/components/SectionHeading'
import { ScrollReveal } from '@/components/ScrollReveal'
import { scrollToAnchor } from '@/lib/scroll'

export function Features() {
  return (
    <section id="mumkinchilik" className="bg-base py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading>Aýratynlyklarymyz</SectionHeading>

        <div className="grid gap-6 lg:grid-cols-3">
          {FEATURES.map((block, i) => (
            <ScrollReveal key={block.title} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-base bg-card p-6 shadow-sm transition-shadow hover:shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-ink-900">{block.title}</h3>
                <ul className="mb-6 flex flex-1 flex-col gap-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-fg sm:text-base">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => scrollToAnchor('#contact', e)}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
                >
                  Ýazylmak
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
