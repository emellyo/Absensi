interface AvatarProps {
  name: string
  src: string | null
  size?: 'md' | 'xl'
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const SIZES = {
  md: 'h-11 w-11 text-sm',
  xl: 'h-24 w-24 text-2xl sm:h-28 sm:w-28',
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`Foto ${name}`}
        className={`${SIZES[size]} shrink-0 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-ink-200`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ring-1 ring-brand-200`}
    >
      {initials(name)}
    </span>
  )
}
