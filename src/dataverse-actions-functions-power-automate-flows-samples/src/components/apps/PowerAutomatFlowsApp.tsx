import {
  Badge,
  Body1,
  Body2,
  Button,
  Caption1,
  Card,
  CardHeader,
  Dropdown,
  Field,
  Input,
  Option,
  Spinner,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { FlowRegular, SendRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { useWorkflows, fetchWorkflowDetail } from '../../hooks'
import type { Workflows } from '../../generated/models/WorkflowsModel'
import { Follow_upflowService } from '../../generated/services/Follow_upflowService'

/** Dataverse `uniquename` of the Follow-up flow registered via `pac code add-logic-flow`. */
const FOLLOW_UP_FLOW_UNIQUENAME = 'follow_upflow'

const FLOW_TYPE_LABELS: Record<number, string> = {
  0: 'Power Automate',
  1: 'Copilot Studio',
  2: 'M365 Copilot Agent',
}

function getFlowTypeLabel(flow: Workflows): string {
  if (flow.modernflowtypename) return flow.modernflowtypename
  if (flow.modernflowtype != null) return FLOW_TYPE_LABELS[Number(flow.modernflowtype)] ?? String(flow.modernflowtype)
  return 'Power Automate'
}

function isPowerAppsV2Trigger(flow: Workflows | null): boolean {
  return flow?.clientdata?.includes('"PowerAppsV2"') ?? false
}

function isFollowUpFlow(flow: Workflows): boolean {
  return (
    flow.uniquename === FOLLOW_UP_FLOW_UNIQUENAME ||
    flow.name?.toLowerCase().replace(/[-\s]/g, '') === 'followupflow'
  )
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '560px',
  },
  detail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    marginTop: tokens.spacingVerticalS,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  runForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  runRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'flex-end',
  },
  inputGrow: {
    flexGrow: 1,
  },
})

/** Props for {@link PowerAutomateFlowsApp}. */
export interface IPowerAutomateFlowsAppProps {
  // reserved for future configuration props
}

/**
 * Renders a dropdown of Power Automate cloud flows from Dataverse. Selecting a
 * flow shows its metadata and — for flows registered with `pac code add-logic-flow`
 * — a form to trigger the flow via the generated service.
 *
 * @example
 * ```tsx
 * <PowerAutomateFlowsApp />
 * ```
 */
export function PowerAutomateFlowsApp(_props: IPowerAutomateFlowsAppProps) {
  const styles = useStyles()
  const { flows, loading } = useWorkflows()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailFlow, setDetailFlow] = useState<Workflows | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [description, setDescription] = useState('')
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<'success' | 'error' | null>(null)

  const selectedFlow = flows.find(f => f.workflowid === selectedId) ?? null

  const handleSelect = async (id: string | null) => {
    setSelectedId(id)
    setDetailFlow(null)
    setRunResult(null)
    setAccountId('')
    setDescription('')
    if (!id) return
    setDetailLoading(true)
    const detail = await fetchWorkflowDetail(id)
    setDetailFlow(detail)
    setDetailLoading(false)
  }

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'

  const handleRun = async () => {
    if (!accountId.trim() || !description.trim()) return
    setRunning(true)
    setRunResult(null)
    try {
      const result = await Follow_upflowService.Run({ text: accountId.trim(), text_1: description.trim() })
      if (!result.success) {
        console.error('[Follow_upflowService.Run] SDK error:', result.error)
        setRunResult('error')
      } else if (result.data?.issuccess === false) {
        console.error('[Follow_upflowService.Run] Flow returned failure:', result.data.message)
        setRunResult('error')
      } else {
        setRunResult('success')
      }
    } catch (err) {
      console.error('[Follow_upflowService.Run] Exception:', err)
      setRunResult('error')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className={styles.root}>
      {loading ? (
        <Spinner label="Loading flows…" size="medium" />
      ) : (
        <>
          <Field label="Power Automate Flow" hint={`${flows.length} flow${flows.length !== 1 ? 's' : ''} found`}>
            <Dropdown
              placeholder={flows.length === 0 ? 'No flows found' : 'Select a flow…'}
              onOptionSelect={(_, data) => { handleSelect(data.optionValue ?? null) }}
            >
              {flows.map(flow => (
                <Option key={flow.workflowid} value={flow.workflowid} text={flow.name}>
                  {flow.name}
                </Option>
              ))}
            </Dropdown>
          </Field>

          {selectedFlow && (
            <Card>
              <CardHeader
                image={<FlowRegular fontSize={24} />}
                header={<Body2>{selectedFlow.name}</Body2>}
                description={<Caption1>{getFlowTypeLabel(selectedFlow)}</Caption1>}
              />

              {detailLoading ? (
                <Spinner size="tiny" label="Loading details…" />
              ) : (
                <div className={styles.detail}>
                  <div className={styles.detailItem}>
                    <Caption1>Trigger</Caption1>
                    {isPowerAppsV2Trigger(detailFlow)
                      ? <Badge appearance="filled" color="brand">Power Apps v2</Badge>
                      : <Body1>—</Body1>
                    }
                  </div>
                  <div className={styles.detailItem}>
                    <Caption1>Status</Caption1>
                    <Body1>{detailFlow?.statecodename ?? selectedFlow.statecodename ?? '—'}</Body1>
                  </div>
                  <div className={styles.detailItem}>
                    <Caption1>Owner</Caption1>
                    <Body1>{detailFlow?.owneridname ?? selectedFlow.owneridname ?? '—'}</Body1>
                  </div>
                  <div className={styles.detailItem}>
                    <Caption1>Modified</Caption1>
                    <Body1>{formatDate(selectedFlow.modifiedon)}</Body1>
                  </div>
                  <div className={styles.detailItem}>
                    <Caption1>Created</Caption1>
                    <Body1>{formatDate(selectedFlow.createdon)}</Body1>
                  </div>
                </div>
              )}

              {!detailLoading && isFollowUpFlow(selectedFlow) && (
                <div className={styles.runForm} style={{ colorScheme: 'light' }}>
                  <Body2>Trigger flow</Body2>
                  <Field label="Account ID">
                    <Input
                      appearance="outline"
                      value={accountId}
                      onChange={(_, d) => setAccountId(d.value)}
                      placeholder="Enter account GUID…"
                      disabled={running}
                    />
                  </Field>
                  <div className={styles.runRow}>
                    <Field label="Description" className={styles.inputGrow}>
                      <Textarea
                        appearance="outline"
                        value={description}
                        onChange={(_, d) => setDescription(d.value)}
                        placeholder="Enter description…"
                        disabled={running}
                        rows={5}
                      />
                    </Field>
                  </div>
                  <Button
                    appearance="primary"
                    icon={running ? <Spinner size="tiny" /> : <SendRegular />}
                    onClick={handleRun}
                    disabled={running || !accountId.trim() || !description.trim()}
                  >
                    Run
                  </Button>
                  {runResult === 'success' && <Caption1 style={{ color: tokens.colorPaletteGreenForeground1 }}>Flow triggered successfully.</Caption1>}
                  {runResult === 'error' && <Caption1 style={{ color: tokens.colorPaletteRedForeground1 }}>Failed to trigger flow. Check the browser console for details.</Caption1>}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}


