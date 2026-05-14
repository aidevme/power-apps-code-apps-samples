// AI-CONTEXT: Hook for loading Custom API Response Property records from Dataverse, optionally filtered by parent Custom API ID.
// AI-FILE-RELATIONS:
//   - service:  src/generated/services/CustomapiresponsepropertiesService.ts  (PAC-generated SDK client — do not edit)
//   - model:    src/generated/models/CustomapiresponsepropertiesModel.ts       (Customapiresponseproperties types)
//   - sibling:  src/hooks/useCustomApis.ts                                     (parent Custom API records)
//   - sibling:  src/hooks/useCustomApiRequestParameters.ts                     (request parameters for the same parent)
//   - consumer: src/components/apps/ (Custom APIs explorer app)
// AI-CONSTRAINT: Never call CustomapiresponsepropertiesService directly from components — all data flows through this hook.
// AI-PATTERN: Load-on-mount with optional customApiId filter; re-fetches when customApiId changes.

import { useState, useEffect } from 'react'
import { CustomapiresponsepropertiesService } from '../../generated/services/CustomapiresponsepropertiesService'
import type { Customapiresponseproperties } from '../../generated/models/CustomapiresponsepropertiesModel'

/** OData `orderBy` clause applied to all response property queries. */
const DEFAULT_SORT_ORDER = 'uniquename asc'

/** Maximum number of response property records to load per query. */
const MAX_RESPONSE_PROPERTIES_TO_LOAD = 500

/** Return value of the {@link useCustomApiResponseProperties} hook. */
export interface IUseCustomApiResponsePropertiesResult {
  /** All response property records loaded from Dataverse. Empty array while loading or on error. */
  responseProperties: Customapiresponseproperties[]
  /** Whether the initial or reload fetch is in progress. */
  loading: boolean
  /** Error message if the last fetch failed, or `null` on success. */
  error: string | null
  /** Re-fetches the response property records. Useful for pull-to-refresh patterns. */
  reload: () => void
}

/**
 * Loads Custom API Response Property records from the Dataverse `customapiresponseproperties` table
 * via {@link CustomapiresponsepropertiesService.getAll}.
 *
 * @remarks
 * Dataverse table: `customapiresponseproperty` (OData collection: `customapiresponseproperties`)
 * Sorted by `uniquename asc`. Loads up to 500 records per fetch.
 *
 * When `customApiId` is provided the results are filtered to properties belonging to that
 * Custom API (`_customapiid_value eq <id>`). When omitted all response properties across all
 * Custom APIs are returned — useful for building a flat index.
 *
 * @param customApiId - Optional GUID of the parent Custom API to filter by.
 * @returns {@link IUseCustomApiResponsePropertiesResult} containing `responseProperties`, `loading`,
 * `error`, and `reload`.
 *
 * @example
 * ```tsx
 * // Response properties for a specific Custom API
 * const { responseProperties, loading, error, reload } = useCustomApiResponseProperties(selectedApiId)
 *
 * // All response properties across all Custom APIs
 * const { responseProperties } = useCustomApiResponseProperties()
 * ```
 */
export function useCustomApiResponseProperties(customApiId?: string): IUseCustomApiResponsePropertiesResult {
  const [responseProperties, setResponseProperties] = useState<Customapiresponseproperties[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        // AI-CONTEXT: Filter by _customapiid_value when a parent API ID is supplied; otherwise load all response properties.
        const filter = customApiId ? `_customapiid_value eq ${customApiId}` : undefined
        const result = await CustomapiresponsepropertiesService.getAll({
          filter,
          orderBy: [DEFAULT_SORT_ORDER],
          top: MAX_RESPONSE_PROPERTIES_TO_LOAD,
        })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getAll returned a failure result'
          console.error('useCustomApiResponseProperties:', message, result.error)
          setError(message)
          return
        }
        setResponseProperties(result.data ?? [])
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useCustomApiResponseProperties: failed to load response properties', message)
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
    responseProperties,
    loading,
    error,
    reload: () => setAttempt(n => n + 1),
  }
}
