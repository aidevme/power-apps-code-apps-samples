// AI-CONTEXT: Fetches and derives Webresource entity metadata from Dataverse — attributes, relationships, privileges, and solutions.
// AI-FILE-RELATIONS:
//   - service:  src/generated/services/WebresourcesetService.ts  (PAC-generated SDK client — do not edit)
//   - types:    src/hooks/metadata-hooks/entityMetadata.types.ts  (IEntityTableInfo, ALL_ENTITY_METADATA_FIELDS, deriveTableInfo)
//   - consumer: src/components/apps/EntityDetailsApp.tsx           (primary caller)
// AI-CONSTRAINT: Never call WebresourcesetService or fetch directly from components — all data flows through this hook.
// AI-PATTERN: Two-effect pattern: effect 1 fetches entity metadata on mount/retry; effect 2 fetches solution components once MetadataId resolves.

import { useState, useEffect } from 'react'
import type { EntityMetadata } from '@microsoft/power-apps/data/metadata/dataverse'
import { getPrivilegeTypeName } from '@microsoft/power-apps/data/metadata/dataverse'
import { WebresourcesetService } from '../../generated/services/WebresourcesetService'
import { type IEntityTableInfo, ALL_ENTITY_METADATA_FIELDS, deriveTableInfo } from './entityMetadata.types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Describes a single attribute on the Webresource table as returned by Dataverse metadata. */
export interface IWebresourceAttributeMetadata {
  /** Logical column name, e.g. `"name"` or `"webresourceid"`. */
  logicalName: string
  /** OData schema name, e.g. `"Name"` or `"WebResourceId"`. */
  schemaName: string
  /** User-localised display label for the column. */
  displayName: string
  /**
   * Dataverse attribute type name, e.g. `"StringType"`, `"MemoType"`.
   * Derived from `AttributeTypeName.Value`.
   */
  attributeType: string
  /**
   * Logical name of the parent attribute this attribute belongs to.
   * Empty string when the attribute is not a sub-attribute.
   */
  attributeOf: string
  /** User-localised description of the column purpose. Empty string when not set. */
  description: string
  /** Logical name of the entity that owns this attribute, e.g. `"webresource"`. */
  entityLogicalName: string
  /** 1-based column sequence number assigned by Dataverse. */
  columnNumber: number | null
  /** Version string when this attribute was deprecated; empty string when not deprecated. */
  deprecatedVersion: string
  /** Whether a field-level security profile can restrict create access to this column. */
  canBeSecuredForCreate: boolean
  /** Whether a field-level security profile can restrict read access to this column. */
  canBeSecuredForRead: boolean
  /** Whether a field-level security profile can restrict update access to this column. */
  canBeSecuredForUpdate: boolean
  /** Whether additional settings (e.g. auditing) can be changed on this column. */
  canModifyAdditionalSettings: boolean
  /** Whether the column is marked as required on forms (`IsRequiredForForm`). */
  isRequiredForForm: boolean
  /**
   * Required level: `"None"`, `"SystemRequired"`, `"ApplicationRequired"`, or `"Recommended"`.
   * Derived from `RequiredLevel.Value`.
   */
  requiredLevel: string
  /** Whether this column was added by a customisation (not part of the base solution). */
  isCustomAttribute: boolean
  /** Whether this column is part of a managed solution. */
  isManaged: boolean
  /** Whether this is the primary ID attribute (GUID key). */
  isPrimaryId: boolean
  /** Whether this is the primary name attribute used in lookups. */
  isPrimaryName: boolean
  /** Whether the column can be set on record create. */
  isValidForCreate: boolean
  /** Whether the column is included on default entity forms. */
  isValidForForm: boolean
  /** Whether the column can be displayed in grids and views. */
  isValidForGrid: boolean
  /** Whether the column is returned in read operations. */
  isValidForRead: boolean
  /** Whether the column can be set on record update. */
  isValidForUpdate: boolean
  /** Whether the column is exposed as a valid OData attribute in the Web API. */
  isValidODataAttribute: boolean
  /**
   * Whether the column can be used as a filter in Advanced Find (`IsValidForAdvancedFind.Value`).
   * This is a `BooleanManagedProperty` — `.Value` is the effective setting.
   */
  isValidForAdvancedFind: boolean
  /**
   * Logical name of the attribute this attribute is linked to.
   * Empty string when not linked.
   */
  linkedAttributeId: string
  /** Whether the column is searchable in Quick Find views. */
  isSearchable: boolean
  /** Whether the column can be used as a filter in Advanced Find. */
  isFilterable: boolean
  /** Whether this attribute metadata record has unsaved changes (SDK internal flag). */
  hasChanged: boolean
  /**
   * Logical name of the attribute this one inherits from.
   * Empty string when not inherited.
   */
  inheritsFrom: string
  /** Version string when this attribute was introduced, e.g. `"9.1.0.0"`. */
  introducedVersion: string
  /** Whether auditing is enabled on this column (`IsAuditEnabled.Value`). */
  isAuditEnabled: boolean
  /** Whether field-level security is currently enabled on this column. */
  isSecured: boolean
  /** Unique identifier of the attribute metadata record. */
  metadataId: string
  /**
   * Source type of the attribute.
   * `0` = Simple, `1` = Virtual, `2` = Derived.
   */
  sourceType: number
}

