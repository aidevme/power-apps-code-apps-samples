import { useState, useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { codeToHtml } from 'shiki'
import { useAppTheme } from '../../../context/ThemeContext'

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function serializeXml(node: Element, depth: number): string {
  const indent = '  '.repeat(depth)
  const tag = node.tagName
  const attrs = Array.from(node.attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join(' ')
  const openTag = attrs ? `<${tag} ${attrs}` : `<${tag}`
  const childElements = Array.from(node.children)
  if (childElements.length === 0) {
    return `${indent}${openTag} />`
  }
  const children = childElements.map(c => serializeXml(c, depth + 1)).join('\n')
  return `${indent}${openTag}>\n${children}\n${indent}</${tag}>`
}

function prettyPrint(code: string, language: string): string {
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(code), null, 2)
    }
    if (language === 'xml') {
      const doc = new DOMParser().parseFromString(code, 'application/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) return code
      return serializeXml(doc.documentElement, 0)
    }
  } catch {
    // fall back to original on any error
  }
  return code
}

function extractShikiBgColor(html: string): string | undefined {
  const match = html.match(/background-color:([^;'"]+)/)
  return match?.[1]?.trim()
}

/** Return value of the {@link useSyntaxHighlighter} hook. */
export interface IUseSyntaxHighlighterResult {
  /** Shiki-rendered HTML string, or `null` while the async highlight is pending. */
  html: string | null
  /** Pretty-printed version of the raw code string. */
  formatted: string
  /** Whether the copy-to-clipboard action is in its brief confirmation state. */
  copied: boolean
  /** Ref to attach to the toolbar element so the hook can apply the Shiki background colour. */
  toolbarRef: RefObject<HTMLDivElement | null>
  /** Copies {@link IUseSyntaxHighlighterResult.formatted} to the clipboard and briefly sets {@link IUseSyntaxHighlighterResult.copied} to `true`. */
  handleCopy: () => void
}

/**
 * Manages syntax highlighting state and side-effects for a code block.
 *
 * Calls the Shiki `codeToHtml` async API whenever `code`, `language`, or the
 * active theme changes. Exposes formatted code, clipboard state, and a toolbar
 * ref so the component can remain a pure rendering layer.
 *
 * @param code - Raw code or markup string to highlight.
 * @param language - Shiki language identifier (e.g. `'json'`, `'xml'`).
 * @param showLineNumbers - When `true`, injects `data-line` attributes via a Shiki transformer.
 * @returns State and callbacks needed to render the highlighted code block.
 * @example
 * ```ts
 * const { html, formatted, copied, toolbarRef, handleCopy } = useSyntaxHighlighter(code, language, showLineNumbers)
 * ```
 */
export function useSyntaxHighlighter(code: string, language: string, showLineNumbers: boolean): IUseSyntaxHighlighterResult {
  const { isDark } = useAppTheme()
  const [html, setHtml] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState<string | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const formatted = useMemo(() => prettyPrint(code, language), [code, language])
  const shikiTheme = isDark ? 'material-theme-lighter' : 'material-theme'

  useEffect(() => {
    let cancelled = false
    const highlight = formatted
      ? codeToHtml(formatted, {
          lang: language,
          theme: shikiTheme,
          transformers: showLineNumbers
            ? [{ line(node, line) { node.properties['data-line'] = line } }]
            : [],
        })
      : Promise.resolve(null)
    highlight
      .then(result => {
        if (!cancelled) {
          setHtml(result)
          setBgColor(result ? extractShikiBgColor(result) : undefined)
        }
      })
      .catch(() => { if (!cancelled) setHtml(null) })
    return () => { cancelled = true }
  }, [formatted, language, shikiTheme, showLineNumbers])

  useEffect(() => {
    if (toolbarRef.current) {
      toolbarRef.current.style.backgroundColor = bgColor ?? ''
      toolbarRef.current.style.borderBottomColor = bgColor ?? ''
    }
  }, [bgColor])

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return { html, formatted, copied, toolbarRef, handleCopy }
}
