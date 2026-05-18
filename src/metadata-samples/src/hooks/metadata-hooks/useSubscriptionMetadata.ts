// AI-CONTEXT: Fetches and derives Subscription entity metadata from Dataverse — attributes, relationships, privileges, and solutions.
// AI-FILE-RELATIONS:
//   - service:  src/generated/services/SubscriptionsService.ts        (PAC-generated SDK client — do not edit)
//   - types:    src/hooks/metadata-hooks/entityMetadata.types.ts      (IEntityTableInfo, ALL_ENTITY_METADATA_FIELDS, deriveTableInfo)
//   - consumer: src/hooks/component-hooks/useMetadataCache.ts         (aggregation hook)
// AI-CONSTRAINT: Never call SubscriptionsService or fetch directly from components — all data flows through this hook.
// AI-PATTERN: Single-effect hook body: effect 1 fetches entity metadata on mount/retry; useSolutionComponentsByType handles solution components and skips automatically while MetadataId is unresolved.

import { useState, useEffect } from 'react'
import type { EntityMetadata } from '@microsoft/power-apps/data/metadata/dataverse'
import { getPrivilegeTypeName } from '@microsoft/power-apps/data/metadata/dataverse'
import { SubscriptionsService } from '../../generated/services/SubscriptionsService'
import { type IEntityTableInfo, ALL_ENTITY_METADATA_FIELDS, deriveTableInfo } from './entityMetadata.types'
import { useSolutionComponentsByType } from '../dataverse-hooks/useSolutionComponents'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Describes a single attribute on the Subscription table as returned by Dataverse metadata. */
export interface ISubscriptionAttributeMetadata {
  /** Logical column name, e.g. `"subscriptionid"` or `"systemuserid"`. */
  logicalName: string
  /** OData schema name, e.g. `"SubscriptionId"` or `"SystemUserId"`. */
  schemaName: string
  /** User-localised display label for the column. */
  displayName: string
  /**
   * Dataverse attribute type name, e.g. `"UniqueidentifierType"`, `"StringType"`, `"BooleanType"`.
   * Derived from `AttributeTypeName.Value`.
   */
  attributeType: string
  /**
   * Logical name of the parent attribute this attribute belongs to, e.g. for virtual attributes.
   * Empty string when the attribute is not a sub-attribute.
   */
  attributeOf: string
  /** User-localised description of the column purpose. Empty string when not set. */
  description: string
  /** Logical name of the entity that owns this attribute, e.g. `"subscription"`. */
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
   * Used by virtual attributes that mirror a physical column. Empty string when not linked.
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
  /** Version string when this attribute was introduced, e.g. `"5.0.0.0"`. */
  introducedVersion: string
  /** Whether auditing is enabled on this column (`IsAuditEnabled.Value`). */
  isAuditEnabled: boolean
  /** Whether field-level security is currently enabled on this column. */
  isSecured: boolean
  /** Whether this column can be customised (`IsCustomizable.Value`). */
  isCustomizable: boolean
  /** Whether this column is a data source secret. */
  isDataSourceSecret: boolean
  /** Whether this column is enabled as a global filter (`IsGlobalFilterEnabled.Value`). */
  isGlobalFilterEnabled: boolean
  /** Whether this is a logical attribute (not physically stored). */
  isLogical: boolean
  /** Whether this column can be renamed (`IsRenameable.Value`). */
  isRenameable: boolean
  /** Whether this column is retrievable via the Web API. */
  isRetrievable: boolean
  /** Whether sorting is enabled for this column (`IsSortableEnabled.Value`). */
  isSortableEnabled: boolean
  /** Unique identifier of the attribute metadata record. */
  metadataId: string
  /**
   * Source type of the attribute.
   * `0` = Simple, `1` = Virtual, `2` = Derived.
   */
  sourceType: number
}

/**
 * Primary key metadata for the Subscription table, derived from the entity metadata selects.
 *
 * @remarks
 * The SDK does not expose alternate key metadata — only the primary key fields
 * (`PrimaryIdAttribute`, `PrimaryNameAttribute`, `PrimaryKey`) are available via
 * `EntityMetadataSelects`.
 */
export interface ISubscriptionKeyMetadata {
  /** Logical name of the primary ID attribute, e.g. `"subscriptionid"`. */
  primaryIdAttribute: string | null
  /** Logical name of the primary name attribute. */
  primaryNameAttribute: string | null
  /** All column logical names that form the primary key. */
  primaryKey: string[]
}

