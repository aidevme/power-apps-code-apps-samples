import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Spinner,
  Title1,
  Body1,
} from '@fluentui/react-components'
import { AddToQueueService } from '../../generated'
import type { AddToQueueRequest } from '../../generated'
import { idle, useTabStyles, ResultBox } from './tabShared'
import type { SectionState } from './tabShared'

export function DataverseActionsTab() {
  const styles = useTabStyles()
  const [destinationQueueId, setDestinationQueueId] = useState('')
  const [targetType, setTargetType] = useState('letter')
  const [targetId, setTargetId] = useState('')
  const [addToQueueState, setAddToQueueState] = useState<SectionState>(idle)

  async function handleAddToQueue() {
    setAddToQueueState({ status: 'loading', result: '' })
    try {
      const request: AddToQueueRequest = {
        Target: {
          '@odata.type': `Microsoft.Dynamics.CRM.${targetType}`,
          activityid: targetId,
        },
        DestinationQueueId: destinationQueueId,
      }
      const result = await AddToQueueService.AddToQueue(request)
      setAddToQueueState({ status: 'success', result: JSON.stringify(result, null, 2) })
    } catch (err) {
      setAddToQueueState({ status: 'error', result: String(err) })
    }
  }

  return (
    <div className={styles.tabPanel}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <div className={styles.row}>
              <Title1 as="h2">AddToQueue</Title1>
              <Badge appearance="tint" color="success">Action - POST</Badge>
            </div>
          }
        />
        <Body1 className={styles.cardDescription}>
          Moves a Dataverse activity record into the specified queue. Uses the generated{' '}
          <code>AddToQueueService</code> typed client. Returns the new{' '}
          <strong>QueueItemId</strong>.
        </Body1>
        <Field label="Destination Queue ID (GUID)">
          <Input
            placeholder="e.g. 00000000-0000-0000-0000-000000000001"
            value={destinationQueueId}
            onChange={(_, d) => setDestinationQueueId(d.value)}
          />
        </Field>
        <Field label="Target entity logical name">
          <Input
            placeholder="e.g. letter, email, task"
            value={targetType}
            onChange={(_, d) => setTargetType(d.value)}
          />
        </Field>
        <Field label="Target record ID (GUID)">
          <Input
            placeholder="e.g. 00000000-0000-0000-0000-000000000002"
            value={targetId}
            onChange={(_, d) => setTargetId(d.value)}
          />
        </Field>
        <Button
          appearance="primary"
          icon={addToQueueState.status === 'loading' ? <Spinner size="tiny" /> : undefined}
          disabled={addToQueueState.status === 'loading' || !destinationQueueId || !targetId}
          onClick={() => { void handleAddToQueue() }}
        >
          {addToQueueState.status === 'loading' ? 'Adding...' : 'Add To Queue'}
        </Button>
        <ResultBox state={addToQueueState} />
      </Card>
    </div>
  )
}
