// AI-CONTEXT: Pure-presentation sortable table components for each EntityDetailsApp metadata tab.
// AI-FILE-RELATIONS:
//   - consumer: src/components/apps/EntityDetailsApp.tsx (the only caller)
//   - types:    src/hooks/metadata-hooks/entityMetadata.types.ts (IEntityTableInfo)
// AI-CONSTRAINT: Never add business logic or service calls here — all data arrives via props.
// AI-PATTERN: Each component owns its own sort state; EntityDetailsApp passes raw unsorted data only.

import { useState } from 'react'
import {
  makeStyles, tokens, Tooltip, Spinner,
  Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell,
  Text, Link,
} from '@fluentui/react-components'
import type { IEntityTableInfo } from '../../../../hooks/metadata-hooks/entityMetadata.types'

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useMetadataTableStyles = makeStyles({
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
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
  truncatedCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    maxWidth: '300px',
  },
})

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const toLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

// ---------------------------------------------------------------------------
// Shared row interfaces (exported so consumers can type result objects)
// ---------------------------------------------------------------------------

/**
 * A single attribute (column) row for display in {@link MetadataColumnsTable}.
 *
 * @remarks Structurally compatible with `IAccountAttributeMetadata` and peer interfaces;
 * only the fields required by the table are declared here.
 */
export interface IAttributeRow {
  /** Dataverse logical column name, e.g. `"name"`. */
  logicalName: string
  /** User-localised display label. */
  displayName: string
  /** Dataverse attribute type string, e.g. `"StringType"`. */
  attributeType: string
  /** Whether the field is required on Dataverse forms. */
  isRequiredForForm: boolean
  /** User-localised description of the column purpose. Empty string when not set. */
  description: string
}

/**
 * A one-to-many or many-to-one relationship row for display in {@link MetadataRelationshipTable}.
 */
export interface IRelationshipRow {
  /** OData schema name for the relationship, e.g. `"account_contacts"`. */
  schemaName: string
  /** Logical name of the entity that holds the foreign key (the many side). */
  referencingEntity: string
  /** Logical name of the foreign-key attribute on the referencing entity. */
  referencingAttribute: string
  /** Logical name of the referenced entity (the one side). */
  referencedEntity: string
  /** Logical name of the primary-key attribute on the referenced entity. */
  referencedAttribute: string
  /** Whether this relationship defines a parent–child hierarchy. */
  isHierarchical: boolean
}

/**
 * A many-to-many relationship row for display in {@link MetadataManyToManyTable}.
 */
export interface IManyToManyRow {
  /** OData schema name for the many-to-many relationship. */
  schemaName: string
  /** Logical name of the first entity in the relationship. */
  entity1LogicalName: string
  /** Logical name of the second entity in the relationship. */
  entity2LogicalName: string
  /** Logical name of the intersect (junction) table. */
  intersectEntityName: string
  /** Foreign-key attribute on the intersect table pointing to entity 1. */
  entity1IntersectAttribute: string
  /** Foreign-key attribute on the intersect table pointing to entity 2. */
  entity2IntersectAttribute: string
}

/**
 * A security privilege row for display in {@link MetadataPrivilegesTable}.
 */
export interface IPrivilegeRow {
  /** Internal privilege name, e.g. `"prvCreateAccount"`. */
  name: string
  /** Unique identifier of the privilege record. */
  privilegeId: string
  /** CRUD-style action this privilege controls, e.g. `"Create"`. */
  privilegeType: string
  /** Whether the privilege can be granted at Basic (user-owned) depth. */
  canBeBasic: boolean
  /** Whether the privilege can be granted at Deep (BU + children) depth. */
  canBeDeep: boolean
  /** Whether the privilege can be granted at Local (business unit) depth. */
  canBeLocal: boolean
  /** Whether the privilege can be granted at Global (organisation-wide) depth. */
  canBeGlobal: boolean
  /** Whether the privilege can be applied as an entity reference filter. */
  canBeEntityReference: boolean
  /** Whether the privilege can be applied as a parent entity reference filter. */
  canBeParentEntityReference: boolean
}

/**
 * A Dataverse solution row for display in {@link MetadataSolutionsTable}.
 */
