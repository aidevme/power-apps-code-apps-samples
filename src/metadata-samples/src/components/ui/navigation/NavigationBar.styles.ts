// AI-CONTEXT: Fluent UI makeStyles hook for the NavigationBar component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside NavigationBar.tsx.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link NavigationBar} component.
 *
 * | Class | Purpose |
 * |---|---|
 * | `root`  | Full-width flex row wrapper with bottom border separator |
 * | `crumb` | Purple hover accent on breadcrumb buttons |
 */
export const useNavigationBarStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    marginBottom: tokens.spacingVerticalM,
  },
  crumb: {
    ':hover': { color: tokens.colorPalettePurpleBorderActive },
  },
})
