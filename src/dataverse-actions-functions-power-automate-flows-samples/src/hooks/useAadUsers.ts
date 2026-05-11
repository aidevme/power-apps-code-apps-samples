import { useState, useEffect } from 'react'
import { AadusersService } from '../generated/services/AadusersService'
import type { Aadusers } from '../generated/models/AadusersModel'

const MAX_AAD_USERS_TO_LOAD = 100
const DEFAULT_SORT_ORDER = 'displayname asc'

/**
 * Loads AAD User records from the Dataverse `aaduser` virtual table.
 *
 * @returns The loaded records, a loading flag, and a reload callback.
 * @example
 * ```ts
 * const { aadUsers, loading, loadAadUsers } = useAadUsers()
 * ```
 */
export function useAadUsers() {
  const [aadUsers, setAadUsers] = useState<Aadusers[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAadUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAadUsers = async () => {
    try {
      setLoading(true)
      const result = await AadusersService.getAll({
        orderBy: [DEFAULT_SORT_ORDER],
        top: MAX_AAD_USERS_TO_LOAD,
      })
      if (result.data) {
        setAadUsers(result.data)
      }
    } catch (err) {
      console.error('Error loading AAD users:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    aadUsers,
    loading,
    loadAadUsers,
  }
}
