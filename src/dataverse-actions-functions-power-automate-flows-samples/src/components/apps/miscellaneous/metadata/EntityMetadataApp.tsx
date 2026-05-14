import {
  makeStyles, tokens,
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell,
  Text, Tooltip, Link, Caption2,
} from '@fluentui/react-components'
import { PersonRegular, BuildingRegular, PeopleRegular, BriefcaseRegular, ProhibitedRegular, OrganizationRegular, FilterRegular, TableRegular, TableLightningRegular, CubeRegular, CalendarCheckmarkRegular } from '@fluentui/react-icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notes } from '../../../misc/notes/Notes'
import type { NoteType } from '../../../misc/notes/Notes'
import type { IEntityMetadataCacheEntry } from '../../../selectors/EntitySelector'
import { ROUTES } from '../../../../tools/routes'

const ENTITY_METADATA_APP_NOTE_TYPE: NoteType = 'info'
const ENTITY_METADATA_APP_DESCRIPTION =
  'Browse the full schema for a selected Dataverse table — columns, data types, primary key, ' +
  'alternate keys, one-to-many, many-to-one and many-to-many relationships, security privileges, and solution membership.'
const ENTITY_METADATA_APP_INFO_LABEL_TEXT =
  'Metadata is fetched from the Dataverse EntityDefinitions endpoint (/api/data/v9.2/EntityDefinitions). ' +
  'Field details are resolved via the Attributes collection on the entity definition.'
const ENTITY_METADATA_APP_INFO_LABEL_LINK =
  'https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query-metadata-web-api'

/** Styles for {@link EntityMetadataApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
  },
  truncatedCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    display: 'block',
  },
  statusBar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground2,
    border: `1px solid ${tokens.colorBrandStroke2}`,
  },
  statusDivider: {
    width: '1px',
    height: '12px',
    backgroundColor: tokens.colorBrandStroke1,
  },
  statusLabel: {
    color: tokens.colorBrandForeground2,
  },
  statusValue: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  cellWithIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  firstCol: {
    width: '250px',
    minWidth: '250px',
  },
  objectTypeCodeCol: {
    width: '150px',
    minWidth: '150px',
  },
})

function getTableTypeIcon(tableType: string | null, isActivity: boolean | null): React.ReactElement | null {
  if (isActivity) return <CalendarCheckmarkRegular style={{ color: tokens.colorPaletteTealForeground1 }} />
  switch (tableType) {
    case 'Standard': return <TableRegular style={{ color: tokens.colorBrandForeground1 }} />
    case 'Virtual':  return <CubeRegular style={{ color: tokens.colorPalettePurpleForeground1 }} />
    case 'Elastic':  return <TableLightningRegular style={{ color: tokens.colorPaletteMarigoldForeground1 }} />
    default: return null
  }
}

function getOwnershipTypeIcon(ownershipType: string | null): React.ReactElement | null {
  switch (ownershipType) {
    case 'None':             return <ProhibitedRegular style={{ color: tokens.colorPaletteRedForeground1 }} />
    case 'UserOwned':        return <PersonRegular style={{ color: tokens.colorBrandForeground1 }} />
    case 'TeamOwned':        return <PeopleRegular style={{ color: tokens.colorPalettePurpleForeground1 }} />
    case 'BusinessOwned':    return <BriefcaseRegular style={{ color: tokens.colorPaletteMarigoldForeground1 }} />
    case 'OrganizationOwned': return <BuildingRegular style={{ color: tokens.colorPaletteGreenForeground1 }} />
    case 'BusinessParented': return <OrganizationRegular style={{ color: tokens.colorPaletteTealForeground1 }} />
    case 'Filtered':         return <FilterRegular style={{ color: tokens.colorPaletteBerryForeground1 }} />
    default: return null
  }
}

/** Props for {@link EntityMetadataApp}. */
export interface IEntityMetadataAppProps {
  /**
   * Pre-built map of entity logical name → metadata summary populated at app startup.
   * Provides the Logical Name, Schema Name, Object Type Code, and Table Type columns.
   * When `undefined` or empty, a placeholder message is shown instead of the table.
   */
  metadataCache?: Record<string, IEntityMetadataCacheEntry>
}

/**
 * Displays entity metadata browsing guidance and a table of all registered Dataverse
 * entities sourced from the startup metadata cache.
 *
 * @remarks
 * The table columns are: Logical Name, Schema Name, Object Type Code, and Table Type.
 * Rows are derived from the `metadataCache` prop built in `App.tsx` from all startup
 * metadata hooks. When the cache is empty or not yet ready, a placeholder is shown.
 *
 * @example
 * ```tsx
 * <EntityMetadataApp metadataCache={metadataCache} />
 * ```
 */
