import { Title2, Body1, makeStyles, tokens } from '@fluentui/react-components'
import { PlugConnectedRegular } from '@fluentui/react-icons'

/** Props for {@link DataverseCustomAPIsApp}. */
export interface IDataverseCustomAPIsAppProps {
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
 * Placeholder view for the Dataverse Custom APIs section.
 *
 * Demonstrates registering and calling user-defined Custom API endpoints
 * (both Functions and Actions) in Dataverse, leveraging PAC CLI tooling
 * for schema discovery and typed service generation.
 *
 * @example
 * ```tsx
 * <DataverseCustomAPIsApp />
 * ```
 */
export function DataverseCustomAPIsApp(_props: IDataverseCustomAPIsAppProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <PlugConnectedRegular className={styles.icon} />
      <Title2>Dataverse Custom APIs</Title2>
      <Body1>Coming soon — custom API registration and invocation samples will appear here.</Body1>
    </div>
  )
}
