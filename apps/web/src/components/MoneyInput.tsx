import { Controller, type Control, type RegisterOptions } from 'react-hook-form'

interface MoneyInputProps {
  name: string
  control: Control<any>
  rules?: RegisterOptions
  placeholder?: string
  label?: string
  className?: string
}

export default function MoneyInput({
  name,
  control,
  rules,
  placeholder = '0.00',
  label,
  className = '',
}: MoneyInputProps) {
  const sanitizeAndClamp = (raw: string) => {
    if (!raw) return ''
    let cleaned = raw.replace(/[^0-9.]/g, '')

    const parts = cleaned.split('.')
    const hasDecimal = parts.length > 1
    const intPart = parts[0].slice(0, 6) // max 6 digits
    let decPart = parts[1] ?? ''
    if (decPart.length > 2) decPart = decPart.slice(0, 2)

    let candidate = hasDecimal ? `${intPart}.${decPart}` : intPart
    if (candidate.startsWith('.')) candidate = '0' + candidate

    const numeric = Number(candidate || 0)
    if (!Number.isFinite(numeric)) return ''
    if (numeric > 100000) {
      candidate = hasDecimal ? `100000.${decPart}` : '100000'
    }

    candidate = candidate.replace(/^0+(?=\\d)/, '')
    return candidate
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const displayValue = field.value ?? ''

        return (
          <div className={`flex flex-col ${className}`}>
            {label ? (
              <label className="mb-2 text-sm font-medium text-gray-700">
                {label}
              </label>
            ) : null}

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
                $
              </span>

              <input
                inputMode="decimal"
                className="w-full h-16 text-2xl placeholder:text-2xl pl-12 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                placeholder={placeholder}
                value={displayValue}
                onChange={(e) => {
                  const typed = e.target.value.replace(/\$/g, '')
                  const sanitized = sanitizeAndClamp(typed)
                  field.onChange(sanitized) // keep as string always
                }}
              />
            </div>

            {fieldState?.error ? (
              <p className="mt-2 text-sm text-red-600">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        )
      }}
    />
  )
}
