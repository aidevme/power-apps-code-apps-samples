import { makeStyles, tokens } from '@fluentui/react-components'

export const useSectionCardStyles = makeStyles({
  card: {
    width: '100%',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-2px)',
    },
  },
  iconWrapper: {
    borderRadius: tokens.borderRadiusMedium,
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: '24px',
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  body: {
    margin: '0',
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingBottom: tokens.spacingVerticalM,
  },
  footer: {
    justifyContent: 'flex-end',
  },
  openButton: {
    backgroundColor: '#5A1A99',
    ':hover': {
      backgroundColor: '#6b20b8',
    },
    ':active': {
      backgroundColor: '#4a1580',
    },
  },
})
