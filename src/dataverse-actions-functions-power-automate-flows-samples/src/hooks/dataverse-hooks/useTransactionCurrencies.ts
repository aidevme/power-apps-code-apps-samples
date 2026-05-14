import { useState, useEffect } from 'react'
import { TransactioncurrenciesService } from '../../generated/services/TransactioncurrenciesService'
import type { Transactioncurrencies } from '../../generated/models/TransactioncurrenciesModel'

/** Loads all transaction currency records sorted by currency name ascending. */
export function useTransactionCurrencies() {
  const [transactionCurrencies, setTransactionCurrencies] = useState<Transactioncurrencies[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTransactionCurrencies() }, [])

  /**
   * Fetches transaction currency records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadTransactionCurrencies = async () => {
    try {
      setLoading(true)
      const result = await TransactioncurrenciesService.getAll({ orderBy: ['currencyname asc'] })
      if (result.data) setTransactionCurrencies(result.data)
    } catch (err) {
      console.error('Error loading transaction currencies:', err)
    } finally {
      setLoading(false)
    }
  }

  return { transactionCurrencies, loading, loadTransactionCurrencies }
}
