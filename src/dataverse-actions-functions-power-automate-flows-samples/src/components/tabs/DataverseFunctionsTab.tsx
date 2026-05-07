import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Spinner,
  Title1,
  Body1,
} from '@fluentui/react-components'
import { WhoAmIService } from '../../generated'
import { idle, useTabStyles, ResultBox } from './tabShared'
import type { SectionState } from './tabShared'

export function DataverseFunctionsTab() {
  const styles = useTabStyles()
  const [whoAmIState, setWhoAmIState] = useState<SectionState>(idle)

  async function getCurrentUser() {
    const result = await WhoAmIService.WhoAmI()
    if (!result.success || result.data == null) {
      throw new Error(result.error?.message ?? 'WhoAmI returned no data')
    }
    return result.data
  }

  return (
    <div className={styles.tabPanel}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <div className={styles.row}>
              <Title1 as="h2">WhoAmI</Title1>
              <Badge appearance="tint" color="brand">Function - GET</Badge>
            </div>
          }
        />
        <Body1 className={styles.cardDescription}>
          Returns the current user&apos;s <strong>UserId</strong>,{' '}
          <strong>BusinessUnitId</strong>, and <strong>OrganizationId</strong>{' '}
          from Dataverse. Uses the generated <code>WhoAmIService</code> typed client.
        </Body1>
        <Button
          appearance="primary"
          icon={whoAmIState.status === 'loading' ? <Spinner size="tiny" /> : undefined}
          disabled={whoAmIState.status === 'loading'}
          onClick={() => {
            setWhoAmIState({ status: 'loading', result: '' })
            getCurrentUser()
              .then(value => setWhoAmIState({ status: 'success', result: JSON.stringify(value, null, 2) }))
              .catch(err => setWhoAmIState({ status: 'error', result: String(err) }))
          }}
        >
          {whoAmIState.status === 'loading' ? 'Calling...' : 'Call WhoAmI'}
        </Button>
        <ResultBox state={whoAmIState} />
      </Card>
    </div>
  )
}