/**
 * Primary key metadata for the Webresource table.
 *
 * @remarks
 * The SDK does not expose alternate key metadata — only the primary key fields
 * (`PrimaryIdAttribute`, `PrimaryNameAttribute`, `PrimaryKey`) are available via
 * `EntityMetadataSelects`.
 */
export interface IWebresourceKeyMetadata {
  /** Logical name of the primary ID attribute, e.g. `"webresourceid"`. */
  primaryIdAttribute: string | null
  /** Logical name of the primary name attribute. */
  primaryNameAttribute: string | null
  /** All column logical names that form the primary key. */
  primaryKey: string[]
}

/** A one-to-many (or many-to-one) relationship involving the Webresource table. */
export interface IWebresourceOneToManyRelationship {
  /** OData schema name for the relationship. */
  schemaName: string
  /** Logical name of the entity that holds the foreign key (the "many" side). */
  referencingEntity: string
  /** Logical name of the foreign-key attribute on the referencing entity. */
  referencingAttribute: string
  /** Logical name of the referenced entity (the "one" side). */
  referencedEntity: string
  /** Logical name of the primary-key attribute on the referenced entity. */
  referencedAttribute: string
  /** Whether this relationship defines a parent–child hierarchy. */
  isHierarchical: boolean
}

/**
 * Privilege type for a Webresource table security privilege.
 *
 * @remarks
 * Maps to the Dataverse `PrivilegeType` enum.
 * `'None'` is included for completeness but is not normally returned.
 */
export type WebresourcePrivilegeType = 'None' | 'Create' | 'Read' | 'Write' | 'Delete' | 'Assign' | 'Share' | 'Append' | 'AppendTo'

/** A security privilege associated with the Webresource table. */
export interface IWebresourcePrivilege {
  /** Internal name of the privilege, e.g. `"prvCreateWebResource"`. */
  name: string
  /** Unique identifier of the privilege record. */
  privilegeId: string
  /** The CRUD-style action this privilege controls. */
  privilegeType: WebresourcePrivilegeType
  /** Whether the privilege can be granted at the Basic (user-owned) depth. */
  canBeBasic: boolean
  /** Whether the privilege can be granted at the Deep (business unit + children) depth. */
  canBeDeep: boolean
  /** Whether the privilege can be granted at the Local (business unit) depth. */
  canBeLocal: boolean
  /** Whether the privilege can be granted at the Global (organisation-wide) depth. */
  canBeGlobal: boolean
  /** Whether the privilege can be applied as an entity reference filter. */
  canBeEntityReference: boolean
  /** Whether the privilege can be applied as a parent entity reference filter. */
  canBeParentEntityReference: boolean
}

