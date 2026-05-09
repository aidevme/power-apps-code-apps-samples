import { useState, useEffect, useCallback } from 'react';
import { EnvironmentvariabledefinitionsService } from '../generated/services/EnvironmentvariabledefinitionsService';
import type { Environmentvariabledefinitions } from '../generated/models/EnvironmentvariabledefinitionsModel';

/**
 * Loads all Power Platform environment variable definitions from Dataverse,
 * ordered alphabetically by display name.
 *
 * @returns The list of definitions, a `loading` flag, an `error` if the fetch
 *   failed, and a `reload` callback to manually re-fetch.
 *
 * @example
 * ```ts
 * const { definitions, loading, reload } = useEnvironmentVariables()
 * ```
 */
export function useEnvironmentVariables() {
  const [definitions, setDefinitions] = useState<Environmentvariabledefinitions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await EnvironmentvariabledefinitionsService.getAll({
        orderBy: ['displayname asc'],
      });
      if (!result.success) {
        throw new Error('Failed to load environment variable definitions');
      }
      setDefinitions(result.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { definitions, loading, error, reload: load };
}
