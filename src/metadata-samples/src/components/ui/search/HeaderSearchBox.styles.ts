// AI-CONTEXT: Fluent UI makeStyles hook for the HeaderSearchBox component — ghost search input styled for the purple gradient header.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside HeaderSearchBox.tsx.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link HeaderSearchBox} component.
 *
 * | Class | Purpose |
 * |---|---|
 * | `searchRow`  | Constrains width and left-aligns the input within the header flow |
 * | `searchBox`  | Semi-transparent ghost appearance that blends with the gradient background |
 */
export const useHeaderSearchBoxStyles = makeStyles({
  searchRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '600px',
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: tokens.colorNeutralForegroundOnBrand,
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.55)',
    },
    ':focus-within': {
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
    },
  },
})
