import { useEffect, useRef } from 'react'
import { makeStyles, Spinner, Text } from '@fluentui/react-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import mermaid from 'mermaid'
import { useReadme } from '../../../hooks'
import { useDocumentationsAppStyles } from '../../../styles/documentationsapp.styles'
import { Notes } from '../../misc/notes/Notes'
import type { NoteType } from '../../misc/notes/Notes'

const DOCUMENTATIONS_APP_NOTE_TYPE: NoteType = 'info'
const DOCUMENTATIONS_APP_DESCRIPTION =
  'This panel renders the repository README live from GitHub, including formatted markdown, ' +
  'tables, code blocks, and Mermaid diagrams.'
const DOCUMENTATIONS_APP_INFO_LABEL_TEXT =
  'Content is fetched at runtime from the raw GitHub URL. Diagrams are rendered client-side ' +
  'using the Mermaid library. Relative image and link URLs are automatically resolved against ' +
  'the GitHub repository base so they display correctly outside of the GitHub interface.'
const DOCUMENTATIONS_APP_INFO_LABEL_LINK =
  'https://github.com/aidevme/power-apps-code-apps-samples'

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/docs/code-apps/'
const GITHUB_BLOB_BASE = 'https://github.com/aidevme/power-apps-code-apps-samples/blob/main/docs/code-apps/'
const GITHUB_RAW_ROOT = 'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/'
const GITHUB_BLOB_ROOT = 'https://github.com/aidevme/power-apps-code-apps-samples/blob/main/'

/**
 * Resolves relative URLs found in the README against the GitHub raw content
 * base so that images and links render correctly outside of GitHub.
 */
function resolveReadmeUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith('#')) return url

  // Resolve ../.. traversal relative to docs/code-apps/
  const resolved = new URL(url, GITHUB_RAW_BASE).href

  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(url)) {
    return resolved
  }
  // For non-image relative links swap raw base for blob base
  return resolved
    .replace(GITHUB_RAW_ROOT, GITHUB_BLOB_ROOT)
    .replace(GITHUB_RAW_BASE, GITHUB_BLOB_BASE)
}

mermaid.initialize({ startOnLoad: false, theme: 'default' })

const useMermaidStyles = makeStyles({
  diagram: { overflowX: 'auto', margin: '16px 0' },
})

/** Renders a Mermaid diagram string into an SVG using the mermaid library. */
function MermaidDiagram({ chart }: { chart: string }) {
  const styles = useMermaidStyles()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    mermaid.render(id, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    }).catch(() => {
      if (ref.current) ref.current.textContent = chart
    })
  }, [chart])

  return <div ref={ref} className={styles.diagram} />
}

/** Custom code block renderer — delegates mermaid fences to {@link MermaidDiagram}. */
const markdownComponents: Components = {
  code({ className, children }) {
    const language = /language-(\w+)/.exec(className ?? '')?.[1]
    const value = String(children).replace(/\n$/, '')
    if (language === 'mermaid') {
      return <MermaidDiagram chart={value} />
    }
    return <code className={className}>{children}</code>
  },
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
      <Notes
        noteType={DOCUMENTATIONS_APP_NOTE_TYPE}
        showInfoLabel={DOCUMENTATIONS_APP_INFO_LABEL_TEXT}
        infoLabelLink={DOCUMENTATIONS_APP_INFO_LABEL_LINK}
      >
        {DOCUMENTATIONS_APP_DESCRIPTION}
      </Notes>
      <div className={styles.markdown}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={resolveReadmeUrl} components={markdownComponents}>{markdown ?? ''}</ReactMarkdown>
      </div>
    </div>
  )
}
