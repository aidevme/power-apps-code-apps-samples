import { Title2, Body1, makeStyles, tokens } from '@fluentui/react-components'
import { WrenchRegular } from '@fluentui/react-icons'

/** Props for {@link DataverseCustomActionsApp}. */
export interface IDataverseCustomActionsAppProps {
  // reserved for future configuration props
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  icon: {
    fontSize: '48px',
  },
})

/**
 * Placeholder view for the Dataverse Custom Actions section.
 *
 * Demonstrates building and invoking user-defined Custom API Actions
 * registered in Dataverse via the PAC CLI-generated service layer.
 *
 * @example
 * ```tsx
 * <DataverseCustomActionsApp />
 * ```
 */
export function DataverseCustomActionsApp(_props: IDataverseCustomActionsAppProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <WrenchRegular className={styles.icon} />
      <Title2>Dataverse Custom Actions</Title2>
      <Body1>Coming soon — custom API action samples will appear here.</Body1>
    </div>
  )
}
