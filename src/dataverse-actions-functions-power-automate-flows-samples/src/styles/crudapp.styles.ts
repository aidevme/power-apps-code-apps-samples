import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the {@link CRUDApp} component. */
export const useCRUDAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: tokens.spacingHorizontalS,
  },
  entitySelectorContainer: {
    flexGrow: 1,
    maxWidth: '400px',
  },
  menuItemText: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '220px',
  },
  fieldCard: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow4,
    transition: 'box-shadow 0.2s ease, border 0.2s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
  },
  tableCard: {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow4,
    transition: 'box-shadow 0.2s ease, border 0.2s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
  },
  descriptionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS,
    borderLeft: `3px solid ${tokens.colorBrandStroke1}`,
    paddingLeft: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
})
