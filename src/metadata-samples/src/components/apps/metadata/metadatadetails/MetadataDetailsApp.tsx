// AI-CONTEXT: Metadata Details view — tabbed entity metadata viewer with inline tab rendering.
// AI-FILE-RELATIONS:
//   - consts:      src/components/ui/notes/Notes.consts.ts                                 (DETAILS_NOTE_* constants)
//   - notes:       src/components/ui/notes/index.ts                                        (Notes)
//   - table-tab:   src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataTableInfoTable)
//   - columns-tab: src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataColumnsTable)
//   - keys-tab:    src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataKeysTable)
//   - rel-tab:     src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataRelationshipTable, shared by oneToMany + manyToOne tabs)
//   - m2m-tab:     src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataManyToManyTable)
//   - priv-tab:    src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataPrivilegesTable)
//   - sol-tab:     src/components/ui/tables/metadata/MetadataTables.tsx                          (MetadataSolutionsTable)
//   - table-type:  src/hooks/metadata-hooks/entityMetadata.types.ts                        (IEntityTableInfo)
//   - consumer:    src/components/apps/main/MainApp.tsx                                    (route /metadata/details/:logicalName)
// AI-CONSTRAINT: tableInfoCache must be passed from MainApp via props — do not call useMetadataCache here.
// AI-PATTERN: Each tab block renders a component or a placeholder div; never inline table JSX.

import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Tab, TabList, Text, Tooltip, makeStyles, tokens } from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'
import { Notes } from '../../../ui/notes'
import { DETAILS_NOTE_INFO, DETAILS_NOTE_LINK } from '../../../ui/notes/Notes.consts'
import { MetadataTableInfoTable, MetadataColumnsTable, MetadataKeysTable, MetadataRelationshipTable, MetadataManyToManyTable, MetadataPrivilegesTable, MetadataSolutionsTable, type IAttributeRow, type IRelationshipRow, type IManyToManyRow, type IPrivilegeRow, type ISolutionRow } from '../../../ui/tables/metadata/MetadataTables'
import { TableRegular, ColumnTripleRegular, LockClosedKeyRegular, ArrowSplitRegular, ArrowJoinRegular, ArrowSwapRegular, ShieldLockRegular, AppsRegular } from '@fluentui/react-icons'
import type { IEntityTableInfo } from '../../../../hooks'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Union of valid tab identifiers for the {@link MetadataDetailsApp} tab strip. */
type DetailsTab =
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

