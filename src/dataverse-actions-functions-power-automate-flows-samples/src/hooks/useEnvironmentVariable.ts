import { useState, useEffect } from 'react';
import { EnvironmentvariablevaluesService } from '../generated/services/EnvironmentvariablevaluesService';

/**
 * Fetches a single Power Platform environment variable value from Dataverse by schema name.
 *
 * Queries the `environmentvariablevalues` table filtered by `schemaname` and
 * returns the first matching `value` field, or `null` when no record is found.
 *
 * @param schemaName - The unique schema name of the environment variable (e.g. `aidevme_GitHubRepositoryBaseUrl`).
 * @returns The resolved string value, a `loading` flag, and an `error` if the fetch failed.
 *
 * @example
 * ```ts
 * const { value, loading } = useEnvironmentVariable('aidevme_GitHubRepositoryBaseUrl')
 * if (!loading) console.log(value)
 * ```
 */
export function useEnvironmentVariable(schemaName: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    EnvironmentvariablevaluesService.getAll({
      select: ['schemaname', 'value'],
      filter: `schemaname eq '${schemaName}'`,
      top: 1,
    })
      .then(result => {
        setValue(result.data?.[0]?.value ?? null);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error(String(err)))
      )
      .finally(() => setLoading(false));
  }, [schemaName]);

  return { value, loading, error };
}
