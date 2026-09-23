import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'brand' | 'warning'

const TONES: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-600',
  success: 'bg-emerald-50 text-emerald-700',
  brand: 'bg-brand-50 text-brand-700',
  warning: 'bg-amber-50 text-amber-700',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
