// AI-CONTEXT: Thin wrapper around the Power Apps SDK `getContext()` call — provides host context (user, app, session) to the rest of the app.
// AI-FILE-RELATIONS:
//   - consumer: src/App.tsx                                                   (primary caller — drives contextLoading gate)
//   - consumer: src/components/apps/miscellaneous/EnvironmentVariablesApp.tsx (reads context.user)
//   - sdk:      @microsoft/power-apps/app                                     (getContext, IContext)
// AI-CONSTRAINT: Never call getContext() directly in a component — always go through this hook via the barrel export in hooks/index.ts.
// AI-PATTERN: Single-call hook; no parameters. If context-dependent derived state is needed, create a new hook that consumes this one.

import { useState, useEffect } from 'react';
import { getContext } from '@microsoft/power-apps/app';
import type { IContext } from '@microsoft/power-apps/app';

/**
 * Result returned by {@link useContext}.
 */
export interface IUseContextResult {
  /** The resolved Power Apps host context, or `null` while loading or on error. */
  context: IContext | null
  /** `true` while the `getContext()` call is in flight. */
  loading: boolean
  /** Populated if `getContext()` rejects; `null` on success. */
  error: Error | null
}

/**
 * Retrieves the Power Apps host context on mount, exposing app, user, and
 * session metadata provided by the SDK `getContext` API.
 *
 * @remarks
 * Called once on mount via a single `useEffect` with an empty dependency array.
 * `loading` starts as `true` and is set to `false` in the `finally` handler
 * regardless of success or failure.
 *
 * @returns An {@link IUseContextResult} containing the resolved {@link IContext},
 *   a `loading` flag while the async call is in flight, and an `error` if it rejects.
 * @throws Never — errors are caught and surfaced via the `error` field.
 *
 * @example
 * ```ts
 * const { context, loading, error } = useContext()
 * if (loading) return <Spinner />
 * if (error) return <div>Failed to load context: {error.message}</div>
 * console.log(context?.user.fullName)
 * ```
 */
export function useContext(): IUseContextResult {
  const [context, setContext] = useState<IContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // AI-CONTEXT: getContext() is a one-shot SDK call — no polling, no re-fetch needed.
    getContext()
      .then(setContext)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  return { context, loading, error };
}
