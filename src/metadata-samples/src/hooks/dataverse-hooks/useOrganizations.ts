// AI-CONTEXT: Dataverse hook — fetches the single organization record using the PAC CLI–generated OrganizationsService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/OrganizationsService.ts   (OrganizationsService.getAll)
//   - model:   src/generated/models/OrganizationsModel.ts       (Organizations interface)
//   - barrel:  src/hooks/index.ts                               (re-exports useOrganizations)
// AI-CONSTRAINT: Never call OrganizationsService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.
// AI-INTENT: The organization table is a singleton — getAll always returns exactly one record; exposed as `organization`.

import { useState, useEffect } from 'react'
import type { Organizations } from '../../generated/models/OrganizationsModel'
import { OrganizationsService } from '../../generated/services/OrganizationsService'

/** Columns fetched from the `organizations` table on every {@link useOrganizations} call. */
const ORGANIZATIONS_SELECT: (keyof Organizations)[] = [
  'organizationid',
  'name',
  'basecurrencyidname',
  'languagecode',
  'localeid',
  'defaultemailsettings',
  'organizationstate',
  'createdbyname',
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

/** Result shape returned by {@link useOrganizations}. */
export interface IUseOrganizationsResult {
  /**
   * The single organization record for the current environment.
   * `null` while loading or when the fetch has not yet completed.
   *
   * @remarks
   * The Dataverse `organization` table always contains exactly one row per environment.
   */
  organization: Organizations | null
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches the current Dataverse organization record.
 *
 * @remarks
 * Dataverse table: `organizations` (logical name: `organization`)
 * The table is a singleton — exactly one record exists per environment.
 * Selected columns: `organizationid`, `name`, `uniquename`, `basecurrencyid`,
 * `languagecode`, `localeid`, `timezonecode`, `defaultemailsettings`,
 * `organizationstate`, `createdbyname`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseOrganizationsResult} containing the record, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { organization, isLoading, error } = useOrganizations()
 * if (isLoading) return <Spinner label="Loading organization…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <div>{organization?.name}</div>
 * ```
 */
export function useOrganizations(): IUseOrganizationsResult {
  const [organization, setOrganization] = useState<Organizations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchOrganization() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await OrganizationsService.getAll({
          select: ORGANIZATIONS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          // AI-CONTEXT: Singleton table — take the first (and only) record; null if somehow empty.
          setOrganization(result.data?.[0] ?? null)
        } else {
          setError(toError(result.error, 'Failed to fetch organization'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching organization'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchOrganization()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { organization, isLoading, error }
}
