// AI-CONTEXT: Standalone entity metadata table — renders a Fluent UI Table of Dataverse entity rows.
// AI-FILE-RELATIONS:
//   - footer:    src/components/apps/metadata/metadatabrowser/components/MetadataEntitesTableFooter.tsx
//   - consumer:  src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.tsx
//   - routes:    src/tools/routes.ts  (ROUTES.METADATA_DETAILS — navigation target for row clicks)
// AI-CONSTRAINT: Pure presentation — no hooks or service calls; all data comes from the `entities` prop.
// AI-PATTERN: Replace MOCK_ENTITIES with a real metadata hook result when the query layer is ready.

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MetadataEntitesTableFooter } from './MetadataEntitesTableFooter'
import {
  Table, TableHeader, TableHeaderCell, TableRow, TableBody, TableCell, TableCellLayout,
  Tooltip, Link, makeStyles, tokens,
} from '@fluentui/react-components'
import { ROUTES } from '../../../../../tools'

const useStyles = makeStyles({
  table: {
    tableLayout: 'fixed',
    width: '100%',
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    overflowX: 'hidden',
    overflowY: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cell: {
    overflowX: 'hidden',
    overflowY: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

// AI-CONTEXT: Number of rows shown per page in the entity metadata table.
const PAGE_SIZE = 10

// AI-CONTEXT: Column key used for sort state — matches IEntityTableRow property names.
type SortColumn = keyof IEntityTableRow
type SortDirection = 'ascending' | 'descending'

/** Shape of a single row in the entity metadata table. */
export interface IEntityTableRow {
  /** Dataverse logical name (lowercase, publisher-prefixed for custom tables). */
  logicalName: string
  /** Pascal-cased schema name as stored in Dataverse. */
  schemaName: string
  /** Numeric object type code assigned by Dataverse. */
  objectTypeCode: number
  /** Storage type of the table. */
  tableType: 'Standard' | 'Virtual' | 'Elastic'
  /** Whether the table participates in the activity framework. */
  isActivity: boolean
  /** Ownership model that governs record-level security. */
  ownershipType: 'OrganizationOwned' | 'UserOwned' | 'BusinessOwned' | 'None'
  /** Logical name of the primary key attribute. */
  primaryIdAttribute: string
  /** Short human-readable description of the table's purpose. */
  description: string
}

/** Props accepted by the {@link MetadataEntitesTable} component. */
export interface IMetadataEntitesTableProps {
  /** Entity rows to display; sourced from the metadata cache built by {@link useMetadataCache}. */
  entities: IEntityTableRow[]
}

/**
 * Fluent UI table displaying Dataverse entity metadata rows.
 *
 * @remarks
 * Columns: Logical Name, Schema Name, Object Type Code, Table Type, Is Activity,
 * Ownership Type, Primary Id Attribute, Description.
 * Renders the `entities` prop passed from {@link MetadataBrowserApp}.
 *
 * @param props - {@link IMetadataEntitesTableProps}
 * @example
 * ```tsx
 * <MetadataEntitesTable entities={entities} />
 * ```
 */
export function MetadataEntitesTable({ entities }: IMetadataEntitesTableProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')
  const [currentPage, setCurrentPage] = useState(0)

  // AI-CONTEXT: Toggles direction when clicking the active column; resets to ascending and page to 0 for a new column.
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    } else {
      setSortColumn(column)
      setSortDirection('ascending')
    }
    setCurrentPage(0)
  }

  const sortedEntities = useMemo(() => {
    if (!sortColumn) return entities
    return [...entities].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      let cmp: number
      if (typeof aVal === 'boolean') {
        cmp = (aVal ? 1 : 0) - (bVal as boolean ? 1 : 0)
      } else if (typeof aVal === 'number') {
        cmp = aVal - (bVal as number)
      } else {
        cmp = String(aVal).localeCompare(String(bVal))
      }
      return sortDirection === 'ascending' ? cmp : -cmp
    })
  }, [sortColumn, sortDirection, entities])

  // AI-CONTEXT: Slice of sortedEntities for the current page, controlled by PAGE_SIZE.
  const pagedEntities = sortedEntities.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(sortedEntities.length / PAGE_SIZE)
  const firstRow = currentPage * PAGE_SIZE + 1
  const lastRow = Math.min((currentPage + 1) * PAGE_SIZE, sortedEntities.length)

  return (
    <>
      <Table className={styles.table}>
        <TableHeader>
        <TableRow>
          <Tooltip content="Lowercase identifier used in API calls and OData queries" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'logicalName' ? sortDirection : undefined} onClick={() => handleSort('logicalName')}>Logical Name</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Pascal-cased name as stored in Dataverse metadata" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'schemaName' ? sortDirection : undefined} onClick={() => handleSort('schemaName')}>Schema Name</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Numeric code assigned by Dataverse to identify the entity type" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'objectTypeCode' ? sortDirection : undefined} onClick={() => handleSort('objectTypeCode')}>Object Type Code</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Storage model: Standard (relational), Virtual (external), or Elastic (NoSQL)" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'tableType' ? sortDirection : undefined} onClick={() => handleSort('tableType')}>Table Type</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Whether the table participates in the Dataverse activity framework" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'isActivity' ? sortDirection : undefined} onClick={() => handleSort('isActivity')}>Is Activity</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Security model controlling who owns and can access records" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'ownershipType' ? sortDirection : undefined} onClick={() => handleSort('ownershipType')}>Ownership Type</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Logical name of the unique identifier (primary key) attribute" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'primaryIdAttribute' ? sortDirection : undefined} onClick={() => handleSort('primaryIdAttribute')}>Primary Id Attribute</TableHeaderCell>
          </Tooltip>
          <Tooltip content="Human-readable summary of the table's purpose" relationship="description" withArrow>
            <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'description' ? sortDirection : undefined} onClick={() => handleSort('description')}>Description</TableHeaderCell>
          </Tooltip>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagedEntities.map(entity => (
          <TableRow key={entity.logicalName}>
            <Tooltip content={entity.logicalName} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}><Link onClick={() => navigate(`${ROUTES.METADATA_DETAILS}/${entity.logicalName}`, { state: { displayName: entity.schemaName } })}>{entity.logicalName}</Link></TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.schemaName} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.schemaName}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={String(entity.objectTypeCode)} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.objectTypeCode}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.tableType} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.tableType}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.isActivity ? 'Yes' : 'No'} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.isActivity ? 'Yes' : 'No'}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.ownershipType} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.ownershipType}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.primaryIdAttribute} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.primaryIdAttribute}</TableCellLayout></TableCell>
            </Tooltip>
            <Tooltip content={entity.description} relationship="label" withArrow>
              <TableCell><TableCellLayout className={styles.cell}>{entity.description}</TableCellLayout></TableCell>
            </Tooltip>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <MetadataEntitesTableFooter
      currentPage={currentPage}
      totalPages={totalPages}
      firstRow={firstRow}
      lastRow={lastRow}
      totalRows={sortedEntities.length}
      onPreviousPage={() => setCurrentPage(p => p - 1)}
      onNextPage={() => setCurrentPage(p => p + 1)}
    />
    </>
  )
}
