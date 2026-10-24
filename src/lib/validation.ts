/** Shared, framework-free form validation helpers. */

export type FieldErrors<T extends string> = Partial<Record<T, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function requiredError(value: string, label: string): string | undefined {
  return isBlank(value) ? `${label} is required.` : undefined
}

export function minLengthError(value: string, min: number, label: string): string | undefined {
  if (isBlank(value)) return undefined
  return value.trim().length < min ? `${label} must be at least ${min} characters.` : undefined
}

export function maxLengthError(value: string, max: number, label: string): string | undefined {
  return value.trim().length > max ? `${label} must be ${max} characters or fewer.` : undefined
}

export function emailError(value: string): string | undefined {
  if (isBlank(value)) return 'Email address is required.'
  return EMAIL_PATTERN.test(value.trim()) ? undefined : 'Enter a valid email address, e.g. name@example.com.'
}

/**
 * URLs are accepted with or without a protocol. Anything that cannot be parsed
 * as an http(s) location is rejected.
 */
export function urlError(value: string): string | undefined {
  if (isBlank(value)) return undefined

  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`

  try {
    const parsed = new URL(candidate)
    const looksLikeHost = parsed.hostname.includes('.') && !parsed.hostname.endsWith('.')
    return looksLikeHost ? undefined : 'Enter a valid URL, e.g. https://your-portfolio.com'
  } catch {
    return 'Enter a valid URL, e.g. https://your-portfolio.com'
  }
}

/** Returns the first defined error for a field, or undefined when it is valid. */
export function firstError(...checks: Array<string | undefined>): string | undefined {
  return checks.find((check) => typeof check === 'string')
}

/** True when a `FieldErrors` record contains no messages. */
export function isClean<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).every((error) => !error)
}
