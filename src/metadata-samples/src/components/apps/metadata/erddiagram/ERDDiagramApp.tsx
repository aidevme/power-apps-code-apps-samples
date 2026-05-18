// AI-CONTEXT: ERD Diagram view — page title, guidance note, solution selector, and publisher selector Lookups.
// AI-FILE-RELATIONS:
//   - styles:   src/components/apps/metadata/erddiagram/ERDDiagramApp.styles.ts
//   - notes:    src/components/ui/notes/index.ts                            (Notes)
//   - consts:   src/components/apps/metadata/erddiagram/Notes.consts.ts     (note string constants)
//   - spinner:  src/components/ui/spinners/CustomSpinner.tsx                (CustomSpinner — loading overlay)
//   - lookup:   src/components/ui/lookup/Lookup.tsx                         (Lookup — solution + publisher selectors)
//   - hook:     src/hooks/dataverse-hooks/useSolutions.ts                   (useSolutions)
//   - hook:     src/hooks/dataverse-hooks/usePublishers.ts                  (usePublishers)
//   - consumer: src/components/apps/metadata/MetadataApp.tsx                (navigates here at /metadata/erd)
// AI-CONSTRAINT: Do not drill solutions or publishers data down as props — hooks are owned by this component.

import { Title2, Text, Button, Tooltip } from '@fluentui/react-components'
import { LinkMultiple20Regular, ArrowClockwise20Regular, Eye20Regular, EyeOffRegular } from '@fluentui/react-icons'
import { Notes } from '../../../ui/notes'
import { CustomSpinner } from '../../../ui/spinners'
import { Lookup } from '../../../ui/lookup'
import { ERD_NOTE_TEXT, ERD_NOTE_INFO, ERD_NOTE_LINK } from '../../../ui/notes/Notes.consts'
import { useSolutions, usePublishers } from '../../../../hooks'
import { TableCardsList } from '../../../ui/cards/tablecardslist'
import { useERDDiagramAppStyles } from './ERDDiagramApp.styles'

// AI-CONTEXT: Placeholder table list — replace with data from a useEntities hook once available.
const MOCK_TABLES = [
  { displayName: 'Account', logicalName: 'account' },
  { displayName: 'Contact', logicalName: 'contact' },
  { displayName: 'Opportunity', logicalName: 'opportunity' },
  { displayName: 'Lead', logicalName: 'lead' },
  { displayName: 'Case', logicalName: 'incident' },
  { displayName: 'Activity', logicalName: 'activitypointer' },
  { displayName: 'Email', logicalName: 'email' },
  { displayName: 'Task', logicalName: 'task' },
  { displayName: 'Phone Call', logicalName: 'phonecall' },
  { displayName: 'Appointment', logicalName: 'appointment' },
  { displayName: 'Queue', logicalName: 'queue' },
  { displayName: 'Queue Item', logicalName: 'queueitem' },
  { displayName: 'Product', logicalName: 'product' },
  { displayName: 'Invoice', logicalName: 'invoice' },
  { displayName: 'Order', logicalName: 'salesorder' },
]

/**
 * ERD Diagram section view.
 *
 * @remarks
 * Renders a page title, a guidance note, and a solution selector {@link Lookup} populated
 * from the Dataverse `solutions` table via {@link useSolutions}.
 * Selecting a solution will scope the entity-relationship diagram to that solution's components.
 *
 * @returns A `<section>` element containing the heading, note, and solution Lookup.
 *
 * @example
 * ```tsx
 * <ERDDiagramApp />
 * ```
 */
export function ERDDiagramApp() {
  const { solutions, isLoading: isLoadingSolutions, error: solutionsError } = useSolutions()
  const { publishers, isLoading: isLoadingPublishers, error: publishersError } = usePublishers()
  const styles = useERDDiagramAppStyles()
  const isLoading = isLoadingSolutions || isLoadingPublishers

  return (
    <section>
      {/* AI-CONTEXT: Label progresses through each loading phase in the order they complete. */}
      {isLoading && (
        <CustomSpinner
          label={isLoadingPublishers ? 'Loading publishers…' : 'Loading solutions…'}
        />
      )}

      <Title2 as="h2" style={{ marginBottom: '1rem', display: 'block' }}>ERD Diagram</Title2>
      <Notes
        noteType="info"
        showInfoLabel={ERD_NOTE_INFO}
        infoLabelLink={ERD_NOTE_LINK}
      >
        {ERD_NOTE_TEXT}
      </Notes>

      {/* AI-CONTEXT: Two-column grid — left column holds selectors, right column is reserved for the ERD canvas. */}
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          {/* AI-CONTEXT: Publisher selector — filters the ERD diagram entities by publisher prefix. */}
          <Lookup
            entityType='publisher'
            viewId=''
            isDisabled={isLoadingPublishers}
            label="Publisher"
            placeholder="Select a publisher"
            className={styles.solutionField}
            items={publishers.map(p => ({ key: p.publisherid, text: p.friendlyname }))}
            error={publishersError}
          />

          {/* AI-CONTEXT: Solution selector — scopes the ERD diagram to a specific solution's components. */}
          <Lookup
            entityType='solution'
            viewId=''
            isDisabled={isLoadingSolutions}
            label="Solution"
            placeholder="Select a solution"
            className={styles.solutionField}
            items={solutions.map(s => ({ key: s.solutionid, text: s.friendlyname }))}
            error={solutionsError}
          />

          {/* AI-CONTEXT: Grid refresh button — triggers entity reload for the selected solution. */}
          <Tooltip content="Reload the entity grid for the selected solution" relationship="label" withArrow>
            <Button className={styles.gridButton} icon={<ArrowClockwise20Regular />} iconPosition="after">
              Grid
            </Button>
          </Tooltip>

          {/* AI-CONTEXT: Expand All / Collapse All — second row of canvas control buttons. */}
          <div className={styles.buttonGroup}>
            <Tooltip content="Expand all table nodes on the ERD canvas" relationship="label" withArrow>
              <Button className={styles.groupButton} icon={<Eye20Regular />} iconPosition="after">
                Expand All
              </Button>
            </Tooltip>
            <Tooltip content="Collapse all table nodes on the ERD canvas" relationship="label" withArrow>
              <Button className={styles.groupButton} icon={<EyeOffRegular />} iconPosition="after">
                Collapse All
              </Button>
            </Tooltip>
          </div>

          {/* AI-CONTEXT: Tables list — populated once a solution is selected. */}
          <TableCardsList items={MOCK_TABLES} />

          {/* AI-CONTEXT: Legend explaining the colour coding and icon conventions used in the ERD diagram. */}
          <div className={styles.legend}>
            <Text className={styles.legendTitle}>Legend</Text>
            <div className={styles.legendItem}>
              <div className={styles.legendSquareCustom} />
              <Text>Custom Table</Text>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendSquareStandard} />
              <Text>Standard Table</Text>
            </div>
            <div className={styles.legendItem}>
              <LinkMultiple20Regular className={styles.legendLinkIcon} />
              <Text>Has Lookup Fields</Text>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn} />
      </div>
    </section>
  )
}

