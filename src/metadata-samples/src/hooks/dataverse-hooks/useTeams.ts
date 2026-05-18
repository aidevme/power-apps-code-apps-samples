// AI-CONTEXT: Dataverse hook — fetches team records using the PAC CLI–generated TeamsService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/TeamsService.ts   (TeamsService.getAll)
//   - model:   src/generated/models/TeamsModel.ts       (Teams interface)
//   - barrel:  src/hooks/index.ts                       (re-exports useTeams)
// AI-CONSTRAINT: Never call TeamsService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Teams } from '../../generated/models/TeamsModel'
import { TeamsService } from '../../generated/services/TeamsService'

/** Columns fetched from the `teams` table on every {@link useTeams} call. */
const TEAMS_SELECT: (keyof Teams)[] = [
  'teamid',
  'name',
  'description',
  'teamtype',
  'membershiptype',
  'emailaddress',
  'businessunitidname',
  'administratoridname',
  'isdefault',
  'systemmanaged',
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

/** Result shape returned by {@link useTeams}. */
export interface IUseTeamsResult {
  /** Fetched team records, ordered by `name` ascending. Empty while loading. */
  teams: Teams[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all Dataverse team records ordered by name.
 *
 * @remarks
 * Dataverse table: `teams` (logical name: `team`)
 * OData orderby: `name asc`
 * Selected columns: `teamid`, `name`, `description`, `teamtype` (Owner/Access/SecurityGroup/OfficeGroup),
 * `membershiptype`, `emailaddress`, `businessunitidname`, `administratoridname`,
 * `isdefault`, `systemmanaged`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseTeamsResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { teams, isLoading, error } = useTeams()
 * if (isLoading) return <Spinner label="Loading teams…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{teams.map(t => <li key={t.teamid}>{t.name}</li>)}</ul>
 * ```
 */
export function useTeams(): IUseTeamsResult {
  const [teams, setTeams] = useState<Teams[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTeams() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await TeamsService.getAll({
          orderBy: ['name asc'],
          select: TEAMS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setTeams(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch teams'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching teams'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchTeams()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { teams, isLoading, error }
}
