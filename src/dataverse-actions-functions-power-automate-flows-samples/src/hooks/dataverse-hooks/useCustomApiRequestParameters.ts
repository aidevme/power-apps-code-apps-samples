// AI-CONTEXT: Hook for loading Custom API Request Parameter records from Dataverse, optionally filtered by parent Custom API ID.
// AI-FILE-RELATIONS:
//   - service:  src/generated/services/CustomapirequestparametersService.ts  (PAC-generated SDK client — do not edit)
//   - model:    src/generated/models/CustomapirequestparametersModel.ts       (Customapirequestparameters types)
//   - sibling:  src/hooks/useCustomApis.ts                                    (parent Custom API records)
//   - consumer: src/components/apps/ (Custom APIs explorer app)
// AI-CONSTRAINT: Never call CustomapirequestparametersService directly from components — all data flows through this hook.
// AI-PATTERN: Load-on-mount with optional customApiId filter; re-fetches when customApiId changes.

import { useState, useEffect } from 'react'
import { CustomapirequestparametersService } from '../../generated/services/CustomapirequestparametersService'
import type { Customapirequestparameters } from '../../generated/models/CustomapirequestparametersModel'

/** OData `orderBy` clause applied to all request parameter queries. */
const DEFAULT_SORT_ORDER = 'uniquename asc'

/** Maximum number of request parameter records to load per query. */
const MAX_REQUEST_PARAMETERS_TO_LOAD = 500

/** Return value of the {@link useCustomApiRequestParameters} hook. */
export interface IUseCustomApiRequestParametersResult {
  /** All request parameter records loaded from Dataverse. Empty array while loading or on error. */
  requestParameters: Customapirequestparameters[]
  /** Whether the initial or reload fetch is in progress. */
  loading: boolean
  /** Error message if the last fetch failed, or `null` on success. */
  error: string | null
  /** Re-fetches the request parameter records. Useful for pull-to-refresh patterns. */
  reload: () => void
}

/**
 * Loads Custom API Request Parameter records from the Dataverse `customapirequestparameters` table
 * via {@link CustomapirequestparametersService.getAll}.
 *
 * @remarks
 * Dataverse table: `customapirequestparameter` (OData collection: `customapirequestparameters`)
 * Sorted by `uniquename asc`. Loads up to 500 records per fetch.
 *
 * When `customApiId` is provided the results are filtered to parameters belonging to that
 * Custom API (`_customapiid_value eq <id>`). When omitted all parameters across all Custom APIs
 * are returned — useful for building a flat index.
 *
 * @param customApiId - Optional GUID of the parent Custom API to filter by.
 * @returns {@link IUseCustomApiRequestParametersResult} containing `requestParameters`, `loading`,
 * `error`, and `reload`.
 *
 * @example
 * ```tsx
 * // All parameters for a specific Custom API
 * const { requestParameters, loading, error, reload } = useCustomApiRequestParameters(selectedApiId)
 *
 * // All parameters across all Custom APIs
 * const { requestParameters } = useCustomApiRequestParameters()
 * ```
 */
export function useCustomApiRequestParameters(customApiId?: string): IUseCustomApiRequestParametersResult {
  const [requestParameters, setRequestParameters] = useState<Customapirequestparameters[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        // AI-CONTEXT: Filter by _customapiid_value when a parent API ID is supplied; otherwise load all parameters.
        const filter = customApiId ? `_customapiid_value eq ${customApiId}` : undefined
        const result = await CustomapirequestparametersService.getAll({
          filter,
          orderBy: [DEFAULT_SORT_ORDER],
          top: MAX_REQUEST_PARAMETERS_TO_LOAD,
        })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getAll returned a failure result'
          console.error('useCustomApiRequestParameters:', message, result.error)
          setError(message)
          return
        }
        setRequestParameters(result.data ?? [])
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useCustomApiRequestParameters: failed to load request parameters', message)
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    doFetch()
    return () => { cancelled = true }
  }, [customApiId, attempt])

  return {
    requestParameters,
    loading,
    error,
    reload: () => setAttempt(n => n + 1),
  }
}