export function EntityMetadataApp({ metadataCache }: IEntityMetadataAppProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  type SortCol = 'logicalName' | 'schemaName' | 'entityTypeCode' | 'tableType' | 'ownershipType' | 'primaryIdAttribute' | 'description'
  const [sortCol, setSortCol] = useState<SortCol>('logicalName')
  const [sortDir, setSortDir] = useState<'ascending' | 'descending'>('ascending')

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortCol(col); setSortDir('ascending') }
  }

  const rows = Object.values(metadataCache ?? {})
    .slice()
    .sort((a, b) => {
      if (sortCol === 'entityTypeCode') {
        const na = a.entityTypeCode ?? -1
        const nb = b.entityTypeCode ?? -1
        return sortDir === 'ascending' ? na - nb : nb - na
      }
      const va = (a[sortCol] ?? '') as string
      const vb = (b[sortCol] ?? '') as string
      return sortDir === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  return (
    <div className={styles.root}>
      <Notes
        noteType={ENTITY_METADATA_APP_NOTE_TYPE}
        showInfoLabel={ENTITY_METADATA_APP_INFO_LABEL_TEXT}
        infoLabelLink={ENTITY_METADATA_APP_INFO_LABEL_LINK}
      >
        {ENTITY_METADATA_APP_DESCRIPTION}
      </Notes>

      {rows.length === 0 ? (
        <div className={styles.placeholder}>
          <Text>No entity metadata available yet.</Text>
        </div>
      ) : (
        <>
        <Table size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={`${styles.headerCell} ${styles.firstCol}`} sortDirection={sortCol === 'logicalName' ? sortDir : undefined} onClick={() => handleSort('logicalName')}>
                <Tooltip content="The logical name for the entity." relationship="label" withArrow>
                  <span>Logical Name</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell} sortDirection={sortCol === 'schemaName' ? sortDir : undefined} onClick={() => handleSort('schemaName')}>
                <Tooltip content="The schema name for the entity." relationship="label" withArrow>
                  <span>Schema Name</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={`${styles.headerCell} ${styles.objectTypeCodeCol}`} sortDirection={sortCol === 'entityTypeCode' ? sortDir : undefined} onClick={() => handleSort('entityTypeCode')}>
                <Tooltip content="The entity type code." relationship="label" withArrow>
                  <span>Object Type Code</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell} sortDirection={sortCol === 'tableType' ? sortDir : undefined} onClick={() => handleSort('tableType')}>
                <Tooltip content="Whether the table is standard or elastic." relationship="label" withArrow>
                  <span>Table Type</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                <Tooltip content="Whether the entity is an activity." relationship="label" withArrow>
                  <span>Is Activity</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell} sortDirection={sortCol === 'ownershipType' ? sortDir : undefined} onClick={() => handleSort('ownershipType')}>
                <Tooltip content="The ownership type for the entity." relationship="label" withArrow>
                  <span>Ownership Type</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell} sortDirection={sortCol === 'primaryIdAttribute' ? sortDir : undefined} onClick={() => handleSort('primaryIdAttribute')}>
                <Tooltip content="The name of the attribute that is the primary id for the entity." relationship="label" withArrow>
                  <span>Primary Id Attribute</span>
                </Tooltip>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell} sortDirection={sortCol === 'description' ? sortDir : undefined} onClick={() => handleSort('description')}>
                <Tooltip content="The label containing the description for the entity." relationship="label" withArrow>
                  <span>Description</span>
                </Tooltip>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(entry => (
              <TableRow key={entry.logicalName}>
                <TableCell className={styles.firstCol}>
                  <Tooltip content={entry.logicalName} relationship="description" withArrow>
                    <Link className={styles.truncatedCell} onClick={() => navigate(`${ROUTES.ENTITY_DETAILS}?entity=${entry.logicalName}`)}>
                      {entry.logicalName}
                    </Link>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip content={entry.schemaName} relationship="description" withArrow>
                    <span className={styles.truncatedCell}>{entry.schemaName}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={styles.objectTypeCodeCol}>{entry.entityTypeCode ?? '—'}</TableCell>
                <TableCell>
                  <span className={styles.cellWithIcon}>
                    {getTableTypeIcon(entry.tableType, entry.isActivity)}
                    {entry.tableType}
                  </span>
                </TableCell>
                <TableCell>
                  {entry.isActivity === true ? 'Yes' : entry.isActivity === false ? 'No' : '—'}
                </TableCell>
                <TableCell>
                  <span className={styles.cellWithIcon}>
                    {getOwnershipTypeIcon(entry.ownershipType)}
                    {entry.ownershipType ?? '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip content={entry.primaryIdAttribute ?? '—'} relationship="description" withArrow>
                    <span className={styles.truncatedCell}>{entry.primaryIdAttribute ?? '—'}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip content={entry.description ?? '—'} relationship="description" withArrow>
                    <span className={styles.truncatedCell}>{entry.description ?? '—'}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={styles.statusBar}>
          <Caption2 className={styles.statusLabel}>Rows</Caption2>
          <Caption2 className={styles.statusValue}>{rows.length}</Caption2>
        </div>
        </>
      )}
    </div>
  )
}