import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  icon?: ReactNode
}

export function Field({
  label,
  hint,
  error,
  icon,
  className = '',
  ...props
}: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -tranink-y-1/2 text-ink-400">
            {icon}
          </span>
        )}
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink-800 transition-colors duration-200 placeholder:text-ink-400 disabled:bg-ink-50 disabled:text-ink-500 ${icon ? 'pl-10' : ''} ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-ink-300 focus:border-brand-500'
          } ${className}`}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