/** A many-to-many relationship involving the Webresource table. */
export interface IWebresourceManyToManyRelationship {
  /** OData schema name for the relationship. */
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
 * A Dataverse solution that contains the Webresource table as a component.
 *
 * @remarks
 * Fetched from `solutioncomponents?$filter=componenttype eq 1 and objectid eq {MetadataId}`
 * with `$expand=solutionid`. Component type 1 represents an Entity.
 */
export interface IWebresourceSolution {
  /** Unique programmatic name of the solution, e.g. `"Active"`. */
  uniqueName: string
  /** Display name shown in the maker portal, e.g. `"Common Data Services Default Solution"`. */
  friendlyName: string
  /** Solution version string, e.g. `"1.0.0.0"`. */
  version: string
  /** Whether the solution is managed (read-only in the target environment). */
  isManaged: boolean
  /** GUID of the solution record in Dataverse. */
  solutionId: string
}

/** Return value of the {@link useWebresourceMetadata} hook. */
export interface IUseWebresourceMetadataResult {
  /** The raw entity metadata returned by Dataverse, or `null` while loading or on error. */
  metadata: Partial<EntityMetadata> | null
  /** Whether the metadata fetch is in progress. */
  loading: boolean
  /** Error message if the fetch failed, or `null` on success. */
  error: string | null
  /**
   * Map of column logical name → user-localised display label derived from `metadata.Attributes`.
   * Empty object while loading or on error.
   *
   * @example `{ "name": "Name", "webresourceid": "Web Resource" }`
   */
  columnDisplayNames: Record<string, string>
  /**
   * Metadata for every attribute on the Webresource table, derived from `metadata.Attributes`.
   * Empty array while loading or on error.
   */
  attributes: IWebresourceAttributeMetadata[]
  /**
   * Attributes that are marked as required on forms (`IsRequiredForForm === true`).
   * Useful for driving client-side validation without hard-coding field names.
   */
  requiredAttributes: IWebresourceAttributeMetadata[]
  /**
   * Dataverse table type, e.g. `"Standard"`, `"Elastic"`, `"Virtual"`, or `"Activity"`.
   * `null` while loading or on error.
   */
  tableType: string | null
  /**
   * Whether the Webresource table is an activity table.
   * `null` while loading or on error.
   */
  isActivity: boolean | null
  /**
   * Comprehensive table-level properties derived from the raw entity metadata.
   * All properties are `null` while loading or on error.
   * See {@link IEntityTableInfo} for the full list of available fields.
   */
  tableInfo: IEntityTableInfo
  /**
   * Primary key metadata derived from `metadata.PrimaryIdAttribute`,
   * `metadata.PrimaryNameAttribute`, and `metadata.PrimaryKey`.
   * All fields are `null` / empty while loading or on error.
   */
  keyMetadata: IWebresourceKeyMetadata
  /**
   * All one-to-many relationships where Webresource is the referenced ("one") side.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.OneToManyRelationships`.
   */
  oneToManyRelationships: IWebresourceOneToManyRelationship[]
  /**
   * All many-to-one relationships where Webresource is the referencing ("many") side.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.ManyToOneRelationships`.
   */
  manyToOneRelationships: IWebresourceOneToManyRelationship[]
  /**
   * All many-to-many relationships involving Webresource.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.ManyToManyRelationships`.
   */
  manyToManyRelationships: IWebresourceManyToManyRelationship[]
  /**
   * Security privileges defined for the Webresource table.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.Privileges`.
   */
  privileges: IWebresourcePrivilege[]
  /**
   * Solutions that contain the Webresource table as a component.
   * Empty array while loading or on error.
   *
   * @remarks
   * Fetched via a secondary request to `solutioncomponents` once `metadata.MetadataId` is available.
   * Triggers independently of the main `loading` flag — check `solutionsLoading` for status.
   */
  solutions: IWebresourceSolution[]
  /** Whether the solution components fetch is in progress. */
  solutionsLoading: boolean
  /** Error message if the solution components fetch failed, or `null` on success. */
  solutionsError: string | null
  /** Re-triggers the metadata fetch. Useful for retry-on-error UI patterns. */
  retry: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetches entity and column metadata for the Dataverse `webresource` table
 * via {@link WebresourcesetService.getMetadata}.
 *
 * @remarks
 * **Two-effect pattern:**
 *
 * 1. **Primary fetch** — triggered on mount and whenever `retry()` is called. Requests
 *    all fields listed in `ALL_ENTITY_METADATA_FIELDS` with schema options
 *    `{ columns: 'all', oneToMany: true, manyToOne: true, manyToMany: true }` so that
 *    attribute, relationship, and privilege metadata are all returned in a single call.
 *
 * 2. **Solutions fetch** — triggered automatically once `metadata.MetadataId` is available.
 *    Uses a raw `fetch` to `solutioncomponents` filtered by `componenttype eq 1` (Entity)
 *    and `objectid eq {MetadataId}` with `$expand=solutionid` to resolve solution details.
 *    Requires Solution Manager or System Administrator role; a 403 surfaces as `solutionsError`.
 *
 * @returns {@link IUseWebresourceMetadataResult} containing metadata state,
 * per-tab derived collections, loading/error flags for both fetch effects, and a `retry` callback.
 *
 * @throws Never — errors are caught internally and surfaced via `error` or `solutionsError`.
 *
 * @example
 * ```tsx
 * const { attributes, columnDisplayNames, loading, error, retry } = useWebresourceMetadata()
 * if (loading) return <Spinner />
 * if (error) return <button onClick={retry}>Retry</button>
 * console.log(columnDisplayNames['name']) // "Name"
 * console.log(attributes.find(a => a.isPrimaryId)?.logicalName) // "webresourceid"
 * ```
 */
export function useWebresourceMetadata(): IUseWebresourceMetadataResult {
  const [metadata, setMetadata] = useState<Partial<EntityMetadata> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [solutions, setSolutions] = useState<IWebresourceSolution[]>([])
  const [solutionsLoading, setSolutionsLoading] = useState(false)
  const [solutionsError, setSolutionsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await WebresourcesetService.getMetadata({ metadata: ALL_ENTITY_METADATA_FIELDS, schema: { columns: 'all', oneToMany: true, manyToOne: true, manyToMany: true } })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getMetadata returned a failure result'
          console.error('useWebresourceMetadata:', message, result.error)
          setError(message)
          return
        }
        setMetadata(result.data)
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useWebresourceMetadata: failed to load metadata', message)
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    doFetch()
    return () => { cancelled = true }
  }, [attempt])

