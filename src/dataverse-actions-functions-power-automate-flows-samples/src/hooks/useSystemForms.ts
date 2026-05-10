import { useState, useEffect, useCallback } from 'react'
import { SystemformsService } from '../generated/services/SystemformsService'
import type { Systemforms } from '../generated/models/SystemformsModel'

/** Result returned by {@link useSystemForms}. */
export interface IUseSystemFormsResult {
  /** System form records, optionally scoped to one entity. */
  systemForms: Systemforms[]
  /** Whether data is currently loading. */
  loading: boolean
  /** Error from the last failed fetch, or `null`. */
  error: Error | null
  /** Re-fetches system forms. */
  reload: () => void
}

/**
 * Loads Dataverse system forms, ordered by form type then name.
 *
 * @param objecttypecode - Optional entity logical name (e.g. `'account'`) to
 *   further filter results to forms belonging to that entity.
 * @returns System form records, loading state, error state, and a `reload` callback.
 *
 * @example
 * ```ts
 * const { systemForms, loading, error, reload } = useSystemForms('account')
 * ```
 */
export function useSystemForms(objecttypecode?: string): IUseSystemFormsResult {
  const [systemForms, setSystemForms] = useState<Systemforms[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const reload = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const filter = objecttypecode ? `objecttypecode eq '${objecttypecode}'` : undefined
    void SystemformsService.getAll({ filter, orderBy: ['type asc', 'name asc'] })
      .then(result => {
        if (cancelled) return
        if (!result.success) throw new Error('Failed to load system forms')
        setSystemForms(result.data ?? [])
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [objecttypecode, refreshKey])

  return { systemForms, loading, error, reload }
}
