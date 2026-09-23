import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-ink-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function CardHeader({
  title,
  description,
  icon,
  action,
}: CardHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="mt-0.5 rounded-lg bg-brand-50 p-2 text-brand-600">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-ink-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-ink-500">{description}</p>
          )}
        </div>
      </div>
      {action}
    </header>
  )
}