  // AI-CONTEXT: Secondary fetch — triggered once MetadataId is known. Uses raw fetch because
  // there is no PAC-generated service for solutioncomponents.
  // AI-CONSTRAINT: Do not add Authorization headers; pac connector injects them automatically.
  useEffect(() => {
    const metadataId = metadata?.MetadataId
    if (!metadataId) return
    let cancelled = false
    const fetchSolutions = async () => {
      try {
        setSolutionsLoading(true)
        setSolutionsError(null)
        // AI-CONTEXT: componenttype eq 1 = Entity in the Dataverse SolutionComponent type enum.
        const url =
          `/api/data/v9.2/solutioncomponents` +
          `?$filter=componenttype eq 1 and objectid eq ${metadataId}` +
          `&$expand=solutionid($select=uniquename,friendlyname,version,ismanaged,solutionid)`
        const response = await fetch(url, {
          headers: { Accept: 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' },
        })
        // AI-CONTEXT: 403 is expected for non-admin users — solutioncomponents requires Solution Manager or System Administrator role.
        if (response.status === 403) throw new Error('Insufficient privileges to read solution components (Solution Manager or System Administrator role required)')
        if (!response.ok) throw new Error(`Dataverse solutioncomponents error: ${response.status}`)
        const data = await response.json()
        if (cancelled) return
        // AI-CONTEXT: `value` is the OData collection wrapper — always an array.
        type SolutionComponentRecord = { solutionid: { uniquename: string; friendlyname: string; version: string; ismanaged: boolean; solutionid: string } }
        const components: SolutionComponentRecord[] = data.value ?? []
        setSolutions(components.map(c => ({
          uniqueName: c.solutionid?.uniquename ?? '',
          friendlyName: c.solutionid?.friendlyname ?? '',
          version: c.solutionid?.version ?? '',
          isManaged: c.solutionid?.ismanaged ?? false,
          solutionId: c.solutionid?.solutionid ?? '',
        })))
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useWebresourceMetadata: failed to load solution components', message)
          setSolutionsError(message)
        }
      } finally {
        if (!cancelled) setSolutionsLoading(false)
      }
    }
    fetchSolutions()
    return () => { cancelled = true }
  }, [metadata?.MetadataId])

