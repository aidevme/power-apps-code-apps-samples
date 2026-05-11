import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Tab, TabList, Text, makeStyles, tokens, Tooltip,
  Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell,
  Spinner,
} from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'
import { Notes } from '../misc/Notes'
import type { NoteType } from '../misc/Notes'
import type { EntitiesModel } from '../../generated'
import type { IUseAadUserMetadataResult, IUseAccountMetadataResult, IUseAppEventLogMetadataResult, IUseContactMetadataResult } from '../../hooks'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENTITY_DETAILS_APP_NOTE_TYPE: NoteType = 'info'
const ENTITY_DETAILS_APP_INFO_LABEL_TEXT =
  'Metadata is fetched from the Dataverse EntityDefinitions endpoint (/api/data/v9.2/EntityDefinitions). ' +
  'Field details are resolved via the Attributes collection on the entity definition.'
const ENTITY_DETAILS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The tab identifiers available in {@link EntityDetailsApp}. */
type EntityDetailsTabValue =
  | 'table'
  | 'columns'
  | 'keys'
  | 'oneToMany'
  | 'manyToOne'
  | 'manyToMany'
  | 'privileges'
  | 'solutions'

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useEntityDetailsAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  tabPanel: {
    paddingTop: tokens.spacingVerticalM,
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '160px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
})

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for {@link EntityDetailsApp}. */
export interface IEntityDetailsAppProps {
  /** Entity metadata records used to resolve the display name from the `?entity` query parameter. */
  entities: EntitiesModel.Entities[]
  /** Metadata result for the Account table, used to populate the Table tab when the selected entity is `"account"`. */
  accountMetadata: IUseAccountMetadataResult
  /** Metadata result for the AadUser table, used to populate the Table tab when the selected entity is `"aaduser"`. */
  aadUserMetadata: IUseAadUserMetadataResult
  /** Metadata result for the AppEventLog table, used to populate the Table tab when the selected entity is `"aidevme_appeventlog"`. */
  appEventLogMetadata: IUseAppEventLogMetadataResult
  /** Metadata result for the Contact table, used to populate the Table tab when the selected entity is `"contact"`. */
  contactMetadata: IUseContactMetadataResult
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Displays the schema and metadata details for a selected Dataverse table.
 *
 * Reads the `?entity` query parameter set by {@link CRUDApp} when the user
 * opens entity options and selects "Show entity details". Organises metadata
 * into tabs: Table, Columns, Keys, OneToManyRelationships,
 * ManyToOneRelationships, ManyToManyRelationships, Privileges, and Solutions.
 *
 * @example
 * ```tsx
 * <EntityDetailsApp entities={entities} />
 * ```
 */
export function EntityDetailsApp({ entities, accountMetadata, aadUserMetadata, appEventLogMetadata, contactMetadata }: IEntityDetailsAppProps) {
  const styles = useEntityDetailsAppStyles()
  const [searchParams] = useSearchParams()
  const [selectedTab, setSelectedTab] = useState<EntityDetailsTabValue>('table')
  const [sortColumn, setSortColumn] = useState<'name' | 'type' | 'value' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  const entityLogicalName = searchParams.get('entity')
  const match = entities.find(e => e.logicalname === entityLogicalName)
  const displayName = match?.name ?? entityLogicalName

  const tableMetadataResult =
    entityLogicalName === 'account' ? { loading: accountMetadata.loading, tableInfo: accountMetadata.tableInfo }
    : entityLogicalName === 'aaduser' ? { loading: aadUserMetadata.loading, tableInfo: aadUserMetadata.tableInfo }
    : entityLogicalName === 'aidevme_appeventlog' ? { loading: appEventLogMetadata.loading, tableInfo: appEventLogMetadata.tableInfo }
    : entityLogicalName === 'contact' ? { loading: contactMetadata.loading, tableInfo: contactMetadata.tableInfo }
    : null

  const description =
    `Displays the full metadata for the ${displayName ? `"${displayName}"` : 'selected'} Dataverse table — ` +
    'fields, data types, primary key, logical name, collection name, entity set name, and activity flags.'

  const handleTabSelect = (_ev: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as EntityDetailsTabValue)
  }

  const handleColumnSort = (col: 'name' | 'type' | 'value') => {
    if (sortColumn === col) {
      setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    } else {
      setSortColumn(col)
      setSortDirection('ascending')
    }
  }

