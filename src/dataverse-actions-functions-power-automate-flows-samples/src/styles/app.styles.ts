import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the top-level {@link App} component. */
export const useAppStyles = makeStyles({
  loadingOverlay: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 242, 241, 0.65)',
    zIndex: 1000,
  },
  startupOverlay: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 2000,
  },
})
