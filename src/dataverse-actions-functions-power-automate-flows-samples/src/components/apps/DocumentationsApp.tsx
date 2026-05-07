import { Spinner, Text } from '@fluentui/react-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useReadme } from '../../hooks'
import { useDocumentationsAppStyles } from '../../styles/documentationsapp.styles'

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/'
const GITHUB_BLOB_BASE = 'https://github.com/aidevme/power-apps-code-apps-samples/blob/main/'

/**
 * Resolves relative URLs found in the README against the GitHub raw content
 * base so that images and links render correctly outside of GitHub.
 */
function resolveReadmeUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith('#')) return url
  // Images: serve from raw so <img> src works
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(url)) {
    return GITHUB_RAW_BASE + url.replace(/^\.?\//, '')
  }
  // Other relative links: point to GitHub blob view
  return GITHUB_BLOB_BASE + url.replace(/^\.?\//, '')
}

/** Props for {@link DocumentationsApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDocumentationsAppProps {
  // reserved for future configuration props
}

/**
 * Renders the repository README from GitHub as formatted markdown,
 * fetched at runtime from the raw GitHub URL.
 *
 * @example
 * ```tsx
 * <DocumentationsApp />
 * ```
 */
export function DocumentationsApp() {
  const styles = useDocumentationsAppStyles()
  const { markdown, loading, error } = useReadme()

  if (loading) {
    return <Spinner label="Loading documentation…" />
  }

  if (error) {
    return <Text className={styles.errorText}>Failed to load documentation: {error}</Text>
  }

  return (
    <div className={styles.root}>
      <div className={styles.markdown}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={resolveReadmeUrl}>{markdown ?? ''}</ReactMarkdown>
      </div>
    </div>
  )
}
