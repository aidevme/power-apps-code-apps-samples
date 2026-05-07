import { Text, makeStyles, tokens } from '@fluentui/react-components'

const useCRUDOperationsTabStyles = makeStyles({
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

export function CRUDOperationsTab() {
  const styles = useCRUDOperationsTabStyles()
  return (
    <div className={styles.placeholder}>
      <Text>CRUD Operations - coming soon</Text>
    </div>
  )
}
