import { useState, useEffect } from 'react';
import { getContext } from '@microsoft/power-apps/app';
import type { IContext } from '@microsoft/power-apps/app';

/**
 * Retrieves the Power Apps host context on mount, exposing app, user, and
 * session metadata provided by the `getContext` API.
 *
 * @returns The resolved {@link IContext} object once loaded, a `loading` flag
 *   while the async call is in flight, and an `error` if the call fails.
 *
 * @example
 * ```ts
 * const { context, loading } = useContext()
 * if (!loading) console.log(context?.user.fullName)
 * ```
 */
export function useContext() {
  const [context, setContext] = useState<IContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getContext()
      .then(setContext)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  return { context, loading, error };
}