  const REQUIRED_LEVEL_NAMES: Record<number, string> = { 0: 'None', 1: 'SystemRequired', 2: 'ApplicationRequired', 3: 'Recommended' }

  const attributes: IWebresourceAttributeMetadata[] = metadata?.Attributes
    ? metadata.Attributes.map(attr => ({
        logicalName: attr.LogicalName ?? '',
        schemaName: attr.SchemaName ?? '',
        displayName: attr.DisplayName?.UserLocalizedLabel?.Label ?? attr.LogicalName ?? '',
        attributeType: attr.AttributeTypeName?.Value ?? '',
        attributeOf: attr.AttributeOf ?? '',
        description: attr.Description?.UserLocalizedLabel?.Label ?? '',
        entityLogicalName: attr.EntityLogicalName ?? '',
        columnNumber: attr.ColumnNumber ?? null,
        deprecatedVersion: attr.DeprecatedVersion ?? '',
        canBeSecuredForCreate: attr.CanBeSecuredForCreate ?? false,
        canBeSecuredForRead: attr.CanBeSecuredForRead ?? false,
        canBeSecuredForUpdate: attr.CanBeSecuredForUpdate ?? false,
        canModifyAdditionalSettings: attr.CanModifyAdditionalSettings?.Value ?? false,
        isRequiredForForm: attr.IsRequiredForForm ?? false,
        requiredLevel: attr.RequiredLevel?.Value != null ? (REQUIRED_LEVEL_NAMES[attr.RequiredLevel.Value] ?? String(attr.RequiredLevel.Value)) : 'None',
        isCustomAttribute: attr.IsCustomAttribute ?? false,
        isManaged: attr.IsManaged ?? false,
        isPrimaryId: attr.IsPrimaryId ?? false,
        isPrimaryName: attr.IsPrimaryName ?? false,
        isValidForCreate: attr.IsValidForCreate ?? false,
        isValidForForm: attr.IsValidForForm ?? false,
        isValidForGrid: attr.IsValidForGrid ?? false,
        isValidForRead: attr.IsValidForRead ?? false,
        isValidForUpdate: attr.IsValidForUpdate ?? false,
        isValidODataAttribute: attr.IsValidODataAttribute ?? false,
        isValidForAdvancedFind: attr.IsValidForAdvancedFind?.Value ?? false,
        linkedAttributeId: attr.LinkedAttributeId ?? '',
        isSearchable: attr.IsSearchable ?? false,
        isFilterable: attr.IsFilterable ?? false,
        isSecured: attr.IsSecured ?? false,
        hasChanged: attr.HasChanged ?? false,
        inheritsFrom: attr.InheritsFrom ?? '',
        introducedVersion: attr.IntroducedVersion ?? '',
        isAuditEnabled: attr.IsAuditEnabled?.Value ?? false,
        metadataId: attr.MetadataId ?? '',
        sourceType: attr.SourceType ?? 0,
      }))
    : []

