import { Caption1, InfoLabel, Link, makeStyles, tokens } from '@fluentui/react-components'
import type { FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

/**
 * Semantic intent variants that drive the left-border accent colour of {@link Notes}.
 *
 * | Value | Border colour | Typical use |
 * |---|---|---|
 * | `'default'` | Brand blue (`colorBrandStroke1`) | General informational notes |
 * | `'info'`    | Blue (`colorPaletteBlueBorderActive`) | Neutral guidance or tips |
 * | `'success'` | Green (`colorStatusSuccessBorderActive`) | Confirmation or completed state |
 * | `'warning'` | Amber (`colorStatusWarningBorderActive`) | Caution or potential issues |
 * | `'error'`   | Red (`colorStatusDangerBorderActive`) | Errors or destructive actions |
 */
export type NoteType = 'default' | 'info' | 'success' | 'warning' | 'error'

const NOTE_TYPE_COLORS: Record<NoteType, string> = {
  default: tokens.colorBrandStroke1,
  info: tokens.colorPaletteBlueBorderActive,
  success: tokens.colorStatusSuccessBorderActive,
  warning: tokens.colorStatusWarningBorderActive,
  error: tokens.colorStatusDangerBorderActive,
}

const useNotesStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    paddingLeft: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: tokens.fontSizeBase300,
  },
  text: {
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
})

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
 * The left-border colour is driven by {@link INotesProps.noteType}.
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
 */
export function Notes({ children, noteType = 'default', defaultIcon: Icon, showInfoLabel, infoLabelLink }: INotesProps) {
  const styles = useNotesStyles()
  const color = NOTE_TYPE_COLORS[noteType]
  const infoContent = showInfoLabel
    ? (
      <>
        {showInfoLabel}
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
