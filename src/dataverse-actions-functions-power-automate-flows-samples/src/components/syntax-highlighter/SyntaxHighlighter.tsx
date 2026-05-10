import type { ReactElement } from 'react'
import { Text, Button, Tooltip, Badge } from '@fluentui/react-components'
import { CopyRegular, CheckmarkRegular } from '@fluentui/react-icons'
import { useSyntaxHighlighterStyles } from '../../styles/syntaxhighlighter.styles'
import { useSyntaxHighlighter } from '../../hooks/component-hooks/syntax-highlighter/useSyntaxHighlighter'

/** Props for the {@link SyntaxHighlighter} component. */
export interface ISyntaxHighlighterProps {
  /** The code or markup string to display. */
  code: string
  /**
   * Shiki language identifier for syntax highlighting. Common values:
   * - `'xml'`
   * - `'json'`
   * - `'typescript'`
   * - `'javascript'`
   * - `'sql'`
   * - `'plaintext'`
   * @defaultValue `'plaintext'`
   */
  language?: string
  /**
   * Falls back to `'—'` when `code` is empty.
   * @defaultValue `false`
   */
  showEmptyFallback?: boolean
  /**
   * Displays the language identifier as a label in the top-right corner of the code block.
   * @defaultValue `false`
   */
  showCodeLabel?: boolean
  /**
   * Renders a copy-to-clipboard button in the top-right corner of the code block.
   * @defaultValue `false`
   */
  showCopyButton?: boolean
  /**
   * Prefixes each line with its line number.
   * @defaultValue `false`
   */
  showLineNumbers?: boolean
}

/**
 * Renders a read-only syntax-highlighted code block powered by {@link https://shiki.style | Shiki}.
 * Falls back to plain monospaced text while the highlighter resolves asynchronously.
 * Preserves whitespace and wraps long lines.
 *
 * @example
 * ```tsx
 * <SyntaxHighlighter code={fetchxml} language="xml" />
 * <SyntaxHighlighter code={json} language="json" showEmptyFallback />
 * ```
 */
export function SyntaxHighlighter({ code, language = 'plaintext', showEmptyFallback = false, showCodeLabel = false, showCopyButton = false, showLineNumbers = false }: ISyntaxHighlighterProps): ReactElement {
  const styles = useSyntaxHighlighterStyles()
  const { html, formatted, copied, toolbarRef, handleCopy } = useSyntaxHighlighter(code, language, showLineNumbers)

  if (!code && showEmptyFallback) {
    return <Text as="pre" className={styles.fallback}>{'\u2014'}</Text>
  }

  const showToolbar = showCodeLabel || showCopyButton

  return (
    <div className={styles.wrapper}>
      {showToolbar && (
        <div ref={toolbarRef} className={styles.toolbar}>
          {showCodeLabel
            ? <Badge appearance="tint" color="informative" size="small">{language}</Badge>
            : <span />}
          {showCopyButton && (
            <Tooltip content={copied ? 'Copied!' : 'Copy'} relationship="label" withArrow>
              <Button
                appearance="subtle"
                size="small"
                icon={copied ? <CheckmarkRegular /> : <CopyRegular />}
                onClick={handleCopy}
              />
            </Tooltip>
          )}
        </div>
      )}
      {html !== null
        // shiki HTML-escapes all code tokens — dangerouslySetInnerHTML is safe here
        ? <div className={showLineNumbers ? styles.lineNumbers : undefined} dangerouslySetInnerHTML={{ __html: html }} />
        : <Text as="pre" className={styles.fallback}>{formatted}</Text>}
    </div>
  )
}
