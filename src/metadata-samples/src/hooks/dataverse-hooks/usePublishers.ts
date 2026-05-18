// AI-CONTEXT: Dataverse hook — fetches Publisher table records using the PAC CLI–generated PublishersService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/PublishersService.ts  (PublishersService.getAll — do not call outside a hook)
//   - model:   src/generated/models/PublishersModel.ts      (Publishers interface)
//   - barrel:  src/hooks/index.ts                          (re-exports usePublishers)
// AI-CONSTRAINT: Never call PublishersService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Publishers } from '../../generated/models/PublishersModel'
import { PublishersService } from '../../generated/services/PublishersService'

/** Columns fetched from the `publishers` table on every {@link usePublishers} call. */
const PUBLISHERS_SELECT: (keyof Publishers)[] = [
  'publisherid',
  'uniquename',
  'friendlyname',
  'customizationprefix',
  'customizationoptionvalueprefix',
  'description',
  'isreadonly',
]

/**
 * Normalises any SDK error shape into a standard `Error`.
 * `PowerDataRuntimeHttpError` does not extend `Error` but carries a `message` string.
 */
function toError(err: unknown, fallback: string): Error {
  if (err instanceof Error) return err
  const msg = (err as { message?: string } | null)?.message
  return new Error(typeof msg === 'string' && msg.length > 0 ? msg : fallback)
}

/** Result shape returned by {@link usePublishers}. */
export interface IUsePublishersResult {
  /** Fetched publisher records, ordered by `friendlyname` ascending. Empty while loading. */
  publishers: Publishers[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all Dataverse Publisher records ordered by display name.
 *
 * @remarks
 * Dataverse table: `publishers` (logical name: `publisher`)
 * OData orderby: `friendlyname asc`
 * Selected columns: `publisherid`, `uniquename`, `friendlyname`, `customizationprefix`,
 * `customizationoptionvalueprefix`, `description`, `isreadonly`
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUsePublishersResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { publishers, isLoading, error } = usePublishers()
 * ```
 */
export function usePublishers(): IUsePublishersResult {
  const [publishers, setPublishers] = useState<Publishers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPublishers() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await PublishersService.getAll({
          orderBy: ['friendlyname asc'],
          select: PUBLISHERS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setPublishers(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch publishers'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching publishers'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchPublishers()

    return () => { cancelled = true }
  }, [])

  return { publishers, isLoading, error }
}
