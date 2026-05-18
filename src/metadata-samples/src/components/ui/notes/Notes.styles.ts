// AI-CONTEXT: Fluent UI makeStyles hook for the Notes component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside Notes.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link Notes} component.
 *
 * @remarks
 * The `root` class sets `borderLeftWidth` and `borderLeftStyle` but intentionally
 * omits `borderLeftColor` — that value is injected at render time as an inline style
 * from `NOTE_TYPE_COLORS[noteType]` so it reacts to the active Fluent UI theme.
 *
 * | Class | Purpose |
 * |---|---|
 * | `root`   | Flex column container with left-border placeholder and neutral background |
 * | `header` | Flex row aligning the optional icon and text side by side |
 * | `icon`   | Flex wrapper that vertically centres the icon glyph |
 * | `text`   | `Caption1` text in `colorNeutralForeground2` |
 */
export const useNotesStyles = makeStyles({
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
