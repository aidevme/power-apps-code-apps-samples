// AI-CONTEXT: Dataverse hook — fetches environmentvariablevalue records using the PAC CLI–generated EnvironmentvariablevaluesService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/EnvironmentvariablevaluesService.ts   (EnvironmentvariablevaluesService.getAll)
//   - model:   src/generated/models/EnvironmentvariablevaluesModel.ts       (Environmentvariablevalues interface)
//   - barrel:  src/hooks/index.ts                                           (re-exports useEnvironmentVariableValues)
// AI-CONSTRAINT: Never call EnvironmentvariablevaluesService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Environmentvariablevalues } from '../../generated/models/EnvironmentvariablevaluesModel'
import { EnvironmentvariablevaluesService } from '../../generated/services/EnvironmentvariablevaluesService'

/** Columns fetched from the `environmentvariablevalues` table on every {@link useEnvironmentVariableValues} call. */
const ENV_VAR_VALUES_SELECT: (keyof Environmentvariablevalues)[] = [
  'environmentvariablevalueid',
  'schemaname',
  'value',
  'statecode',
  'statuscode',
  'environmentvariabledefinitionidname',
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

/** Result shape returned by {@link useEnvironmentVariableValues}. */
export interface IUseEnvironmentVariableValuesResult {
  /** Fetched environment variable value records. Empty while loading. */
  environmentVariableValues: Environmentvariablevalues[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all active Dataverse environment variable value records.
 *
 * @remarks
 * Dataverse table: `environmentvariablevalues` (logical name: `environmentvariablevalue`)
 * OData filter: `statecode eq 0` — active records only.
 * Selected columns: `environmentvariablevalueid`, `schemaname`, `value`, `statecode`,
 * `statuscode`, `environmentvariabledefinitionidname`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseEnvironmentVariableValuesResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { environmentVariableValues, isLoading, error } = useEnvironmentVariableValues()
 * if (isLoading) return <Spinner label="Loading environment variable values…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{environmentVariableValues.map(v => <li key={v.environmentvariablevalueid}>{v.schemaname}</li>)}</ul>
 * ```
 */
export function useEnvironmentVariableValues(): IUseEnvironmentVariableValuesResult {
  const [environmentVariableValues, setEnvironmentVariableValues] = useState<Environmentvariablevalues[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEnvironmentVariableValues() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await EnvironmentvariablevaluesService.getAll({
          // AI-CONTEXT: statecode eq 0 — active records only; inactive values are excluded.
          filter: 'statecode eq 0',
          select: ENV_VAR_VALUES_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setEnvironmentVariableValues(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch environment variable values'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching environment variable values'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchEnvironmentVariableValues()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { environmentVariableValues, isLoading, error }
}
