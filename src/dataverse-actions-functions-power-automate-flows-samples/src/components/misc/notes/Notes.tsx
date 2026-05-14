// AI-CONTEXT: Reusable styled note block component — renders children with a semantic left-border accent colour driven by NoteType.
// AI-FILE-RELATIONS:
//   - barrel:   src/components/index.ts                                      (re-exports Notes, INotesProps, NoteType)
//   - styles:   src/styles/index.ts                                         (useNotesStyles — re-exported from the styles barrel)
//   - consumer: src/components/apps/**/*.tsx                                 (all app-level panels that display contextual guidance)
//   - consumer: src/components/panels/ViewDetailsPanel.tsx                   (inline record detail notes)
//   - consumer: src/tools/notes.const.ts                                     (imports NoteType for shared note-type constants)
// AI-PATTERN: Add new semantic variants by extending NoteType and NOTE_TYPE_COLORS — never inline border colours in consumers.
// AI-CONSTRAINT: This is a pure presentational component — it must never own state, call hooks beyond useNotesStyles, or fetch data.

import { Caption1, InfoLabel, Link, tokens } from '@fluentui/react-components'
import type { FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'
import { useNotesStyles } from '../../../styles'

/**
 * Semantic intent variants that drive the left-border accent colour of {@link Notes}.
 *
 * @remarks
 * Each value maps to a Fluent UI design-token colour in {@link NOTE_TYPE_COLORS}.
 * Add new variants there and here together — never inline token values in consumers.
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

/**
 * Lookup map from {@link NoteType} to its Fluent UI design-token border colour.
 *
 * @remarks
 * Consumed by {@link Notes} to apply `borderLeftColor` via an inline style.
 * Extend this map whenever a new {@link NoteType} variant is added.
 */
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
   * | Value | Border colour | Typical use |
   * |---|---|---|
   * | `'default'` | Brand blue | General informational notes |
   * | `'info'` | Blue | Neutral guidance or tips |
   * | `'success'` | Green | Confirmation or completed state |
   * | `'warning'` | Amber | Caution or potential issues |
   * | `'error'` | Red | Errors or destructive actions |
   *
   * @defaultValue `'default'`
   * @see {@link NoteType}
   */
  noteType?: NoteType
  /**
   * Optional Fluent UI icon component rendered to the left of the text.
   * Pass the icon component itself (not a JSX element).
   * When omitted, no icon is shown.
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

/** {@link Notes} variant with an info popover — both `showInfoLabel` and `infoLabelLink` are required together. */
interface INotesWithInfoLabel extends INotesBaseProps {
  /**
   * Content displayed inside the Fluent UI {@link InfoLabel} popover rendered after the note text.
   * When provided, {@link infoLabelLink} is also required.
   *
   * @example
   * ```tsx
   * <Notes
   *   noteType="warning"
   *   showInfoLabel="Deleting a record is permanent and cannot be reversed."
   *   infoLabelLink="https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview"
   * >
   *   Changes are applied immediately.
   * </Notes>
   * ```
   */
  showInfoLabel: ReactNode
  /**
   * URL rendered as a "Learn more" {@link Link} inside the {@link InfoLabel} popover.
   * Required when {@link showInfoLabel} is provided.
   */
  infoLabelLink: string
}

/**
 * Props for {@link Notes}.
 *
 * When {@link INotesWithInfoLabel.showInfoLabel} is supplied,
 * {@link INotesWithInfoLabel.infoLabelLink} is mandatory.
 *
 * @example Minimal usage (brand-blue left border)
 * ```tsx
 * <Notes>Some descriptive text.</Notes>
 * ```
 *
 * @example All noteType variants
 * ```tsx
 * <Notes noteType="default">General note — brand-blue border.</Notes>
 * <Notes noteType="info">Tip or neutral guidance — blue border.</Notes>
 * <Notes noteType="success">Confirmation or completed state — green border.</Notes>
 * <Notes noteType="warning">Caution or potential issue — amber border.</Notes>
 * <Notes noteType="error">Error or destructive action — red border.</Notes>
 * ```
 *
 * @example With info popover
 * ```tsx
 * <Notes
 *   noteType="info"
 *   showInfoLabel="OData v4 is used for all Dataverse REST calls."
 *   infoLabelLink="https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview"
 * >
 *   Records are fetched via the Web API.
 * </Notes>
 * ```
 */
export type INotesProps = INotesWithoutInfoLabel | INotesWithInfoLabel

/**
 * Styled note block with a brand-coloured left border for displaying contextual
 * descriptions, guidance, or status messages.
 *
 * @remarks
 * **Render branches:**
 *
 * 1. **Without info popover** (`showInfoLabel` is omitted) — renders a plain
 *    `Caption1` text block, optionally preceded by a Fluent UI icon tinted with
 *    the semantic accent colour.
 *
 * 2. **With info popover** (`showInfoLabel` is provided) — wraps the `Caption1`
 *    inside a Fluent UI `InfoLabel`. The popover body contains the `showInfoLabel`
 *    content and, when `infoLabelLink` is set, a "Learn more" anchor that opens
 *    in a new tab with `rel="noreferrer"`.
 *
 * The left-border colour is resolved at render time from {@link NOTE_TYPE_COLORS}
 * using the `noteType` prop and applied as an inline style so the value is
 * computed from live Fluent UI tokens rather than static CSS.
 *
 * @param props - See {@link INotesProps} for the full prop reference.
 * @returns A `<div>` container styled with a coloured left border, optional icon,
 * and `Caption1` text (optionally wrapped in an `InfoLabel` popover).
 *
 * @example Default (brand-blue border)
 * ```tsx
 * <Notes>Perform CRUD operations against Dataverse table records.</Notes>
 * ```
 *
 * @example Info note
 * ```tsx
 * <Notes noteType="info">Records are read-only in this view.</Notes>
 * ```
 *
 * @example Success note
 * ```tsx
 * <Notes noteType="success">All records were imported successfully.</Notes>
 * ```
 *
 * @example Warning note
 * ```tsx
 * <Notes noteType="warning">Changes are applied immediately and cannot be undone.</Notes>
 * ```
 *
 * @example Error note
 * ```tsx
 * <Notes noteType="error">The selected record could not be deleted.</Notes>
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
export function Notes({ children, noteType = 'default', defaultIcon: Icon, showInfoLabel, infoLabelLink }: INotesProps) {
  const styles = useNotesStyles()
  // AI-CONTEXT: Resolved at render time from NOTE_TYPE_COLORS — applied as inline style so Fluent UI tokens are live.
  const color = NOTE_TYPE_COLORS[noteType]
  // AI-CONTEXT: infoContent is undefined when showInfoLabel is omitted, which suppresses the InfoLabel wrapper entirely.
  const infoContent = showInfoLabel
    ? (
      <>
        {showInfoLabel}
        {/* AI-CONTEXT: rel="noreferrer" prevents the opener from accessing window.opener in the new tab (security best practice). */}
        {infoLabelLink && <><br /><Link href={infoLabelLink} target="_blank" rel="noreferrer">Learn more</Link></>}
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
