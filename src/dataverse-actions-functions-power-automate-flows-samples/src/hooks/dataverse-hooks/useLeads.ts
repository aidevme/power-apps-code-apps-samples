import { useState, useEffect } from 'react'
import { LeadsService } from '../../generated/services/LeadsService'
import type { Leads } from '../../generated/models/LeadsModel'

/** Loads all lead records sorted by created date descending. */
export function useLeads() {
  const [leads, setLeads] = useState<Leads[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadLeads() }, [])

  /**
   * Fetches lead records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadLeads = async () => {
    try {
      setLoading(true)
      const result = await LeadsService.getAll({ orderBy: ['createdon desc'] })
      if (result.data) setLeads(result.data)
    } catch (err) {
      console.error('Error loading leads:', err)
    } finally {
      setLoading(false)
    }
  }

  return { leads, loading, loadLeads }
}
