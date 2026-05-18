// AI-CONTEXT: Reusable styled note block — left-border accent colour driven by NoteType, optional icon and InfoLabel popover.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/notes/Notes.styles.ts  (useNotesStyles — private to this component)
//   - consumer: src/components/apps/**/*.tsx             (all app-level views that display contextual guidance)
// AI-PATTERN: Add new semantic variants by extending NoteType and NOTE_TYPE_COLORS — never inline border colours in consumers.
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import { Caption1, InfoLabel, Link, tokens } from '@fluentui/react-components'
import type { FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'
import { useNotesStyles } from './Notes.styles'

/**
 * Semantic intent variants that drive the left-border accent colour of {@link Notes}.
 *
 * @remarks
 * Each value maps to a Fluent UI design-token colour in {@link NOTE_TYPE_COLORS}.
 *
 * | Value | Border colour token | Typical use |
 * |---|---|---|
 * | `'default'` | `colorBrandStroke1` | General informational notes |
 * | `'info'`    | `colorPaletteBlueBorderActive` | Neutral guidance or tips |
 * | `'success'` | `colorStatusSuccessBorderActive` | Confirmation or completed state |
 * | `'warning'` | `colorStatusWarningBorderActive` | Caution or potential issues |
 * | `'error'`   | `colorStatusDangerBorderActive` | Errors or destructive actions |
 */
export type NoteType = 'default' | 'info' | 'success' | 'warning' | 'error'

// AI-CONTEXT: Resolved at render time from live Fluent UI tokens — applied as inline borderLeftColor so theme changes are reflected.
// AI-PATTERN: Add a new NoteType value and its token here; Notes picks it up automatically via NOTE_TYPE_COLORS[noteType].
const NOTE_TYPE_COLORS: Record<NoteType, string> = {
  default: tokens.colorBrandStroke1,
  info: tokens.colorPaletteBlueBorderActive,
  success: tokens.colorStatusSuccessBorderActive,
  warning: tokens.colorStatusWarningBorderActive,
  error: tokens.colorStatusDangerBorderActive,
}

/** Base props shared by all {@link Notes} variants. */
interface INotesBaseProps {
  /** The descriptive text to display inside the note block. */
  children: ReactNode
  /**
   * Semantic intent of the note, which controls the left-border accent colour.
   *
   * @defaultValue `'default'`
   * @see {@link NoteType}
   */
  noteType?: NoteType
  /**
   * Optional Fluent UI icon component rendered to the left of the text.
   * Pass the icon component itself (not a JSX element).
   *
   * @example
   * ```tsx
   * import { LightbulbRegular } from '@fluentui/react-icons'
   * <Notes defaultIcon={LightbulbRegular}>Tip: use filters to narrow results.</Notes>
   * ```
   */
  defaultIcon?: FluentIcon
}

/** {@link Notes} variant with no info popover. */
interface INotesWithoutInfoLabel extends INotesBaseProps {
  showInfoLabel?: never
  infoLabelLink?: never
}

/** {@link Notes} variant with an info popover — `showInfoLabel` and `infoLabelLink` are required together. */
interface INotesWithInfoLabel extends INotesBaseProps {
  /**
   * Content displayed inside the Fluent UI {@link InfoLabel} popover.
   * When provided, {@link infoLabelLink} is also required.
   */
  showInfoLabel: ReactNode
  /** URL rendered as a "Learn more" link inside the popover. Required when {@link showInfoLabel} is provided. */
  infoLabelLink: string
}

/**
 * Props for {@link Notes}.
 *
 * @example Minimal
 * ```tsx
 * <Notes>Some descriptive text.</Notes>
 * ```
 *
 * @example All noteType variants
 * ```tsx
 * <Notes noteType="default">General note.</Notes>
 * <Notes noteType="info">Tip or guidance.</Notes>
 * <Notes noteType="success">Completed successfully.</Notes>
 * <Notes noteType="warning">Caution — changes are immediate.</Notes>
 * <Notes noteType="error">Record could not be deleted.</Notes>
 * ```
 *
 * @example With icon and info popover
 * ```tsx
 * import { InfoRegular } from '@fluentui/react-icons'
 * <Notes
 *   noteType="info"
 *   defaultIcon={InfoRegular}
 *   showInfoLabel="OData v4 is used for all Dataverse REST calls."
 *   infoLabelLink="https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview"
 * >
 *   Records are fetched via the Web API.
 * </Notes>
 * ```
 */
export type INotesProps = INotesWithoutInfoLabel | INotesWithInfoLabel

/**
 * Styled note block with a semantic left-border accent for contextual descriptions and guidance.
 *
 * @remarks
 * **Render branches:**
 *
 * 1. **Without info popover** (`showInfoLabel` omitted) — renders a plain `Caption1` text block,
 *    optionally preceded by a Fluent UI icon tinted with the semantic accent colour.
 * 2. **With info popover** (`showInfoLabel` provided) — wraps `Caption1` inside a Fluent UI
 *    `InfoLabel`. The popover includes the label content and a "Learn more" link when
 *    `infoLabelLink` is set.
 *
 * The `borderLeftColor` is resolved at render time from {@link NOTE_TYPE_COLORS} and applied
 * as an inline style so it reacts to the active Fluent UI theme.
 *
 * @param props - See {@link INotesProps}.
 * @returns A `<div>` with a coloured left border, optional icon, and `Caption1` text.
 *
 * @example
 * ```tsx
 * <Notes noteType="warning">Changes are applied immediately and cannot be undone.</Notes>
 * ```
 */
export function Notes({ children, noteType = 'default', defaultIcon: Icon, showInfoLabel, infoLabelLink }: INotesProps) {
  const styles = useNotesStyles()
  // AI-CONTEXT: Resolved from NOTE_TYPE_COLORS and injected as inline style — keeps token values live with the active theme.
  const color = NOTE_TYPE_COLORS[noteType]
  // AI-CONTEXT: infoContent is undefined when showInfoLabel is omitted, suppressing the InfoLabel wrapper entirely.
  const infoContent = showInfoLabel
    ? (
      <>
        {showInfoLabel}
        {/* AI-CONTEXT: rel="noreferrer" prevents the new tab from accessing window.opener (security best practice). */}
        {infoLabelLink && <><br /><Link href={infoLabelLink} target="_blank" rel="noreferrer">Learn more</Link></> }
      </>
    )
    : undefined

  return (
    <div className={styles.root} style={{ borderLeftColor: color }}>
      <div className={styles.header}>
        {Icon && <span className={styles.icon} style={{ color }}><Icon /></span>}
        {showInfoLabel
          ? <InfoLabel info={infoContent}><Caption1 className={styles.text}>{children}</Caption1></InfoLabel>
          : <Caption1 className={styles.text}>{children}</Caption1>
        }
      </div>
    </div>
  )
}