export interface ISolutionRow {
  /** Display name shown in the maker portal. */
  friendlyName: string
  /** Unique programmatic name of the solution, e.g. `"Active"`. */
  uniqueName: string
  /** Solution version string, e.g. `"1.0.0.0"`. */
  version: string
  /** Whether the solution is managed (read-only) in this environment. */
  isManaged: boolean
  /** GUID of the solution record in Dataverse. */
  solutionId: string
}

// ---------------------------------------------------------------------------
// MetadataTableInfoTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataTableInfoTable}. */
export interface IMetadataTableInfoTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Flat key-value pairs derived from the entity definition endpoint. */
  tableInfo: IEntityTableInfo
}

/**
 * Sortable table of entity-level properties from the Dataverse EntityDefinitions endpoint.
 *
 * @remarks
 * Columns: Name (camelCase key → human label), Type (JavaScript `typeof`), Value (raw string).
 * All three columns are sortable. Sort state is local to this component.
 *
 * @example
 * ```tsx
 * <MetadataTableInfoTable loading={loading} tableInfo={tableInfo} />
 * ```
 */
export function MetadataTableInfoTable({ loading, tableInfo }: IMetadataTableInfoTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSortColumn] = useState<'name' | 'type' | 'value' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading table metadata…" />

  const handleSort = (col: 'name' | 'type' | 'value') => {
    if (sortColumn === col) setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortColumn(col); setSortDirection('ascending') }
  }

  // AI-CONTEXT: tableInfo values may be boolean, string, number, or null — all rendered as strings.
  const entries = Object.entries(tableInfo) as Array<[string, boolean | string | number | null]>
  const sorted = [...entries].sort(([ka, va], [kb, vb]) => {
    if (sortColumn === null) return 0
    let a = ''; let b = ''
    if (sortColumn === 'name') { a = toLabel(ka); b = toLabel(kb) }
    else if (sortColumn === 'type') { a = va === null ? '' : typeof va; b = vb === null ? '' : typeof vb }
    else { a = va === null ? '' : String(va); b = vb === null ? '' : String(vb) }
    return sortDirection === 'ascending' ? a.localeCompare(b) : b.localeCompare(a)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'name' ? sortDirection : undefined} onClick={() => handleSort('name')}>
            <Tooltip content="The camelCase property name from the entity metadata record" relationship="label" withArrow>
              <span>Name</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'type' ? sortDirection : undefined} onClick={() => handleSort('type')}>
            <Tooltip content="The JavaScript typeof the value — string, number, boolean, or null" relationship="label" withArrow>
              <span>Type</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'value' ? sortDirection : undefined} onClick={() => handleSort('value')}>
            <Tooltip content="The raw value returned by the EntityDefinitions metadata endpoint" relationship="label" withArrow>
              <span>Value</span>
            </Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(([key, val]) => (
          <TableRow key={key}>
            <TableCell><Link>{toLabel(key)}</Link></TableCell>
            <TableCell>{val === null ? '—' : typeof val}</TableCell>
            <TableCell>{val === null ? '—' : String(val)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataColumnsTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataColumnsTable}. */
export interface IMetadataColumnsTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Attribute rows to display. Structurally compatible with any `IXxxAttributeMetadata[]`. */
  attributes: IAttributeRow[]
}

/**
 * Sortable table of attribute (column) metadata for a Dataverse entity.
 *
 * @remarks
 * Columns: Logical Name, Display Name, Type, Required, Description.
 * Logical Name, Display Name, Type, and Description are sortable. Sort state is local.
 *
 * @example
 * ```tsx
 * <MetadataColumnsTable loading={loading} attributes={attributes} />
 * ```
 */
export function MetadataColumnsTable({ loading, attributes }: IMetadataColumnsTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSortColumn] = useState<'logicalName' | 'displayName' | 'attributeType' | 'required' | 'description' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading columns…" />

  const handleSort = (col: 'logicalName' | 'displayName' | 'attributeType' | 'required' | 'description') => {
    if (sortColumn === col) setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortColumn(col); setSortDirection('ascending') }
  }

  const sorted = [...attributes].sort((a, b) => {
    if (sortColumn === null) return 0
    let va = ''; let vb = ''
    if (sortColumn === 'logicalName') { va = a.logicalName; vb = b.logicalName }
    else if (sortColumn === 'displayName') { va = a.displayName; vb = b.displayName }
    else if (sortColumn === 'attributeType') { va = a.attributeType; vb = b.attributeType }
    else if (sortColumn === 'description') { va = a.description; vb = b.description }
    else { va = String(a.isRequiredForForm); vb = String(b.isRequiredForForm) }
    return sortDirection === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'logicalName' ? sortDirection : undefined} onClick={() => handleSort('logicalName')}>
            <Tooltip content={'Dataverse logical column name, e.g. "name" or "accountid"'} relationship="label" withArrow>
              <span>Logical Name</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'displayName' ? sortDirection : undefined} onClick={() => handleSort('displayName')}>
            <Tooltip content="User-localised label shown on forms" relationship="label" withArrow>
              <span>Display Name</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'attributeType' ? sortDirection : undefined} onClick={() => handleSort('attributeType')}>
            <Tooltip content="Dataverse attribute type, e.g. StringType, MoneyType" relationship="label" withArrow>
              <span>Type</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'required' ? sortDirection : undefined} onClick={() => handleSort('required')}>
            <Tooltip content="Whether the field is marked as required on Dataverse forms" relationship="label" withArrow>
              <span>Required</span>
            </Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'description' ? sortDirection : undefined} onClick={() => handleSort('description')}>
            <Tooltip content="User-localised description of the column purpose from Dataverse metadata" relationship="label" withArrow>
              <span>Description</span>
            </Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(col => (
          <TableRow key={col.logicalName}>
            <TableCell><Link>{col.logicalName}</Link></TableCell>
            <TableCell>{col.displayName || '—'}</TableCell>
            <TableCell>{col.attributeType || '—'}</TableCell>
            <TableCell>{col.isRequiredForForm ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <Tooltip content={col.description || '—'} relationship="description" withArrow>
                <span className={styles.truncatedCell}>{col.description || '—'}</span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataKeysTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataKeysTable}. */
export interface IMetadataKeysTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Logical name of the primary ID attribute, e.g. `"accountid"`. */
  primaryIdAttribute: string | null
  /** Logical name of the primary name attribute, e.g. `"name"`. */
  primaryNameAttribute: string | null
  /** All column logical names that form the primary key. */
  primaryKey: string[]
}

/**
 * Simple two-column property/value table for the entity key fields.
 *
 * @remarks
 * Displays `primaryIdAttribute`, `primaryNameAttribute`, and `primaryKey` as labelled rows.
 * This table is not sortable — the three rows are always in a fixed display order.
 *
 * @example
 * ```tsx
 * <MetadataKeysTable loading={loading} primaryIdAttribute="accountid" primaryNameAttribute="name" primaryKey={['accountid']} />
 * ```
 */
export function MetadataKeysTable({ loading, primaryIdAttribute, primaryNameAttribute, primaryKey }: IMetadataKeysTableProps) {
  const styles = useMetadataTableStyles()

  if (loading) return <Spinner size="small" label="Loading keys…" />

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Property name from the entity metadata" relationship="label" withArrow><span>Property</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Value returned by Dataverse" relationship="label" withArrow><span>Value</span></Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key="primaryIdAttribute">
          <TableCell><Link>Primary Id Attribute</Link></TableCell>
          <TableCell>{primaryIdAttribute ?? '—'}</TableCell>
        </TableRow>
        <TableRow key="primaryNameAttribute">
          <TableCell><Link>Primary Name Attribute</Link></TableCell>
          <TableCell>{primaryNameAttribute ?? '—'}</TableCell>
        </TableRow>
        <TableRow key="primaryKey">
          <TableCell><Link>Primary Key</Link></TableCell>
          <TableCell>{primaryKey.length > 0 ? primaryKey.join(', ') : '—'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataRelationshipTable (shared by OneToMany and ManyToOne tabs)
// ---------------------------------------------------------------------------

/** Props for {@link MetadataRelationshipTable}. */
export interface IMetadataRelationshipTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Relationship rows to display. */
  relationships: IRelationshipRow[]
  /**
   * Tooltip text for the Schema Name column header.
   *
   * @defaultValue `"OData schema name for the relationship"`
   */
  schemaNameTooltip?: string
}

/**
 * Sortable table of one-to-many or many-to-one relationships for a Dataverse entity.
 *
 * @remarks
 * Columns: Schema Name, Referencing Entity, Referencing Attribute, Referenced Entity,
 * Referenced Attribute, Hierarchical. Schema Name, Referencing Entity, and Referenced Entity
 * are sortable. Sort state is local to this component.
 *
 * Used by both the OneToManyRelationships and ManyToOneRelationships tabs — the only
 * difference is the `schemaNameTooltip` prop.
 *
 * @example
 * ```tsx
 * <MetadataRelationshipTable loading={loading} relationships={oneToManyRelationships} schemaNameTooltip="OData schema name for the relationship, e.g. account_contacts" />
 * <MetadataRelationshipTable loading={loading} relationships={manyToOneRelationships} />
 * ```
 */
export function MetadataRelationshipTable({ loading, relationships, schemaNameTooltip = 'OData schema name for the relationship' }: IMetadataRelationshipTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSortColumn] = useState<'schemaName' | 'referencingEntity' | 'referencedEntity' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading relationships…" />

  const handleSort = (col: 'schemaName' | 'referencingEntity' | 'referencedEntity') => {
    if (sortColumn === col) setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortColumn(col); setSortDirection('ascending') }
  }

  const sorted = [...relationships].sort((a, b) => {
    if (sortColumn === null) return 0
    const va = sortColumn === 'schemaName' ? a.schemaName : sortColumn === 'referencingEntity' ? a.referencingEntity : a.referencedEntity
    const vb = sortColumn === 'schemaName' ? b.schemaName : sortColumn === 'referencingEntity' ? b.referencingEntity : b.referencedEntity
    return sortDirection === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'schemaName' ? sortDirection : undefined} onClick={() => handleSort('schemaName')}>
            <Tooltip content={schemaNameTooltip} relationship="label" withArrow><span>Schema Name</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'referencingEntity' ? sortDirection : undefined} onClick={() => handleSort('referencingEntity')}>
            <Tooltip content="Logical name of the entity that holds the foreign key (the many side)" relationship="label" withArrow><span>Referencing Entity</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Logical name of the foreign-key attribute on the referencing entity" relationship="label" withArrow><span>Referencing Attribute</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'referencedEntity' ? sortDirection : undefined} onClick={() => handleSort('referencedEntity')}>
            <Tooltip content="Logical name of the referenced entity (the one side)" relationship="label" withArrow><span>Referenced Entity</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Logical name of the primary-key attribute on the referenced entity" relationship="label" withArrow><span>Referenced Attribute</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Whether this relationship defines a parent–child hierarchy" relationship="label" withArrow><span>Hierarchical</span></Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(r => (
          <TableRow key={r.schemaName}>
            <TableCell><Link>{r.schemaName || '—'}</Link></TableCell>
            <TableCell>{r.referencingEntity || '—'}</TableCell>
            <TableCell>{r.referencingAttribute || '—'}</TableCell>
            <TableCell>{r.referencedEntity || '—'}</TableCell>
            <TableCell>{r.referencedAttribute || '—'}</TableCell>
            <TableCell>{r.isHierarchical ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataManyToManyTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataManyToManyTable}. */
export interface IMetadataManyToManyTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Many-to-many relationship rows to display. */
  relationships: IManyToManyRow[]
}

/**
 * Sortable table of many-to-many relationships for a Dataverse entity.
 *
 * @remarks
 * Columns: Schema Name, Entity 1, Entity 2, Intersect Entity,
 * Entity 1 Intersect Attr, Entity 2 Intersect Attr.
 * Schema Name, Entity 1, and Entity 2 are sortable. Sort state is local.
 *
 * @example
 * ```tsx
 * <MetadataManyToManyTable loading={loading} relationships={manyToManyRelationships} />
 * ```
 */
export function MetadataManyToManyTable({ loading, relationships }: IMetadataManyToManyTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSortColumn] = useState<'schemaName' | 'entity1LogicalName' | 'entity2LogicalName' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading relationships…" />

  const handleSort = (col: 'schemaName' | 'entity1LogicalName' | 'entity2LogicalName') => {
    if (sortColumn === col) setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortColumn(col); setSortDirection('ascending') }
  }

  const sorted = [...relationships].sort((a, b) => {
    if (sortColumn === null) return 0
    const va = sortColumn === 'schemaName' ? a.schemaName : sortColumn === 'entity1LogicalName' ? a.entity1LogicalName : a.entity2LogicalName
    const vb = sortColumn === 'schemaName' ? b.schemaName : sortColumn === 'entity1LogicalName' ? b.entity1LogicalName : b.entity2LogicalName
    return sortDirection === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'schemaName' ? sortDirection : undefined} onClick={() => handleSort('schemaName')}>
            <Tooltip content="OData schema name for the many-to-many relationship" relationship="label" withArrow><span>Schema Name</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'entity1LogicalName' ? sortDirection : undefined} onClick={() => handleSort('entity1LogicalName')}>
            <Tooltip content="Logical name of the first entity in the relationship" relationship="label" withArrow><span>Entity 1</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'entity2LogicalName' ? sortDirection : undefined} onClick={() => handleSort('entity2LogicalName')}>
            <Tooltip content="Logical name of the second entity in the relationship" relationship="label" withArrow><span>Entity 2</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Logical name of the intersect (junction) table" relationship="label" withArrow><span>Intersect Entity</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Foreign-key attribute on the intersect table pointing to entity 1" relationship="label" withArrow><span>Entity 1 Intersect Attr</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Foreign-key attribute on the intersect table pointing to entity 2" relationship="label" withArrow><span>Entity 2 Intersect Attr</span></Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(r => (
          <TableRow key={r.schemaName}>
            <TableCell><Link>{r.schemaName || '—'}</Link></TableCell>
            <TableCell>{r.entity1LogicalName || '—'}</TableCell>
            <TableCell>{r.entity2LogicalName || '—'}</TableCell>
            <TableCell>{r.intersectEntityName || '—'}</TableCell>
            <TableCell>{r.entity1IntersectAttribute || '—'}</TableCell>
            <TableCell>{r.entity2IntersectAttribute || '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataPrivilegesTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataPrivilegesTable}. */
export interface IMetadataPrivilegesTableProps {
  /** Whether the metadata fetch is still in progress. */
  loading: boolean
  /** Privilege rows to display. */
  privileges: IPrivilegeRow[]
}

/**
 * Sortable table of security privileges for a Dataverse entity.
 *
 * @remarks
 * Columns: Name, Privilege Type, Privilege Id, Can Be Basic, Can Be Deep,
 * Can Be Local, Can Be Global, Can Be Entity Ref, Can Be Parent Entity Ref.
 * Name and Privilege Type are sortable. Sort state is local.
 *
 * @example
 * ```tsx
 * <MetadataPrivilegesTable loading={loading} privileges={privileges} />
 * ```
 */
export function MetadataPrivilegesTable({ loading, privileges }: IMetadataPrivilegesTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSortColumn] = useState<'name' | 'privilegeType' | null>(null)
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading privileges…" />

  const handleSort = (col: 'name' | 'privilegeType') => {
    if (sortColumn === col) setSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSortColumn(col); setSortDirection('ascending') }
  }

  const sorted = [...privileges].sort((a, b) => {
    if (sortColumn === null) return 0
    const va = sortColumn === 'name' ? a.name : a.privilegeType
    const vb = sortColumn === 'name' ? b.name : b.privilegeType
    return sortDirection === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'name' ? sortDirection : undefined} onClick={() => handleSort('name')}>
            <Tooltip content="Internal privilege name, e.g. prvCreateAccount" relationship="label" withArrow><span>Name</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'privilegeType' ? sortDirection : undefined} onClick={() => handleSort('privilegeType')}>
            <Tooltip content="CRUD action this privilege controls: Create, Read, Write, Delete, Assign, Share, Append, AppendTo" relationship="label" withArrow><span>Privilege Type</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Unique identifier of the privilege record" relationship="label" withArrow><span>Privilege Id</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be granted at Basic (user-owned) depth" relationship="label" withArrow><span>Can Be Basic</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be granted at Deep (BU + children) depth" relationship="label" withArrow><span>Can Be Deep</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be granted at Local (business unit) depth" relationship="label" withArrow><span>Can Be Local</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be granted at Global (organisation-wide) depth" relationship="label" withArrow><span>Can Be Global</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be applied as an entity reference filter" relationship="label" withArrow><span>Can Be Entity Ref</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Privilege can be applied as a parent entity reference filter" relationship="label" withArrow><span>Can Be Parent Entity Ref</span></Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(p => (
          <TableRow key={p.privilegeId}>
            <TableCell><Link>{p.name || '—'}</Link></TableCell>
            <TableCell>{p.privilegeType || '—'}</TableCell>
            <TableCell>{p.privilegeId || '—'}</TableCell>
            <TableCell>{p.canBeBasic ? 'Yes' : 'No'}</TableCell>
            <TableCell>{p.canBeDeep ? 'Yes' : 'No'}</TableCell>
            <TableCell>{p.canBeLocal ? 'Yes' : 'No'}</TableCell>
            <TableCell>{p.canBeGlobal ? 'Yes' : 'No'}</TableCell>
            <TableCell>{p.canBeEntityReference ? 'Yes' : 'No'}</TableCell>
            <TableCell>{p.canBeParentEntityReference ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---------------------------------------------------------------------------
// MetadataSolutionsTable
// ---------------------------------------------------------------------------

/** Props for {@link MetadataSolutionsTable}. */
export interface IMetadataSolutionsTableProps {
  /** Whether the solutions fetch is still in progress. */
  loading: boolean
  /** Error message from the solutions fetch, or `null` on success. */
  error: string | null
  /** Solution rows to display. */
  solutions: ISolutionRow[]
}

/**
 * Sortable table of Dataverse solutions that contain a given entity as a component.
 *
 * @remarks
 * Columns: Friendly Name, Unique Name, Version, Managed, Solution Id.
 * Friendly Name, Unique Name, and Version are sortable. Sort state is local.
 * Renders an error placeholder when `error` is non-null.
 *
 * @example
 * ```tsx
 * <MetadataSolutionsTable loading={loading} error={error} solutions={solutions} />
 * ```
 */
export function MetadataSolutionsTable({ loading, error, solutions }: IMetadataSolutionsTableProps) {
  const styles = useMetadataTableStyles()
  const [sortColumn, setSolSortColumn] = useState<'friendlyName' | 'uniqueName' | 'version' | null>(null)
  const [sortDirection, setSolSortDirection] = useState<'ascending' | 'descending'>('ascending')

  if (loading) return <Spinner size="small" label="Loading solutions…" />

  if (error) return <div className={styles.placeholder}><Text>{error}</Text></div>

  const handleSort = (col: 'friendlyName' | 'uniqueName' | 'version') => {
    if (sortColumn === col) setSolSortDirection(d => d === 'ascending' ? 'descending' : 'ascending')
    else { setSolSortColumn(col); setSolSortDirection('ascending') }
  }

  const sorted = [...solutions].sort((a, b) => {
    if (sortColumn === null) return 0
    const va = sortColumn === 'friendlyName' ? a.friendlyName : sortColumn === 'uniqueName' ? a.uniqueName : a.version
    const vb = sortColumn === 'friendlyName' ? b.friendlyName : sortColumn === 'uniqueName' ? b.uniqueName : b.version
    return sortDirection === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'friendlyName' ? sortDirection : undefined} onClick={() => handleSort('friendlyName')}>
            <Tooltip content="Display name of the solution shown in the maker portal" relationship="label" withArrow><span>Friendly Name</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'uniqueName' ? sortDirection : undefined} onClick={() => handleSort('uniqueName')}>
            <Tooltip content="Unique programmatic name of the solution, e.g. Active" relationship="label" withArrow><span>Unique Name</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell} sortDirection={sortColumn === 'version' ? sortDirection : undefined} onClick={() => handleSort('version')}>
            <Tooltip content="Solution version string, e.g. 1.0.0.0" relationship="label" withArrow><span>Version</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="Whether the solution is managed (read-only) in this environment" relationship="label" withArrow><span>Managed</span></Tooltip>
          </TableHeaderCell>
          <TableHeaderCell className={styles.headerCell}>
            <Tooltip content="GUID of the solution record in Dataverse" relationship="label" withArrow><span>Solution Id</span></Tooltip>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(s => (
          <TableRow key={s.solutionId}>
            <TableCell><Link>{s.friendlyName || '—'}</Link></TableCell>
            <TableCell>{s.uniqueName || '—'}</TableCell>
            <TableCell>{s.version || '—'}</TableCell>
            <TableCell>{s.isManaged ? 'Yes' : 'No'}</TableCell>
            <TableCell>{s.solutionId || '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
