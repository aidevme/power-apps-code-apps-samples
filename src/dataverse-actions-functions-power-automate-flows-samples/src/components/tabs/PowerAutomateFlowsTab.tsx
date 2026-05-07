import { Text, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '160px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
  },
})

export function PowerAutomateFlowsTab() {
  const styles = useStyles()
  return (
    <div className={styles.placeholder}>
      <Text>Power Automate Flows - coming soon</Text>
    </div>
  )
}