const useMetadataDetailsAppStyles = makeStyles({
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
  tabIcon: {
    color: '#672367',
  },
  tabList: {
    '--colorCompoundBrandStroke': '#672367',
    '--colorCompoundBrandStrokeHover': '#672367',
    '--colorCompoundBrandStrokePressed': '#672367',
  },
})

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for {@link MetadataDetailsApp}. */
export interface IMetadataDetailsAppProps {
  /** Full entity table info cache from {@link useMetadataCache} — keyed by entity logical name. */
  tableInfoCache: Record<string, IEntityTableInfo>
  /** Attribute rows for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  columnsCache: Record<string, IAttributeRow[]>
  /** One-to-many relationship rows for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  oneToManyCache: Record<string, IRelationshipRow[]>
  /** Many-to-one relationship rows for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  manyToOneCache: Record<string, IRelationshipRow[]>
  /** Many-to-many relationship rows for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  manyToManyCache: Record<string, IManyToManyRow[]>
  /** Privilege rows for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  privilegesCache: Record<string, IPrivilegeRow[]>
  /** Solutions data for every loaded entity from {@link useMetadataCache} — keyed by entity logical name. */
  solutionsCache: Record<string, { loading: boolean; error: string | null; solutions: ISolutionRow[] }>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Tabbed metadata viewer for a single Dataverse entity.
 *
 * @remarks
 * Reads the `:logicalName` route param from `/metadata/details/:logicalName` and the
 * `displayName` navigation state from {@link MetadataEntitesTable}.
 * Looks up the full entity metadata from `tableInfoCache` and renders it across
 * eight tabs: Table, Columns, Keys, OneToManyRelationships, ManyToOneRelationships,
 * ManyToManyRelationships, Privileges, and Solutions.
 * Tabs without a dedicated component show a "coming soon" placeholder.
 *
 * @param props - See {@link IMetadataDetailsAppProps}.
 *
 * @example
 * ```tsx
 * // Rendered by react-router at /metadata/details/account
 * <MetadataDetailsApp tableInfoCache={tableInfoCache} />
 * ```
 */
export function MetadataDetailsApp({ tableInfoCache, columnsCache, oneToManyCache, manyToOneCache, manyToManyCache, privilegesCache, solutionsCache }: IMetadataDetailsAppProps) {
  const styles = useMetadataDetailsAppStyles()
  const { logicalName } = useParams<{ logicalName: string }>()
  // AI-CONTEXT: displayName is passed as navigation state from MetadataEntitesTable (schemaName).
  // Falls back to logicalName when arriving directly via URL without state.
  const { state } = useLocation()
  const [selectedTab, setSelectedTab] = useState<DetailsTab>('table')

  // AI-CONTEXT: displayName is derived from navigation state (schemaName) set by MetadataEntitesTable.
  const displayName = (state as { displayName?: string } | null)?.displayName ?? logicalName ?? 'Entity'
  // AI-CONTEXT: Look up the full IEntityTableInfo by logical name — undefined before cache is loaded.
  const tableInfo = tableInfoCache[logicalName ?? '']
  // AI-CONTEXT: Attribute rows for the current entity — undefined until the entity's hook response arrives.
  const columns = columnsCache[logicalName ?? '']
  // AI-CONTEXT: One-to-many relationships for the current entity — undefined until the entity's hook response arrives.
  const oneToManyRelationships = oneToManyCache[logicalName ?? '']
  // AI-CONTEXT: Many-to-one relationships for the current entity — undefined until the entity's hook response arrives.
  const manyToOneRelationships = manyToOneCache[logicalName ?? '']
  // AI-CONTEXT: Many-to-many relationships for the current entity — undefined until the entity's hook response arrives.
  const manyToManyRelationships = manyToManyCache[logicalName ?? '']
  // AI-CONTEXT: Privilege rows for the current entity — undefined until the entity's hook response arrives.
  const privileges = privilegesCache[logicalName ?? '']
  // AI-CONTEXT: Combined solutions loading/error/data for the current entity — undefined until main metadata loads.
  const solutionData = solutionsCache[logicalName ?? '']

  const description =
    `Displays the full metadata for the ${displayName ? `"${displayName}"` : 'selected'} Dataverse table — ` +
    'fields, data types, primary key, logical name, collection name, entity set name, and activity flags.'

  const handleTabSelect = (_ev: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as DetailsTab)
  }

  return (
    <div className={styles.root}>
      <Notes noteType="info" showInfoLabel={DETAILS_NOTE_INFO} infoLabelLink={DETAILS_NOTE_LINK}>
        {description}
      </Notes>

      <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect} className={styles.tabList}>
        <Tooltip content="Displays core entity definition properties from the Dataverse EntityDefinitions endpoint — logical name, schema name, entity set name, collection name, display name, primary key and name attributes, table type, ownership type, and activity flags such as isActivity, isActivityParty, isChildEntity, and isAuditEnabled." relationship="description" withArrow>
          <Tab value="table" icon={<TableRegular className={styles.tabIcon} />}>Table</Tab>
        </Tooltip>
        <Tooltip content="Lists all attribute (column) metadata for this entity — logical name, display name, attribute type (e.g. String, Lookup, Boolean, DateTime, Picklist), required level, and description. Sortable by logical name, display name, type, and description." relationship="description" withArrow>
          <Tab value="columns" icon={<ColumnTripleRegular className={styles.tabIcon} />}>Columns</Tab>
        </Tooltip>
        <Tooltip content="Shows the primary identifier and name attributes that uniquely identify records in this table — primaryIdAttribute (the GUID column used in OData URLs and entity references), primaryNameAttribute (the human-readable label column shown in lookups), and the full composite primary key column list." relationship="description" withArrow>
          <Tab value="keys" icon={<LockClosedKeyRegular className={styles.tabIcon} />}>Keys</Tab>
        </Tooltip>
        <Tooltip content="Lists all one-to-many (1:N) relationships where this entity is the referenced (one) side — other tables hold a foreign-key lookup pointing back to this table. Each row shows the OData schema name (used in $expand), the referencing entity and its foreign-key attribute, the referenced entity, the referenced primary-key attribute, and whether the relationship defines a parent–child hierarchy." relationship="description" withArrow>
          <Tab value="oneToMany" icon={<ArrowSplitRegular className={styles.tabIcon} />}>OneToManyRelationships</Tab>
        </Tooltip>
        <Tooltip content="Lists all many-to-one (N:1) relationships where this entity is the referencing (many) side — this table holds a foreign-key lookup column pointing to another table. These are the lookup columns visible in forms and views of this entity. Each row shows the schema name, the referencing entity and its foreign-key attribute, the referenced entity, the referenced primary-key attribute, and hierarchy flag." relationship="description" withArrow>
          <Tab value="manyToOne" icon={<ArrowJoinRegular className={styles.tabIcon} />}>ManyToOneRelationships</Tab>
        </Tooltip>
        <Tooltip content="Lists all many-to-many (N:N) relationships for this entity. Each row shows the OData schema name, both participating entity logical names, the intersect (junction) table that physically stores the association records, and the foreign-key attributes on the intersect table that link back to each participating entity." relationship="description" withArrow>
          <Tab value="manyToMany" icon={<ArrowSwapRegular className={styles.tabIcon} />}>ManyToManyRelationships</Tab>
        </Tooltip>
        <Tooltip content="Lists all Dataverse security privileges associated with this entity — such as prvCreateAccount, prvReadAccount, prvWriteAccount. Each row shows the privilege name, its record GUID, the CRUD-style privilege type (Create, Read, Write, Delete, Append, AppendTo, Assign, Share), and which depth levels (Basic, Local, Deep, Global) and entity reference scopes it supports." relationship="description" withArrow>
          <Tab value="privileges" icon={<ShieldLockRegular className={styles.tabIcon} />}>Privileges</Tab>
        </Tooltip>
        <Tooltip content="Lists all Power Platform solutions that contain this entity as a component (Dataverse component type 1). Each row shows the solution friendly name, unique programmatic name, version string (e.g. 1.0.0.0), and whether the solution is managed (read-only in this environment) or unmanaged (editable). Useful for identifying which solutions own or customise this table." relationship="description" withArrow>
          <Tab value="solutions" icon={<AppsRegular className={styles.tabIcon} />}>Solutions</Tab>
        </Tooltip>
      </TabList>

