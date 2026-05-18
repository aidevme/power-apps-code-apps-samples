// AI-CONTEXT: Dataverse hook — fetches Solution table records using the PAC CLI–generated SolutionsService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/SolutionsService.ts   (SolutionsService.getAll — do not call outside a hook)
//   - model:   src/generated/models/SolutionsModel.ts       (Solutions interface)
//   - barrel:  src/hooks/index.ts                           (re-exports useSolutions)
// AI-CONSTRAINT: Never call SolutionsService directly from a component — always go through this hook.
// AI-PATTERN: Follow this hook as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Solutions } from '../../generated/models/SolutionsModel'
import { SolutionsService } from '../../generated/services/SolutionsService'

/** Columns fetched from the `solutions` table on every {@link useSolutions} call. */
const SOLUTIONS_SELECT: (keyof Solutions)[] = [
  'solutionid',
  'uniquename',
  'friendlyname',
  'version',
  'ismanaged',
  'installedon',
  'description',
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

/**
 * Result shape returned by {@link useSolutions}.
 */
export interface IUseSolutionsResult {
  /** Fetched solution records, ordered by `friendlyname` ascending. Empty while loading. */
  solutions: Solutions[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all visible Dataverse Solution records ordered by display name.
 *
 * @remarks
 * Dataverse table: `solutions` (logical name: `solution`)
 * OData filter: `isvisible eq true` — excludes internal and hidden solutions.
 * OData orderby: `friendlyname asc`
 * Selected columns: `uniquename`, `friendlyname`, `version`, `ismanaged`,
 * `publisheridname`, `installedon`, `createdbyname`, `description`
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseSolutionsResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { solutions, isLoading, error } = useSolutions()
 * if (isLoading) return <Spinner label="Loading solutions…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{solutions.map(s => <li key={s.solutionid}>{s.friendlyname}</li>)}</ul>
 * ```
 */
export function useSolutions(): IUseSolutionsResult {
  const [solutions, setSolutions] = useState<Solutions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSolutions() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await SolutionsService.getAll({
          // AI-CONTEXT: isvisible eq true excludes Internal (solutiontype=2) and hidden platform solutions.
          filter: 'isvisible eq true',
          orderBy: ['friendlyname asc'],
          select: SOLUTIONS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setSolutions(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch solutions'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching solutions'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSolutions()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { solutions, isLoading, error }
}
