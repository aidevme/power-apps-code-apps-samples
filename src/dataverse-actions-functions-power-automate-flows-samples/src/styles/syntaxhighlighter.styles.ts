import { makeStyles, tokens } from '@fluentui/react-components'

export const useSyntaxHighlighterStyles = makeStyles({
  wrapper: {
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
    '& pre': {
      margin: '0',
      padding: tokens.spacingHorizontalM,
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: tokens.fontSizeBase200,
      lineHeight: tokens.lineHeightBase300,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    },
  },
  lineNumbers: {
    '& code': {
      counterReset: 'line',
    },
    '& .line': {
      display: 'inline-block',
      width: '100%',
    },
    '& .line::before': {
      counterIncrement: 'line',
      content: 'counter(line)',
      display: 'inline-block',
      width: '2em',
      marginRight: tokens.spacingHorizontalM,
      textAlign: 'right',
      color: tokens.colorNeutralForeground3,
      userSelect: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  languageLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
  },
  fallback: {
    display: 'block',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})
