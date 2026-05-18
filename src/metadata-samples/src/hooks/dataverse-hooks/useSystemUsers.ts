// AI-CONTEXT: Dataverse hook — fetches systemuser records using the PAC CLI–generated SystemusersService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/SystemusersService.ts   (SystemusersService.getAll)
//   - model:   src/generated/models/SystemusersModel.ts       (Systemusers interface)
//   - barrel:  src/hooks/index.ts                             (re-exports useSystemUsers)
// AI-CONSTRAINT: Never call SystemusersService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Systemusers } from '../../generated/models/SystemusersModel'
import { SystemusersService } from '../../generated/services/SystemusersService'

/** Columns fetched from the `systemusers` table on every {@link useSystemUsers} call. */
const SYSTEM_USERS_SELECT: (keyof Systemusers)[] = [
  'systemuserid',
  'fullname',
  'firstname',
  'lastname',
  'domainname',
  'internalemailaddress',
  'jobtitle',
  'isdisabled',
  'accessmode',
  'islicensed',
  'isintegrationuser',
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

/** Result shape returned by {@link useSystemUsers}. */
export interface IUseSystemUsersResult {
  /** Fetched system user records, ordered by `fullname` ascending. Empty while loading. */
  systemUsers: Systemusers[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all enabled Dataverse system user records ordered by full name.
 *
 * @remarks
 * Dataverse table: `systemusers` (logical name: `systemuser`)
 * OData filter: `isdisabled eq false` — excludes disabled user accounts.
 * OData orderby: `fullname asc`
 * Selected columns: `systemuserid`, `fullname`, `firstname`, `lastname`, `domainname`,
 * `internalemailaddress`, `jobtitle`, `isdisabled`, `accessmode`, `islicensed`,
 * `isintegrationuser`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseSystemUsersResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { systemUsers, isLoading, error } = useSystemUsers()
 * if (isLoading) return <Spinner label="Loading users…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{systemUsers.map(u => <li key={u.systemuserid}>{u.fullname}</li>)}</ul>
 * ```
 */
export function useSystemUsers(): IUseSystemUsersResult {
  const [systemUsers, setSystemUsers] = useState<Systemusers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSystemUsers() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await SystemusersService.getAll({
          // AI-CONTEXT: isdisabled eq false — active users only; disabled accounts are excluded.
          filter: 'isdisabled eq false',
          orderBy: ['fullname asc'],
          select: SYSTEM_USERS_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setSystemUsers(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch system users'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching system users'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSystemUsers()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { systemUsers, isLoading, error }
}
