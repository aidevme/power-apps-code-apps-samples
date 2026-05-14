import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the {@link AppSearchBox} component. */
export const useSearchBoxStyles = makeStyles({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  filledLighter: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  filledLighterLabel: {
    color: tokens.colorNeutralForegroundInverted2,
  },
  filledDarker: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  filledDarkerLabel: {
    color: tokens.colorNeutralForegroundInverted2,
  },
  fieldWrapper: {
    padding: `${tokens.spacingVerticalMNudge} ${tokens.spacingHorizontalMNudge}`,
    width: '100%',
  },
})