/** A one-to-many (or many-to-one) relationship involving the Subscription table. */
export interface ISubscriptionOneToManyRelationship {
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
 * Privilege type for a Subscription table security privilege.
 *
 * @remarks
 * Maps to the Dataverse `PrivilegeType` enum.
 * `'None'` is included for completeness but is not normally returned.
 */
export type SubscriptionPrivilegeType = 'None' | 'Create' | 'Read' | 'Write' | 'Delete' | 'Assign' | 'Share' | 'Append' | 'AppendTo'

/** A security privilege associated with the Subscription table. */
export interface ISubscriptionPrivilege {
  /** Internal name of the privilege, e.g. `"prvCreateSubscription"`. */
  name: string
  /** Unique identifier of the privilege record. */
  privilegeId: string
  /** The CRUD-style action this privilege controls. */
  privilegeType: SubscriptionPrivilegeType
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

/** A many-to-many relationship involving the Subscription table. */
export interface ISubscriptionManyToManyRelationship {
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
 * A Dataverse solution that contains the Subscription table as a component.
 *
 * @remarks
 * Fetched from `solutioncomponents?$filter=componenttype eq 1 and objectid eq {MetadataId}`
 * with `$expand=solutionid`. Component type 1 represents an Entity.
 */
export interface ISubscriptionSolution {
  /** Unique programmatic name of the solution, e.g. `"Active"`. */
  uniqueName: string
  /** Display name shown in the maker portal. */
  friendlyName: string
  /** Solution version string, e.g. `"1.0.0.0"`. */
  version: string
  /** Whether the solution is managed (read-only in the target environment). */
  isManaged: boolean
  /** GUID of the solution record in Dataverse. */
  solutionId: string
}

/** Return value of the {@link useSubscriptionMetadata} hook. */
export interface IUseSubscriptionMetadataResult {
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
   * @example `{ "subscriptionid": "Subscription", "systemuserid": "User" }`
   */
  columnDisplayNames: Record<string, string>
  /**
   * Metadata for every attribute on the Subscription table, derived from `metadata.Attributes`.
   * Empty array while loading or on error.
   */
  attributes: ISubscriptionAttributeMetadata[]
  /**
   * Attributes that are marked as required on forms (`IsRequiredForForm === true`).
   * Useful for driving client-side validation without hard-coding field names.
   */
  requiredAttributes: ISubscriptionAttributeMetadata[]
  /**
   * Dataverse table type for the Subscription table, e.g. `"Standard"`, `"Elastic"`, or `"Virtual"`.
   * `null` while loading or on error.
   */
  tableType: string | null
  /**
   * Whether the Subscription table is an activity table.
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
   * Primary key metadata for the Subscription table, derived from `metadata.PrimaryIdAttribute`,
   * `metadata.PrimaryNameAttribute`, and `metadata.PrimaryKey`.
   * All fields are `null` / empty while loading or on error.
   */
  keyMetadata: ISubscriptionKeyMetadata
  /**
   * All one-to-many relationships where Subscription is the referenced ("one") side.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.OneToManyRelationships`.
   */
  oneToManyRelationships: ISubscriptionOneToManyRelationship[]
  /**
   * All many-to-one relationships where Subscription is the referencing ("many") side.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.ManyToOneRelationships`.
   */
  manyToOneRelationships: ISubscriptionOneToManyRelationship[]
  /**
   * All many-to-many relationships involving Subscription.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.ManyToManyRelationships`.
   */
  manyToManyRelationships: ISubscriptionManyToManyRelationship[]
  /**
   * Security privileges defined for the Subscription table.
   * Empty array while loading or on error.
   *
   * @remarks Derived from `metadata.Privileges`.
   */
  privileges: ISubscriptionPrivilege[]
  /**
   * Solutions that contain the Subscription table as a component.
   * Empty array while loading or on error.
   *
   * @remarks
   * Fetched via a secondary request to `solutioncomponents` once `metadata.MetadataId` is available.
   * Triggers independently of the main `loading` flag — check `solutionsLoading` for status.
   */
  solutions: ISubscriptionSolution[]
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
 * Fetches entity and column metadata for the Dataverse `subscription` table via {@link SubscriptionsService.getMetadata}.
 *
 * @remarks
 * **Two-effect pattern:**
 *
 * 1. **Primary fetch** — triggered on mount and whenever `retry()` is called. Requests
 *    all fields listed in `ALL_ENTITY_METADATA_FIELDS` with schema options
 *    `{ columns: 'all', oneToMany: true, manyToOne: true, manyToMany: true }` so that
 *    attribute, relationship, and privilege metadata are all returned in a single call.
 *    Populates: `metadata`, `attributes`, `columnDisplayNames`, `requiredAttributes`,
 *    `tableType`, `isActivity`, `tableInfo`, `keyMetadata`, `oneToManyRelationships`,
 *    `manyToOneRelationships`, `manyToManyRelationships`, and `privileges`.
 *
 * 2. **Solutions fetch** — delegated to {@link useSolutionComponentsByType} with `componenttype 1`
 *    and `metadata.MetadataId`. The hook skips automatically while `MetadataId` is unresolved.
 *    Tracked via separate `solutionsLoading` and `solutionsError` flags.
 *
 * All derived collections (`attributes`, `privileges`, relationship arrays, `solutions`)
 * return empty arrays while loading or on error. Results are not cached beyond the component
 * tree lifetime — remounting the consumer triggers a fresh fetch.
 *
 * @returns {@link IUseSubscriptionMetadataResult} containing metadata state, per-tab derived collections,
 * loading/error flags for both fetch effects, and a `retry` callback for error recovery.
 *
 * @throws Never — errors are caught internally and surfaced via `error` or `solutionsError`.
 *
 * @example
 * ```tsx
 * const { attributes, columnDisplayNames, loading, error, retry } = useSubscriptionMetadata()
 * if (loading) return <Spinner />
 * if (error) return <button onClick={retry}>Retry</button>
 * console.log(columnDisplayNames['subscriptionid']) // "Subscription"
 * console.log(attributes.find(a => a.isPrimaryId)?.logicalName) // "subscriptionid"
 * ```
 */
export function useSubscriptionMetadata(): IUseSubscriptionMetadataResult {
  const [metadata, setMetadata] = useState<Partial<EntityMetadata> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  // AI-CONTEXT: useSolutionComponentsByType skips fetching when metadataId is empty string — safe to call unconditionally while MetadataId resolves from the primary effect.
  const { solutions: rawSolutions, loading: solutionsLoading, error: solutionsErrorObj } = useSolutionComponentsByType(1, metadata?.MetadataId ?? '')
  const solutions: ISubscriptionSolution[] = rawSolutions as ISubscriptionSolution[]
  const solutionsError = solutionsErrorObj?.message ?? null

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await SubscriptionsService.getMetadata({ metadata: ALL_ENTITY_METADATA_FIELDS, schema: { columns: 'all', oneToMany: true, manyToOne: true, manyToMany: true } })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getMetadata returned a failure result'
          console.error('useSubscriptionMetadata:', message, result.error)
          setError(message)
          return
        }
        setMetadata(result.data)
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useSubscriptionMetadata: failed to load metadata', message)
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    doFetch()
    return () => { cancelled = true }
  }, [attempt])