  const columnDisplayNames: Record<string, string> = {}
  for (const attr of attributes) {
    if (attr.logicalName) columnDisplayNames[attr.logicalName] = attr.displayName
  }

  const requiredAttributes = attributes.filter(a => a.isRequiredForForm)
  const tableType = metadata?.TableType ?? null
  const isActivity = metadata?.IsActivity ?? null
  const tableInfo = deriveTableInfo(metadata)
  const keyMetadata: IWebresourceKeyMetadata = {
    primaryIdAttribute: metadata?.PrimaryIdAttribute ?? null,
    primaryNameAttribute: metadata?.PrimaryNameAttribute ?? null,
    primaryKey: metadata?.PrimaryKey ?? [],
  }

  const oneToManyRelationships: IWebresourceOneToManyRelationship[] = metadata?.OneToManyRelationships
    ? metadata.OneToManyRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        referencingEntity: r.ReferencingEntity ?? '',
        referencingAttribute: r.ReferencingAttribute ?? '',
        referencedEntity: r.ReferencedEntity ?? '',
        referencedAttribute: r.ReferencedAttribute ?? '',
        isHierarchical: r.IsHierarchical ?? false,
      }))
    : []

  const manyToOneRelationships: IWebresourceOneToManyRelationship[] = metadata?.ManyToOneRelationships
    ? metadata.ManyToOneRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        referencingEntity: r.ReferencingEntity ?? '',
        referencingAttribute: r.ReferencingAttribute ?? '',
        referencedEntity: r.ReferencedEntity ?? '',
        referencedAttribute: r.ReferencedAttribute ?? '',
        isHierarchical: r.IsHierarchical ?? false,
      }))
    : []

  const manyToManyRelationships: IWebresourceManyToManyRelationship[] = metadata?.ManyToManyRelationships
    ? metadata.ManyToManyRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        entity1LogicalName: r.Entity1LogicalName ?? '',
        entity2LogicalName: r.Entity2LogicalName ?? '',
        intersectEntityName: r.IntersectEntityName ?? '',
        entity1IntersectAttribute: r.Entity1IntersectAttribute ?? '',
        entity2IntersectAttribute: r.Entity2IntersectAttribute ?? '',
      }))
    : []

  const privileges: IWebresourcePrivilege[] = metadata?.Privileges
    ? metadata.Privileges.map(p => ({
        name: p.Name ?? '',
        privilegeId: p.PrivilegeId ?? '',
        // AI-INTENT: Dataverse may return PrivilegeType as a numeric enum or as the resolved string name.
        // getPrivilegeTypeName handles numeric values; the String() fallback handles pre-resolved strings.
        privilegeType: (p.PrivilegeType != null ? (getPrivilegeTypeName(p.PrivilegeType) ?? String(p.PrivilegeType)) : 'None') as WebresourcePrivilegeType,
        canBeBasic: p.CanBeBasic ?? false,
        canBeDeep: p.CanBeDeep ?? false,
        canBeLocal: p.CanBeLocal ?? false,
        canBeGlobal: p.CanBeGlobal ?? false,
        canBeEntityReference: p.CanBeEntityReference ?? false,
        canBeParentEntityReference: p.CanBeParentEntityReference ?? false,
      }))
    : []

  return { metadata, loading, error, columnDisplayNames, attributes, requiredAttributes, tableType, isActivity, tableInfo, keyMetadata, oneToManyRelationships, manyToOneRelationships, manyToManyRelationships, privileges, solutions, solutionsLoading, solutionsError, retry: () => setAttempt(n => n + 1) }
}
