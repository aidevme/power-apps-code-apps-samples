import { makeStyles, tokens } from '@fluentui/react-components'

/** Returns Fluent UI `makeStyles` classes for {@link DocumentationsApp}. */
export const useDocumentationsAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '860px',
    margin: '0 auto',
    paddingBottom: tokens.spacingVerticalXXL,
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
  markdown: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    '& h1': {
      fontSize: tokens.fontSizeHero900,
      fontWeight: tokens.fontWeightSemibold,
      marginBottom: tokens.spacingVerticalM,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      paddingBottom: tokens.spacingVerticalS,
    },
    '& h2': {
      fontSize: tokens.fontSizeHero700,
      fontWeight: tokens.fontWeightSemibold,
      marginTop: tokens.spacingVerticalXL,
      marginBottom: tokens.spacingVerticalS,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      paddingBottom: tokens.spacingVerticalXS,
    },
    '& h3': {
      fontSize: tokens.fontSizeBase500,
      fontWeight: tokens.fontWeightSemibold,
      marginTop: tokens.spacingVerticalL,
      marginBottom: tokens.spacingVerticalXS,
    },
    '& p': {
      marginTop: tokens.spacingVerticalS,
      marginBottom: tokens.spacingVerticalS,
    },
    '& a': {
      color: tokens.colorBrandForeground1,
      textDecorationLine: 'none',
    },
    '& a:hover': {
      textDecorationLine: 'underline',
    },
    '& ul, & ol': {
      paddingLeft: tokens.spacingHorizontalXL,
      marginTop: tokens.spacingVerticalXS,
      marginBottom: tokens.spacingVerticalS,
    },
    '& li': {
      marginBottom: tokens.spacingVerticalXS,
    },
    '& code': {
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: tokens.fontSizeBase200,
      backgroundColor: tokens.colorNeutralBackground3,
      borderRadius: tokens.borderRadiusSmall,
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingLeft: tokens.spacingHorizontalXS,
      paddingRight: tokens.spacingHorizontalXS,
    },
    '& pre': {
      backgroundColor: tokens.colorNeutralBackground3,
      borderRadius: tokens.borderRadiusMedium,
      padding: tokens.spacingVerticalM,
      overflowX: 'auto',
      marginTop: tokens.spacingVerticalS,
      marginBottom: tokens.spacingVerticalS,
    },
    '& pre code': {
      backgroundColor: 'transparent',
      padding: '0',
      fontSize: tokens.fontSizeBase200,
    },
    '& blockquote': {
      borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
      marginLeft: '0',
      paddingLeft: tokens.spacingHorizontalM,
      color: tokens.colorNeutralForeground2,
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      marginTop: tokens.spacingVerticalS,
      marginBottom: tokens.spacingVerticalS,
    },
    '& th, & td': {
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground3,
      fontWeight: tokens.fontWeightSemibold,
    },
    '& img': {
      maxWidth: '100%',
      borderRadius: tokens.borderRadiusMedium,
    },
    '& hr': {
      border: 'none',
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
      marginTop: tokens.spacingVerticalL,
      marginBottom: tokens.spacingVerticalL,
    },
  },
})