  const REQUIRED_LEVEL_NAMES: Record<number, string> = { 0: 'None', 1: 'SystemRequired', 2: 'ApplicationRequired', 3: 'Recommended' }

  const attributes: ISubscriptionAttributeMetadata[] = metadata?.Attributes
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
        isCustomizable: attr.IsCustomizable?.Value ?? false,
        isDataSourceSecret: attr.IsDataSourceSecret ?? false,
        isGlobalFilterEnabled: attr.IsGlobalFilterEnabled?.Value ?? false,
        isLogical: attr.IsLogical ?? false,
        isRenameable: attr.IsRenameable?.Value ?? false,
        isRetrievable: attr.IsRetrievable ?? false,
        isSortableEnabled: attr.IsSortableEnabled?.Value ?? false,
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
  const keyMetadata: ISubscriptionKeyMetadata = {
    primaryIdAttribute: metadata?.PrimaryIdAttribute ?? null,
    primaryNameAttribute: metadata?.PrimaryNameAttribute ?? null,
    primaryKey: metadata?.PrimaryKey ?? [],
  }

  const oneToManyRelationships: ISubscriptionOneToManyRelationship[] = metadata?.OneToManyRelationships
    ? metadata.OneToManyRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        referencingEntity: r.ReferencingEntity ?? '',
        referencingAttribute: r.ReferencingAttribute ?? '',
        referencedEntity: r.ReferencedEntity ?? '',
        referencedAttribute: r.ReferencedAttribute ?? '',
        isHierarchical: r.IsHierarchical ?? false,
      }))
    : []

  const manyToOneRelationships: ISubscriptionOneToManyRelationship[] = metadata?.ManyToOneRelationships
    ? metadata.ManyToOneRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        referencingEntity: r.ReferencingEntity ?? '',
        referencingAttribute: r.ReferencingAttribute ?? '',
        referencedEntity: r.ReferencedEntity ?? '',
        referencedAttribute: r.ReferencedAttribute ?? '',
        isHierarchical: r.IsHierarchical ?? false,
      }))
    : []

  const manyToManyRelationships: ISubscriptionManyToManyRelationship[] = metadata?.ManyToManyRelationships
    ? metadata.ManyToManyRelationships.map(r => ({
        schemaName: r.SchemaName ?? '',
        entity1LogicalName: r.Entity1LogicalName ?? '',
        entity2LogicalName: r.Entity2LogicalName ?? '',
        intersectEntityName: r.IntersectEntityName ?? '',
        entity1IntersectAttribute: r.Entity1IntersectAttribute ?? '',
        entity2IntersectAttribute: r.Entity2IntersectAttribute ?? '',
      }))
    : []

  const privileges: ISubscriptionPrivilege[] = metadata?.Privileges
    ? metadata.Privileges.map(p => ({
        name: p.Name ?? '',
        privilegeId: p.PrivilegeId ?? '',
        // AI-INTENT: Dataverse may return PrivilegeType as a numeric enum or as the resolved string name.
        // getPrivilegeTypeName handles numeric values; the String() fallback handles pre-resolved strings.
        privilegeType: (p.PrivilegeType != null ? (getPrivilegeTypeName(p.PrivilegeType) ?? String(p.PrivilegeType)) : 'None') as SubscriptionPrivilegeType,
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
