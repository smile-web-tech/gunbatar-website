import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { getTeachers } from '@/lib/smm/store'
import type { Teacher } from '@/lib/smm/types'
import { ScrollReveal } from '@/components/ScrollReveal'
import { cn } from '@/lib/utils'

const LEADERSHIP_ROLES = ['Müdir', 'Orunbasar', 'Guramaçy']

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const featured = LEADERSHIP_ROLES.includes(teacher.role)
  return (
    <div
      className={cn(
        'group h-full overflow-hidden rounded-2xl border border-base bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        featured && 'ring-1 ring-accent-200',
      )}
    >
      <div className="aspect-[4/5] overflow-hidden bg-ink-100">
        <img
          src={teacher.photo}
          alt={teacher.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3 text-center sm:p-4">
        <h3 className="text-sm font-bold text-ink-900 sm:text-base">{teacher.name}</h3>
        <p
          className={cn(
            'mt-1 text-xs sm:text-sm',
            featured ? 'font-semibold text-accent-600' : 'text-muted',
          )}
        >
          {teacher.role}
        </p>
      </div>
    </div>
  )
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  function load() {
    setStatus('loading')
    getTeachers()
      .then((t) => {
        setTeachers(t)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }
  useEffect(load, [])

  return (
    <div className="min-h-screen bg-base">
      <header className="bg-alt pb-12 pt-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-5xl"
          >
            Mugallymlarymyz
          </motion.h1>
          <span className="mx-auto mt-4 block h-1 w-20 rounded-full bg-accent-500" />
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Biziň tejribeli we ezber mugallymlarymyz — başarnyklaryňyzy açmak üçin elmydama
            taýýar.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {status === 'loading' ? (
          <div className="flex justify-center py-20">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-ink-200 border-t-accent-500" />
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 py-20 text-muted">
            <p>Mugallymlar ýüklenip bilmedi.</p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              <RefreshCw className="h-4 w-4" /> Gaýtadan synanyş
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {teachers.map((t, i) => (
              <ScrollReveal key={t.id} delay={(i % 5) * 0.05} className="h-full">
                <TeacherCard teacher={t} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