  const tableInfoEntries = tableMetadataResult
    ? (Object.entries(tableMetadataResult.tableInfo) as Array<[string, boolean | string | number | null]>)
    : []
  const sortedTableInfoEntries = [...tableInfoEntries].sort(([ka, va], [kb, vb]) => {
    if (sortColumn === null) return 0
    let a = ''
    let b = ''
    if (sortColumn === 'name') { a = toLabel(ka); b = toLabel(kb) }
    else if (sortColumn === 'type') { a = va === null ? '' : typeof va; b = vb === null ? '' : typeof vb }
    else { a = va === null ? '' : String(va); b = vb === null ? '' : String(vb) }
    return sortDirection === 'ascending' ? a.localeCompare(b) : b.localeCompare(a)
  })

  return (
    <div className={styles.root}>
      <Notes
        noteType={ENTITY_DETAILS_APP_NOTE_TYPE}
        showInfoLabel={ENTITY_DETAILS_APP_INFO_LABEL_TEXT}
        infoLabelLink={ENTITY_DETAILS_APP_INFO_LABEL_LINK}
      >
        {description}
      </Notes>

      <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
        <Tab value="table">Table</Tab>
        <Tab value="columns">Columns</Tab>
        <Tab value="keys">Keys</Tab>
        <Tab value="oneToMany">OneToManyRelationships</Tab>
        <Tab value="manyToOne">ManyToOneRelationships</Tab>
        <Tab value="manyToMany">ManyToManyRelationships</Tab>
        <Tab value="privileges">Privileges</Tab>
        <Tab value="solutions">Solutions</Tab>
      </TabList>

      <div className={styles.tabPanel}>
        {selectedTab === 'table' && (
          tableMetadataResult
            ? tableMetadataResult.loading
              ? <Spinner size="small" label="Loading table metadata…" />
              : (
                <Table size="small">
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'name' ? sortDirection : undefined} onClick={() => handleColumnSort('name')}>
                        <Tooltip content="The camelCase property name from the entity metadata record" relationship="label" withArrow>
                          <span>Name</span>
                        </Tooltip>
                      </TableHeaderCell>
                      <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'type' ? sortDirection : undefined} onClick={() => handleColumnSort('type')}>
                        <Tooltip content="The JavaScript typeof the value — string, number, boolean, or null" relationship="label" withArrow>
                          <span>Type</span>
                        </Tooltip>
                      </TableHeaderCell>
                      <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'value' ? sortDirection : undefined} onClick={() => handleColumnSort('value')}>
                        <Tooltip content="The raw value returned by the EntityDefinitions metadata endpoint" relationship="label" withArrow>
                          <span>Value</span>
                        </Tooltip>
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTableInfoEntries.map(([key, val]) => (
                      <TableRow key={key}>
                        <TableCell>{toLabel(key)}</TableCell>
                        <TableCell>{val === null ? '—' : typeof val}</TableCell>
                        <TableCell>{val === null ? '—' : String(val)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            : <div className={styles.placeholder}><Text>Table — coming soon</Text></div>
        )}
        {selectedTab === 'columns' && (
          <div className={styles.placeholder}>
            <Text>Columns — coming soon</Text>
          </div>
        )}
        {selectedTab === 'keys' && (
          <div className={styles.placeholder}>
            <Text>Keys — coming soon</Text>
          </div>
        )}
        {selectedTab === 'oneToMany' && (
          <div className={styles.placeholder}>
            <Text>OneToManyRelationships — coming soon</Text>
          </div>
        )}
        {selectedTab === 'manyToOne' && (
          <div className={styles.placeholder}>
            <Text>ManyToOneRelationships — coming soon</Text>
          </div>
        )}
        {selectedTab === 'manyToMany' && (
          <div className={styles.placeholder}>
            <Text>ManyToManyRelationships — coming soon</Text>
          </div>
        )}
        {selectedTab === 'privileges' && (
          <div className={styles.placeholder}>
            <Text>Privileges — coming soon</Text>
          </div>
        )}
        {selectedTab === 'solutions' && (
          <div className={styles.placeholder}>
            <Text>Solutions — coming soon</Text>
          </div>
        )}
      </div>
    </div>
  )
}
