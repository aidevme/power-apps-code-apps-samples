// AI-CONTEXT: Fluent UI makeStyles hook for the MetadataBrowserApp component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside MetadataBrowserApp.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link MetadataBrowserApp} component.
 *
 * @remarks
 * | Class           | Purpose                                                                 |
 * |---|---|
 * | `solutionField` | Constrains the solution `Lookup` to a readable max width                |
 * | `tableWrapper`  | Scroll container for the entity metadata table                          |
 */
export const useMetadataBrowserAppStyles = makeStyles({
  solutionField: {
    marginTop: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  tableWrapper: {
    marginTop: tokens.spacingVerticalL,
    overflowX: 'auto',
  },
})
