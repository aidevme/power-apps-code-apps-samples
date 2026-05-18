// AI-CONTEXT: Dataverse hook — fetches environmentvariabledefinition records using the PAC CLI–generated EnvironmentvariabledefinitionsService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/EnvironmentvariabledefinitionsService.ts   (EnvironmentvariabledefinitionsService.getAll)
//   - model:   src/generated/models/EnvironmentvariabledefinitionsModel.ts       (Environmentvariabledefinitions interface)
//   - barrel:  src/hooks/index.ts                                                (re-exports useEnvironmentVariableDefinitions)
// AI-CONSTRAINT: Never call EnvironmentvariabledefinitionsService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Environmentvariabledefinitions } from '../../generated/models/EnvironmentvariabledefinitionsModel'
import { EnvironmentvariabledefinitionsService } from '../../generated/services/EnvironmentvariabledefinitionsService'

/** Columns fetched from the `environmentvariabledefinitions` table on every {@link useEnvironmentVariableDefinitions} call. */
const ENV_VAR_DEFS_SELECT: (keyof Environmentvariabledefinitions)[] = [
  'environmentvariabledefinitionid',
  'schemaname',
  'displayname',
  'description',
  'type',
  'defaultvalue',
  'isrequired',
  'hint',
  'statecode',
  'statuscode',
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

/** Result shape returned by {@link useEnvironmentVariableDefinitions}. */
export interface IUseEnvironmentVariableDefinitionsResult {
  /** Fetched environment variable definition records, ordered by `displayname` ascending. Empty while loading. */
  environmentVariableDefinitions: Environmentvariabledefinitions[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all active Dataverse environment variable definition records ordered by display name.
 *
 * @remarks
 * Dataverse table: `environmentvariabledefinitions` (logical name: `environmentvariabledefinition`)
 * OData filter: `statecode eq 0` — active records only.
 * OData orderby: `displayname asc`
 * Selected columns: `environmentvariabledefinitionid`, `schemaname`, `displayname`, `description`,
 * `type`, `defaultvalue`, `isrequired`, `hint`, `statecode`, `statuscode`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseEnvironmentVariableDefinitionsResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { environmentVariableDefinitions, isLoading, error } = useEnvironmentVariableDefinitions()
 * if (isLoading) return <Spinner label="Loading environment variable definitions…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{environmentVariableDefinitions.map(d => <li key={d.environmentvariabledefinitionid}>{d.displayname}</li>)}</ul>
 * ```
 */
export function useEnvironmentVariableDefinitions(): IUseEnvironmentVariableDefinitionsResult {
  const [environmentVariableDefinitions, setEnvironmentVariableDefinitions] = useState<Environmentvariabledefinitions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEnvironmentVariableDefinitions() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await EnvironmentvariabledefinitionsService.getAll({
          // AI-CONTEXT: statecode eq 0 — active definitions only; inactive definitions are excluded.
          filter: 'statecode eq 0',
          orderBy: ['displayname asc'],
          select: ENV_VAR_DEFS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setEnvironmentVariableDefinitions(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch environment variable definitions'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching environment variable definitions'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchEnvironmentVariableDefinitions()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { environmentVariableDefinitions, isLoading, error }
}
