import { useState } from 'react'
import { RotateCw } from 'lucide-react'
import { COURSES, type Course } from '@/lib/content'
import { SectionHeading } from '@/components/SectionHeading'
import { ScrollReveal } from '@/components/ScrollReveal'
import { scrollToAnchor } from '@/lib/scroll'
import { cn } from '@/lib/utils'

function CourseCard({ course }: { course: Course }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="h-full [perspective:1400px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${course.label} — maglumat`}
        className="group relative block aspect-[4/5] w-full rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
      >
        <div
          className={cn(
            'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          {/* Front: image + label */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-base bg-card shadow-sm [backface-visibility:hidden]">
            <img
              src={course.image}
              alt={course.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-white/95 px-3 py-2.5">
              <h3 className="text-sm font-semibold text-fg sm:text-base">{course.label}</h3>
              <RotateCw className="h-4 w-4 shrink-0 text-accent-500 transition-transform group-hover:rotate-90" />
            </div>
          </div>

          {/* Back: course info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-accent-500 p-5 text-center text-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <h3 className="text-base font-bold sm:text-lg">{course.label}</h3>
            <p className="mt-3 text-xs leading-relaxed text-white/95 sm:text-sm">{course.desc}</p>
            <span
              role="link"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                scrollToAnchor('#contact')
              }}
              className="mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-accent-600 transition-colors hover:bg-accent-50"
            >
              Ýazylmak
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

export function Courses() {
  return (
    <section id="derslerimiz" className="bg-alt py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading>Okatýan derslerimiz</SectionHeading>
        <p className="-mt-6 mb-10 text-center text-sm text-muted">
          Kart üstüne basyň — dersiň maglumaty
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COURSES.map((course, i) => (
            <ScrollReveal key={course.label} delay={(i % 4) * 0.06} className="h-full">
              <CourseCard course={course} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
