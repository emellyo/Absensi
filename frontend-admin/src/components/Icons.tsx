interface IconProps {
  className?: string
}

const base = 'h-5 w-5'

export function BellIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9a6 6 0 1 1 12 0c0 3.1.7 4.9 1.4 5.9.4.6 0 1.4-.7 1.4H5.3c-.7 0-1.1-.8-.7-1.4C5.3 13.9 6 12.1 6 9ZM10 19.5a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function UsersIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3.5 20a8 8 0 0 1 16 0M17.5 4.4a2.6 2.6 0 0 1 0 5.2M20.5 20a5.5 5.5 0 0 0-2.6-4.7" />
    </svg>
  )
}

export function ClipboardIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5h6M9 4.5a1.5 1.5 0 0 0-1.5 1.5H6A1.5 1.5 0 0 0 4.5 7.5v12A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 18 6h-1.5A1.5 1.5 0 0 0 15 4.5M8.5 11.5h7M8.5 15.5h4.5" />
    </svg>
  )
}

export function PlusIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function PencilIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.6 3.9a2.1 2.1 0 0 1 3 3L8.4 18.1l-3.9.9.9-3.9L16.6 3.9Z" />
    </svg>
  )
}

export function UserIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.75" />
    </svg>
  )
}

export function CalendarIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}

export function LogoutIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3-3-3M21 12H10.5" />
    </svg>
  )
}

export function CameraIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8.5h2.6l1.3-2h8.2l1.3 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" />
      <circle cx="12" cy="13.5" r="3.25" />
    </svg>
  )
}

export function LockIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path strokeLinecap="round" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function LoginArrowIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3H18a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21h-7.5M12 15l3-3-3-3M15 12H3.75" />
    </svg>
  )
}

export function SearchIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function CheckCircleIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 12.25 2.5 2.5 5-5.5" />
    </svg>
  )
}

export function AlertIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7.75v5M12 16.1v.05" />
    </svg>
  )
}

export function SunriseIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" d="M12 3v3M5.6 7.6 7.7 9.7M18.4 7.6 16.3 9.7M3 18h18M6 18a6 6 0 0 1 12 0" />
    </svg>
  )
}

export function SunsetIcon({ className = base }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" d="M12 9V6M5.6 11.6 7.7 9.5M18.4 11.6 16.3 9.5M3 18h18M6 18a6 6 0 0 1 12 0" />
    </svg>
  )
}
