/* eslint-disable react-refresh/only-export-components */

export const inputClassName =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gold disabled:cursor-not-allowed disabled:opacity-70 dark:border-navy-lighter dark:bg-navy dark:text-gray-100'

export const labelClassName = 'grid gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100'

export const errorClassName = 'text-xs font-medium text-red-500'

export const requiredError = (value, message) => (!String(value || '').trim() ? message : '')

export const toNullableString = (value) => {
  const trimmed = String(value || '').trim()
  return trimmed || null
}

export const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  return Number(value)
}

export const toNumberOrZero = (value) => Number(value || 0)

export const normalizeSkillGroups = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (!data || typeof data !== 'object') {
    return []
  }

  return Object.values(data).flatMap((skills) => (Array.isArray(skills) ? skills : []))
}

export function TextField({
  as: Component = 'input',
  error,
  label,
  name,
  onChange,
  ...props
}) {
  return (
    <label className={labelClassName}>
      {label}
      <Component
        className={inputClassName}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        {...props}
      />
      {error ? <span className={errorClassName}>{error}</span> : null}
    </label>
  )
}
