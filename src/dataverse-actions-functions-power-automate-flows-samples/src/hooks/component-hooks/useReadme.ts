// AI-CONTEXT: Fetches the repository README markdown from GitHub raw content on mount — used exclusively by DocumentationsApp.
// AI-FILE-RELATIONS:
//   - consumer: src/components/apps/reference/DocumentationsApp.tsx (the only caller)
// AI-CONSTRAINT: Never call fetch() for the README outside this hook — all network access for docs goes through here.
// AI-PATTERN: Single-call hook with a cancellation guard; re-fetching is not supported — remount the consumer to retry.

import { useEffect, useState } from 'react'

// AI-CONTEXT: Absolute URL to the raw markdown file on the default branch — update if the docs path changes.
const README_URL =
  'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/docs/code-apps/README.md'

/** Result returned by {@link useReadme}. */
export interface IUseReadmeResult {
  /** Raw markdown string, or `null` while loading or on error. */
  markdown: string | null
  /** `true` while the fetch is in progress. */
  loading: boolean
  /** Human-readable error message if the fetch failed; `null` on success. */
  error: string | null
}

/**
 * Fetches the repository README from GitHub and returns its raw markdown content.
 *
 * @remarks
 * Performs a single `fetch` on mount against {@link README_URL}. A cancellation
 * flag prevents state updates on unmounted components. Neither retries nor
 * re-fetches are performed — remount the consumer to trigger a fresh request.
 *
 * Non-OK HTTP responses (e.g. 404, 503) are surfaced as an `error` string of the
 * form `"HTTP <status>"`.
 *
 * @returns An {@link IUseReadmeResult} with the raw markdown, a `loading` flag,
 *   and an `error` string.
 * @throws Never — all rejections are caught and exposed via the `error` field.
 *
 * @example
 * ```tsx
 * const { markdown, loading, error } = useReadme()
 * if (loading) return <Spinner label="Loading documentation…" />
 * if (error) return <div>Failed to load README: {error}</div>
 * return <ReactMarkdown>{markdown ?? ''}</ReactMarkdown>
 * ```
 */
export function useReadme(): IUseReadmeResult {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // AI-CONTEXT: `cancelled` prevents setState calls after the component unmounts mid-fetch.
    let cancelled = false

    fetch(README_URL)
      .then((res) => {
        // AI-CONTEXT: Treat any non-2xx status as an error — raw GitHub returns 404 for missing files.
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) {
          setMarkdown(text)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load README')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  return { markdown, loading, error }
}

