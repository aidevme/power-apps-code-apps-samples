import { makeStyles, tokens } from '@fluentui/react-components'

/** Styles for the {@link MainApp} grouped section-card grid. */
export const useMainAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    paddingTop: tokens.spacingVerticalL,
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    marginBottom: tokens.spacingVerticalS,
  },
  groupHeading: {
    color: tokens.colorNeutralForeground1,
    flexGrow: '1',
  },
  groupIcon: {
    width: '10px',
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
    flexShrink: '0',
  },
  groupIconBlue: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  groupIconPurple: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  groupIconGreen: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  groupIconMarigold: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
  },
  groupIconTeal: {
    backgroundColor: tokens.colorPaletteTealBackground2,
  },
  iconWrapperBlue: {
    color: tokens.colorPaletteBlueBorderActive,
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  iconWrapperPurple: {
    color: tokens.colorPalettePurpleBorderActive,
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  iconWrapperGreen: {
    color: tokens.colorPaletteGreenBorderActive,
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  iconWrapperMarigold: {
    color: tokens.colorPaletteMarigoldBorderActive,
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
  },
  iconWrapperTeal: {
    color: tokens.colorPaletteTealBorderActive,
    backgroundColor: tokens.colorPaletteTealBackground2,
  },
  groupCount: {
    color: tokens.colorNeutralForeground3,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: tokens.spacingVerticalXL,
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    paddingBottom: tokens.spacingVerticalM,
  },
  filterBtn: {
    borderRadius: tokens.borderRadiusCircular,
  },
  filterBtnActive: {
    backgroundColor: '#5A1A99',
    ':hover': {
      backgroundColor: '#6b20b8',
    },
    ':active': {
      backgroundColor: '#4a1580',
    },
  },
})
