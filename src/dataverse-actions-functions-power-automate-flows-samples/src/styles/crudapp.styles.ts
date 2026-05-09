import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the {@link CRUDApp} component. */
export const useCRUDAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  fieldWrapper: {
    maxWidth: '400px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
  },
})
