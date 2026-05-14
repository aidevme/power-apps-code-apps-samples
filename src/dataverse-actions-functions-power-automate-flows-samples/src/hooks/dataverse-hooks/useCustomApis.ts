// AI-CONTEXT: Hook for loading Custom API records from Dataverse — supports filtering by binding type and function/action type.
// AI-FILE-RELATIONS:
//   - service:  src/generated/services/CustomapisService.ts   (PAC-generated SDK client — do not edit)
//   - model:    src/generated/models/CustomapisModel.ts       (Customapis, CustomapisBase types)
//   - consumer: src/components/apps/ (Custom APIs explorer app)
// AI-CONSTRAINT: Never call CustomapisService directly from components — all data flows through this hook.
// AI-PATTERN: Load-on-mount with manual reload; expose loading/error state and a reload callback.

import { useState, useEffect } from 'react'
import { CustomapisService } from '../../generated/services/CustomapisService'
import type { Customapis } from '../../generated/models/CustomapisModel'

/** OData `orderBy` clause applied to all Custom API queries. */
const DEFAULT_SORT_ORDER = 'uniquename asc'

/** Maximum number of Custom API records to load per query. */
const MAX_CUSTOM_APIS_TO_LOAD = 500

/** Return value of the {@link useCustomApis} hook. */
export interface IUseCustomApisResult {
  /** All Custom API records loaded from Dataverse. Empty array while loading or on error. */
  customApis: Customapis[]
  /** Whether the initial or reload fetch is in progress. */
  loading: boolean
  /** Error message if the last fetch failed, or `null` on success. */
  error: string | null
  /** Re-fetches all Custom API records. Useful for pull-to-refresh patterns. */
  reload: () => void
}

/**
 * Loads all Custom API records from the Dataverse `customapis` table via {@link CustomapisService.getAll}.
 *
 * @remarks
 * Dataverse table: `customapi` (OData collection: `customapis`)
 * Sorted by `uniquename asc`. Loads up to 500 records per fetch.
 * Includes both actions (`isfunction eq false`) and functions (`isfunction eq true`).
 *
 * @returns {@link IUseCustomApisResult} containing `customApis`, `loading`, `error`, and `reload`.
 *
 * @example
 * ```tsx
 * const { customApis, loading, error, reload } = useCustomApis()
 * if (loading) return <Spinner />
 * if (error) return <div>{error} <button onClick={reload}>Retry</button></div>
 * return <ul>{customApis.map(api => <li key={api.customapiid}>{api.uniquename}</li>)}</ul>
 * ```
 */
export function useCustomApis(): IUseCustomApisResult {
  const [customApis, setCustomApis] = useState<Customapis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await CustomapisService.getAll({
          orderBy: [DEFAULT_SORT_ORDER],
          top: MAX_CUSTOM_APIS_TO_LOAD,
        })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getAll returned a failure result'
          console.error('useCustomApis:', message, result.error)
          setError(message)
          return
        }
        setCustomApis(result.data ?? [])
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useCustomApis: failed to load custom APIs', message)
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    doFetch()
    return () => { cancelled = true }
  }, [attempt])

  return {
    customApis,
    loading,
    error,
    reload: () => setAttempt(n => n + 1),
  }
}
