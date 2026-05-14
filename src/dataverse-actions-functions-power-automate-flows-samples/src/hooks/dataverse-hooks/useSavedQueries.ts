import { useState, useEffect, useCallback } from 'react';
import { SavedqueriesService } from '../../generated/services/SavedqueriesService';
import type { Savedqueries } from '../../generated/models/SavedqueriesModel';

/** Result returned by {@link useSavedQueries}. */
export interface IUseSavedQueriesResult {
  /** Saved query records with `querytype eq 0` (public views), optionally scoped to one entity. */
  savedQueries: Savedqueries[];
  /** Whether data is currently loading. */
  loading: boolean;
  /** Error from the last failed fetch, or `null`. */
  error: Error | null;
  /** Re-fetches saved queries. */
  reload: () => void;
}

/**
 * Loads Dataverse saved queries (system views) filtered to `querytype eq 0`
 * (public views), ordered alphabetically by name.
 *
 * @param returnedtypecode - Optional entity logical name (e.g. `'account'`) to
 *   further filter results to views belonging to that entity.
 * @returns Saved query records, loading state, error state, and a `reload` callback.
 *
 * @example
 * ```ts
 * const { savedQueries, loading, error, reload } = useSavedQueries('account')
 * ```
 */
export function useSavedQueries(returnedtypecode?: string): IUseSavedQueriesResult {
  const [savedQueries, setSavedQueries] = useState<Savedqueries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filter = returnedtypecode
        ? `querytype eq 0 and returnedtypecode eq '${returnedtypecode}'`
        : 'querytype eq 0';
      const result = await SavedqueriesService.getAll({
        filter,
        orderBy: ['isdefault desc', 'name asc'],
      });
      if (!result.success) {
        throw new Error('Failed to load saved queries');
      }
      setSavedQueries(result.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [returnedtypecode]);

  useEffect(() => {
    load();
  }, [load]);

  return { savedQueries, loading, error, reload: load };
}
