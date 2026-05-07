import { useState, useEffect } from 'react'
import { EmailsService } from '../generated/services/EmailsService'
import type { Emails } from '../generated/models/EmailsModel'

/** Loads all email activity records sorted by modified date descending. */
export function useEmails() {
  const [emails, setEmails] = useState<Emails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadEmails() }, [])

  /**
   * Fetches email records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadEmails = async () => {
    try {
      setLoading(true)
      const result = await EmailsService.getAll({ orderBy: ['modifiedon desc'] })
      if (result.data) setEmails(result.data)
    } catch (err) {
      console.error('Error loading emails:', err)
    } finally {
      setLoading(false)
    }
  }

  return { emails, loading, loadEmails }
}
