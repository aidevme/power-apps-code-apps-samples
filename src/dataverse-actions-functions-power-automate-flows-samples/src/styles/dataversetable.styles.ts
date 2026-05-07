import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the {@link DataverseTable} component. */
export const useDataverseTableStyles = makeStyles({
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
  selectedRow: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  toolbar: {
    paddingBottom: tokens.spacingVerticalS,
  },
  statusBar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground2,
    border: `1px solid ${tokens.colorBrandStroke2}`,
  },
  statusDivider: {
    width: '1px',
    height: '12px',
    backgroundColor: tokens.colorBrandStroke1,
  },
  statusLabel: {
    color: tokens.colorBrandForeground2,
  },
  statusValue: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
})