      <div className={styles.tabPanel}>
        {selectedTab === 'table' && (
          tableInfo
            ? <MetadataTableInfoTable loading={false} tableInfo={tableInfo} />
            : <div className={styles.placeholder}><Text>Loading table metadata…</Text></div>
        )}
        {selectedTab === 'columns' && (
          columns !== undefined
            ? <MetadataColumnsTable loading={false} attributes={columns} />
            : <div className={styles.placeholder}><Text>Loading columns…</Text></div>
        )}
        {selectedTab === 'keys' && (
          tableInfo
            ? <MetadataKeysTable
                loading={false}
                primaryIdAttribute={tableInfo.primaryIdAttribute}
                primaryNameAttribute={tableInfo.primaryNameAttribute}
                // AI-CONTEXT: primaryKey derived from primaryIdAttribute — Dataverse standard tables always have a single GUID primary key.
                primaryKey={tableInfo.primaryIdAttribute ? [tableInfo.primaryIdAttribute] : []}
              />
            : <div className={styles.placeholder}><Text>Loading keys…</Text></div>
        )}
        {selectedTab === 'oneToMany' && (
          oneToManyRelationships !== undefined
            ? <MetadataRelationshipTable
                loading={false}
                relationships={oneToManyRelationships}
                schemaNameTooltip="OData schema name for the one-to-many relationship, e.g. account_contacts"
              />
            : <div className={styles.placeholder}><Text>Loading relationships…</Text></div>
        )}
        {selectedTab === 'manyToOne' && (
          manyToOneRelationships !== undefined
            ? <MetadataRelationshipTable
                loading={false}
                relationships={manyToOneRelationships}
                schemaNameTooltip="OData schema name for the many-to-one relationship, e.g. account_primarycontactid"
              />
            : <div className={styles.placeholder}><Text>Loading relationships…</Text></div>
        )}
        {selectedTab === 'manyToMany' && (
          manyToManyRelationships !== undefined
            ? <MetadataManyToManyTable loading={false} relationships={manyToManyRelationships} />
            : <div className={styles.placeholder}><Text>Loading relationships…</Text></div>
        )}
        {selectedTab === 'privileges' && (
          privileges !== undefined
            ? <MetadataPrivilegesTable loading={false} privileges={privileges} />
            : <div className={styles.placeholder}><Text>Loading privileges…</Text></div>
        )}
        {selectedTab === 'solutions' && (
          solutionData !== undefined
            ? <MetadataSolutionsTable
                loading={solutionData.loading}
                error={solutionData.error}
                solutions={solutionData.solutions}
              />
            : <div className={styles.placeholder}><Text>Loading solutions…</Text></div>
        )}
      </div>
    </div>
  )
}
