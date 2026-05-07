import { useState, useEffect } from 'react'
import { OpportunitiesService } from '../generated/services/OpportunitiesService'
import type { Opportunities } from '../generated/models/OpportunitiesModel'

/** Loads all opportunity records sorted by created date descending. */
export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunities[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOpportunities() }, [])

  /**
   * Fetches opportunity records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadOpportunities = async () => {
    try {
      setLoading(true)
      const result = await OpportunitiesService.getAll({ orderBy: ['createdon desc'] })
      if (result.data) setOpportunities(result.data)
    } catch (err) {
      console.error('Error loading opportunities:', err)
    } finally {
      setLoading(false)
    }
  }

  return { opportunities, loading, loadOpportunities }
}
