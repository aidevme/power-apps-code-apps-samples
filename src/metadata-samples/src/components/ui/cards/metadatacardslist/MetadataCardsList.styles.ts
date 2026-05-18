// AI-CONTEXT: Fluent UI makeStyles hook for the MetadataCardsList component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside MetadataCardsList.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link MetadataCardsList} component.
 *
 * @remarks
 * | Class  | Purpose                                              |
 * |---|---|
 * | `grid` | 3-column CSS grid that lays out strategy cards 3×2   |
 */
export const useMetadataCardsListStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalM,
  },
})
