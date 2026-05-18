// AI-CONTEXT: Fluent UI makeStyles hook for the Lookup component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside Lookup.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link Lookup} component.
 *
 * @remarks
 * | Class        | Purpose                                                                  |
 * |---|---|
 * | `dropdown`   | Stretches the Dropdown to fill the width of its parent `Field`           |
 * | `errorText`  | Applies the Fluent UI danger foreground token for the inline error message |
 */
export const useLookupStyles = makeStyles({
  dropdown: {
    width: '100%',
  },
  errorText: {
    color: tokens.colorStatusDangerForeground1,
    fontSize: tokens.fontSizeBase200,
  },
})
