// AI-CONTEXT: Fluent UI v9 makeStyles definitions for the Notes component.
// AI-FILE-RELATIONS:
//   - consumer: src/components/misc/notes/Notes.tsx  (useNotesStyles drives the layout, icon tint, and text styles)
// AI-CONSTRAINT: Do not add component-specific styles from other components here — only Notes styles belong in this file.
// AI-PATTERN: One makeStyles call per component style file; do not merge with other component style files.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI v9 style hook for the {@link Notes} component.
 *
 * @remarks
 * Returns Griffel atomic CSS class names consumed exclusively by `Notes.tsx`.
 * Griffel deduplicates generated `<style>` rules across renders, so calling
 * this hook in multiple mounted instances has no performance cost.
 *
 * ### Class responsibilities
 * | Class | Purpose |
 * |---|---|
 * | `root`   | Flex column container with left border placeholder, neutral background, and small border radius |
 * | `header` | Flex row aligning the optional icon and text (or `InfoLabel`) side by side |
 * | `icon`   | Flex wrapper that vertically centres the icon glyph at `fontSizeBase300` |
 * | `text`   | `Caption1` text in `colorNeutralForeground2` with `lineHeightBase300` |
 *
 * @remarks
 * The `root` class sets `borderLeftWidth` and `borderLeftStyle` but intentionally
 * omits `borderLeftColor` — that value is injected at render time as an inline style
 * from `NOTE_TYPE_COLORS[noteType]` so it reacts to the active Fluent UI theme.
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
