// AI-CONTEXT: Fluent UI makeStyles hook for the CustomSpinner component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside CustomSpinner.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link CustomSpinner} component.
 *
 * @remarks
 * | Class     | Purpose                                                              |
 * |---|---|
 * | `overlay` | Fixed full-viewport overlay that centres the loading `Spinner`       |
 */
export const useCustomSpinnerStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    opacity: '0.85',
    zIndex: '9999',
  },
})
