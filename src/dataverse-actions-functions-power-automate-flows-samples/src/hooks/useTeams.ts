import { useState, useEffect } from 'react'
import { TeamsService } from '../generated/services/TeamsService'
import type { Teams } from '../generated/models/TeamsModel'

/** Loads all team records sorted by name ascending. */
export function useTeams() {
  const [teams, setTeams] = useState<Teams[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTeams() }, [])

  /**
   * Fetches team records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadTeams = async () => {
    try {
      setLoading(true)
      const result = await TeamsService.getAll({ orderBy: ['name asc'] })
      if (result.data) setTeams(result.data)
    } catch (err) {
      console.error('Error loading teams:', err)
    } finally {
      setLoading(false)
    }
  }

  return { teams, loading, loadTeams }
}
