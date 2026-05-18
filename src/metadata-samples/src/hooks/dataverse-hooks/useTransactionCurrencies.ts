// AI-CONTEXT: Dataverse hook — fetches transactioncurrency records using the PAC CLI–generated TransactioncurrenciesService.
// AI-FILE-RELATIONS:
//   - service: src/generated/services/TransactioncurrenciesService.ts   (TransactioncurrenciesService.getAll)
//   - model:   src/generated/models/TransactioncurrenciesModel.ts       (Transactioncurrencies interface)
//   - barrel:  src/hooks/index.ts                                       (re-exports useTransactionCurrencies)
// AI-CONSTRAINT: Never call TransactioncurrenciesService directly from a component — always go through this hook.
// AI-PATTERN: Follow useSolutions as the template for all new Dataverse query hooks.

import { useState, useEffect } from 'react'
import type { Transactioncurrencies } from '../../generated/models/TransactioncurrenciesModel'
import { TransactioncurrenciesService } from '../../generated/services/TransactioncurrenciesService'

/** Columns fetched from the `transactioncurrencies` table on every {@link useTransactionCurrencies} call. */
const TRANSACTION_CURRENCIES_SELECT: (keyof Transactioncurrencies)[] = [
  'transactioncurrencyid',
  'currencyname',
  'isocurrencycode',
  'currencysymbol',
  'currencyprecision',
  'exchangerate',
  'currencytype',
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

/** Result shape returned by {@link useTransactionCurrencies}. */
export interface IUseTransactionCurrenciesResult {
  /** Fetched transaction currency records, ordered by `currencyname` ascending. Empty while loading. */
  transactionCurrencies: Transactioncurrencies[]
  /** `true` while the initial fetch or a refresh is in flight. */
  isLoading: boolean
  /** Populated when the Dataverse call fails; `null` on success or before first fetch. */
  error: Error | null
}

/**
 * Fetches all active Dataverse transaction currency records ordered by currency name.
 *
 * @remarks
 * Dataverse table: `transactioncurrencies` (logical name: `transactioncurrency`)
 * OData filter: `statecode eq 0` — active currencies only.
 * OData orderby: `currencyname asc`
 * Selected columns: `transactioncurrencyid`, `currencyname`, `isocurrencycode`,
 * `currencysymbol`, `currencyprecision`, `exchangerate`, `currencytype`,
 * `statecode`, `statuscode`, `createdon`, `modifiedon`.
 *
 * Uses a cancellation flag to prevent state updates on unmounted components.
 *
 * @returns {@link IUseTransactionCurrenciesResult} containing the records, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { transactionCurrencies, isLoading, error } = useTransactionCurrencies()
 * if (isLoading) return <Spinner label="Loading currencies…" />
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{transactionCurrencies.map(c => <li key={c.transactioncurrencyid}>{c.currencyname} ({c.isocurrencycode})</li>)}</ul>
 * ```
 */
export function useTransactionCurrencies(): IUseTransactionCurrenciesResult {
  const [transactionCurrencies, setTransactionCurrencies] = useState<Transactioncurrencies[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTransactionCurrencies() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await TransactioncurrenciesService.getAll({
          // AI-CONTEXT: statecode eq 0 — active currencies only; inactive ones are excluded.
          filter: 'statecode eq 0',
          orderBy: ['currencyname asc'],
          select: TRANSACTION_CURRENCIES_SELECT,
        })

        if (cancelled) return

        if (result.success) {
          setTransactionCurrencies(result.data ?? [])
        } else {
          setError(toError(result.error, 'Failed to fetch transaction currencies'))
        }
      } catch (err) {
        if (!cancelled) setError(toError(err, 'Unexpected error fetching transaction currencies'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchTransactionCurrencies()

    return () => {
      // AI-INTENT: Prevents stale state updates if the component unmounts before the fetch resolves.
      cancelled = true
    }
  }, [])

  return { transactionCurrencies, isLoading, error }
}
