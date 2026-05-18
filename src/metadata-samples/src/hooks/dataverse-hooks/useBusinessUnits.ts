// AI-CONTEXT: Dataverse hook — fetches businessunit records using the PAC CLI–generated BusinessunitsService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/BusinessunitsService.ts   (BusinessunitsService.getAll)
//   - model:   src/generated/models/BusinessunitsModel.ts       (Businessunits interface)
//   - barrel:  src/hooks/index.ts                               (re-exports useBusinessUnits)
// AI-CONSTRAINT: Never call BusinessunitsService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Businessunits } from '../../generated/models/BusinessunitsModel'
import { BusinessunitsService } from '../../generated/services/BusinessunitsService'

/** Columns fetched from the `businessunits` table on every {@link useBusinessUnits} call. */
const BUSINESS_UNITS_SELECT: (keyof Businessunits)[] = [
  'businessunitid',
  'name',
  'description',
  'divisionname',
  'emailaddress',
  'isdisabled',
  'parentbusinessunitidname',
  'organizationidname',
  'createdon',
  'modifiedon',
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

/** Result shape returned by {@link useBusinessUnits}. */
export interface IUseBusinessUnitsResult {
  /** Fetched business unit records, ordered by `name` ascending. Empty while loading. */
  businessUnits: Businessunits[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all enabled Dataverse business unit records ordered by name.
 *
 * @remarks
 * Dataverse table: `businessunits` (logical name: `businessunit`)
 * OData filter: `isdisabled eq false` — excludes disabled business units.
 * OData orderby: `name asc`
 * Selected columns: `businessunitid`, `name`, `description`, `divisionname`, `emailaddress`,
 * `isdisabled`, `parentbusinessunitidname`, `organizationidname`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseBusinessUnitsResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { businessUnits, isLoading, error } = useBusinessUnits()
 * if (isLoading) return <Spinner label="Loading business units…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{businessUnits.map(bu => <li key={bu.businessunitid}>{bu.name}</li>)}</ul>
 * ```
 */
export function useBusinessUnits(): IUseBusinessUnitsResult {
  const [businessUnits, setBusinessUnits] = useState<Businessunits[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchBusinessUnits() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await BusinessunitsService.getAll({
          // AI-CONTEXT: isdisabled eq false — active business units only; disabled ones are excluded.
          filter: 'isdisabled eq false',
          orderBy: ['name asc'],
          select: BUSINESS_UNITS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setBusinessUnits(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch business units'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching business units'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchBusinessUnits()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { businessUnits, isLoading, error }
}
