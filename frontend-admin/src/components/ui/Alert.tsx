import { AlertIcon, CheckCircleIcon } from '../Icons'

interface AlertProps {
  tone: 'success' | 'error'
  message: string
}

export function Alert({ tone, message }: AlertProps) {
  const isSuccess = tone === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon className="h-5 w-5 shrink-0" />
      ) : (
        <AlertIcon className="h-5 w-5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}
