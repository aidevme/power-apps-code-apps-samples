import { useEffect, useState } from 'react'

const README_URL =
  'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/README.md'

/** Result returned by {@link useReadme}. */
export interface IUseReadmeResult {
  /** Raw markdown string, or `null` while loading or on error. */
  markdown: string | null
  /** Whether the fetch is in progress. */
  loading: boolean
  /** Error message if the fetch failed, otherwise `null`. */
  error: string | null
}

/**
 * Fetches the repository README from GitHub and returns its raw markdown
 * content.
 *
 * @returns Current fetch state including the markdown string, loading flag,
 * and any error message.
 * @example
 * ```ts
 * const { markdown, loading, error } = useReadme()
 * ```
 */
export function useReadme(): IUseReadmeResult {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(README_URL)
      .then((res) => {
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
