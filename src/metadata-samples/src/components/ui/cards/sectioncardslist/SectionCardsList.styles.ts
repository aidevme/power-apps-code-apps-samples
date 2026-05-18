// AI-CONTEXT: Fluent UI makeStyles hook for the SectionCardsList responsive grid container.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside SectionCardsList.tsx.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link SectionCardsList} component.
 *
 * | Class        | Purpose |
 * |---|---|
 * | `root`        | Outer container with vertical margins |
 * | `grid`        | Responsive CSS grid that auto-fills columns of at least 280 px |
 * | `groupSection`| Wrapper for one group's header + grid, with bottom spacing |
 * | `groupHeader` | Flex row: dot + label on the left, count on the right |
 * | `groupTitle`  | Inner flex row holding the indicator dot and group label |
 * | `groupDot`    | Small circular indicator; colour is overridden per-group via inline style |
 * | `groupCount`  | Muted sample count label |
 */
export const useSectionCardsListStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXL,
    marginBottom: tokens.spacingVerticalXL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingVerticalXL,
  },
  groupSection: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalS,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  groupTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  groupDot: {
    width: '10px',
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    flexShrink: 0,
    // AI-CONTEXT: Default brand colour; overridden per-group via inline style when ISectionCardsGroup.color is set.
    backgroundColor: tokens.colorBrandBackground2,
  },
  groupCount: {
    color: tokens.colorNeutralForeground3,
  },
})
