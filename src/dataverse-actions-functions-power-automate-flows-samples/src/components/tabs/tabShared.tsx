import { tokens, makeStyles, shorthands } from '@fluentui/react-components'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface SectionState {
  status: Status
  result: string
}

export const idle: SectionState = { status: 'idle', result: '' }

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const useTabStyles = makeStyles({
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    paddingTop: tokens.spacingVerticalM,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL),
  },
  cardDescription: {
    color: tokens.colorNeutralForeground3,
  },
  resultBox: {
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  resultSuccess: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorStatusSuccessBorder1),
    color: tokens.colorStatusSuccessForeground1,
  },
  resultError: {
    backgroundColor: tokens.colorStatusDangerBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorStatusDangerBorder1),
    color: tokens.colorStatusDangerForeground1,
  },
  resultLoading: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground3,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
})

// ---------------------------------------------------------------------------
// ResultBox
// ---------------------------------------------------------------------------

export function ResultBox({ state }: { state: SectionState }) {
  const styles = useTabStyles()
  if (state.status === 'idle') return null

  const cls =
    state.status === 'loading'
      ? styles.resultLoading
      : state.status === 'success'
        ? styles.resultSuccess
        : styles.resultError

  return (
    <pre className={`${styles.resultBox} ${cls}`}>
      {state.status === 'loading' ? 'Loading...' : state.result || '(no response body)'}
    </pre>
  )
}
