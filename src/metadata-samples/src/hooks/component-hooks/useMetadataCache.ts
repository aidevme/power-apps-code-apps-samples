// AI-CONTEXT: Mounts all 27 entity metadata hooks once and builds a stable metadataCache lookup map.
// AI-FILE-RELATIONS:
//   - types:      src/tools/metadataCache.types.ts               (IEntityMetadataCacheEntry)
//   - hooks:      src/hooks/metadata-hooks/index.ts              (all 27 entity metadata hooks)
//   - consumer:   src/components/apps/main/MainApp.tsx           (the only caller)
// AI-CONSTRAINT: Never call individual entity metadata hooks directly from route components — always consume via metadataCache or the hook results returned here.
// AI-PATTERN: To add a new entity, add its hook call, include tableInfo in the useMemo arrays, and add the result to IUseMetadataCacheResult.

import { useMemo } from 'react'
import type { IEntityMetadataCacheEntry } from '../../tools/metadataCache.types'
import type { IEntityTableInfo } from '../metadata-hooks'
import {
  useAadUserMetadata, useAccountMetadata, useAppEventLogMetadata,
  useAppointmentMetadata, useAuditMetadata, useBusinessUnitMetadata,
  useConfigurationSettingMetadata, useContactMetadata,
  useCustomApiMetadata, useCustomApiRequestParameterMetadata, useCustomApiResponsePropertyMetadata,
  useEmailMetadata, useEntitiesMetadata,
  useEnvironmentVariableDefinitionMetadata, useEnvironmentVariableValueMetadata,
  useLeadMetadata, useOpportunityMetadata, useSavedQueriesMetadata,
  useSolutionComponentDefinitionMetadata, useSolutionComponentMetadata, useSolutionMetadata,
  useSystemFormMetadata, useSystemUserMetadata, useTaskMetadata, useTeamMetadata,
  useTransactionCurrencyMetadata, useWebresourceMetadata, useSubscriptionMetadata,
} from '../metadata-hooks'
import type {
  IUseAadUserMetadataResult,
  IUseAccountMetadataResult,
  IUseAppEventLogMetadataResult,
  IUseAppointmentMetadataResult,
  IUseAuditMetadataResult,
  IUseBusinessUnitMetadataResult,
  IUseConfigurationSettingMetadataResult,
  IUseContactMetadataResult,
  IUseCustomApiMetadataResult,
  IUseCustomApiRequestParameterMetadataResult,
  IUseCustomApiResponsePropertyMetadataResult,
  IUseEmailMetadataResult,
  IUseEntitiesMetadataResult,
  IUseEnvironmentVariableDefinitionMetadataResult,
  IUseEnvironmentVariableValueMetadataResult,
  IUseLeadMetadataResult,
  IUseOpportunityMetadataResult,
  IUseSavedQueriesMetadataResult,
  IUseSolutionComponentDefinitionMetadataResult,
  IUseSolutionComponentMetadataResult,
  IUseSolutionMetadataResult,
  IUseSystemFormMetadataResult,
  IUseSystemUserMetadataResult,
  IUseTaskMetadataResult,
  IUseTeamMetadataResult,
  IUseTransactionCurrencyMetadataResult,
  IUseWebresourceMetadataResult,
  IUseSubscriptionMetadataResult,
} from '../metadata-hooks'

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

/**
 * Return value of the {@link useMetadataCache} hook.
 *
 * @remarks
 * Contains the pre-built `metadataCache` lookup map and individual metadata results
 * for every Dataverse entity mounted at startup. Route components that need
 * per-entity metadata receive the relevant result object via props from `MainApp`.
 */
export interface IUseMetadataCacheResult {
  /**
   * Map of entity logical name → {@link IEntityMetadataCacheEntry}.
   * Built from all hook `tableInfo` values via `useMemo`.
   * Stable across renders unless a table's metadata changes.
   */
  metadataCache: Record<string, IEntityMetadataCacheEntry>
  /** Metadata result for the `aaduser` (Azure AD User) table. */
  aadUserMetadata: IUseAadUserMetadataResult
  /** Metadata result for the `account` table. */
  accountMetadata: IUseAccountMetadataResult
  /** Metadata result for the `aidevme_appeventlog` table. */
  appEventLogMetadata: IUseAppEventLogMetadataResult
  /** Metadata result for the `appointment` table. */
  appointmentMetadata: IUseAppointmentMetadataResult
  /** Metadata result for the `audit` table. */
  auditMetadata: IUseAuditMetadataResult
  /** Metadata result for the `businessunit` table. */
  businessUnitMetadata: IUseBusinessUnitMetadataResult
  /** Metadata result for the `aidevme_codeappssamplesconfigurationsetting` table. */
  configurationSettingMetadata: IUseConfigurationSettingMetadataResult
  /** Metadata result for the `contact` table. */
  contactMetadata: IUseContactMetadataResult
  /** Metadata result for the `customapi` table. */
  customApiMetadata: IUseCustomApiMetadataResult
  /** Metadata result for the `customapirequestparameter` table. */
  customApiRequestParameterMetadata: IUseCustomApiRequestParameterMetadataResult
  /** Metadata result for the `customapiresponseproperty` table. */
  customApiResponsePropertyMetadata: IUseCustomApiResponsePropertyMetadataResult
  /** Metadata result for the `email` table. */
  emailMetadata: IUseEmailMetadataResult
  /** Metadata result for the `entity` (Entities) table. */
  entitiesMetadata: IUseEntitiesMetadataResult
  /** Metadata result for the `environmentvariabledefinition` table. */
  environmentVariableDefinitionMetadata: IUseEnvironmentVariableDefinitionMetadataResult
  /** Metadata result for the `environmentvariablevalue` table. */
  environmentVariableValueMetadata: IUseEnvironmentVariableValueMetadataResult
  /** Metadata result for the `lead` table. */
  leadMetadata: IUseLeadMetadataResult
  /** Metadata result for the `opportunity` table. */
  opportunityMetadata: IUseOpportunityMetadataResult
  /** Metadata result for the `savedquery` (public views) table. */
  savedQueriesMetadata: IUseSavedQueriesMetadataResult
  /** Metadata result for the `solutioncomponentdefinition` table. */
  solutionComponentDefinitionMetadata: IUseSolutionComponentDefinitionMetadataResult
  /** Metadata result for the `solutioncomponent` table. */
  solutionComponentMetadata: IUseSolutionComponentMetadataResult
  /** Metadata result for the `solution` table. */
  solutionMetadata: IUseSolutionMetadataResult
  /** Metadata result for the `systemform` table. */
  systemFormMetadata: IUseSystemFormMetadataResult
  /** Metadata result for the `systemuser` table. */
  systemUserMetadata: IUseSystemUserMetadataResult
  /** Metadata result for the `task` table. */
  taskMetadata: IUseTaskMetadataResult
  /** Metadata result for the `team` table. */
  teamMetadata: IUseTeamMetadataResult
  /** Metadata result for the `transactioncurrency` table. */
  transactionCurrencyMetadata: IUseTransactionCurrencyMetadataResult
  /** Metadata result for the `webresource` table. */
  webresourceMetadata: IUseWebresourceMetadataResult
  /** Metadata result for the `subscription` table. */
  subscriptionMetadata: IUseSubscriptionMetadataResult
  /** Full {@link IEntityTableInfo} for every loaded entity, keyed by logical name. */
  tableInfoCache: Record<string, IEntityTableInfo>
  /**
   * Pre-built attribute rows for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataColumnsTable} as `attributes`.
   */
  columnsCache: Record<string, {
    /** Dataverse logical column name. */
    logicalName: string
    /** User-localised display label. */
    displayName: string
    /** Dataverse attribute type string, e.g. `"StringType"`. */
    attributeType: string
    /** Whether the field is required on Dataverse forms. */
    isRequiredForForm: boolean
    /** User-localised description of the column purpose. */
    description: string
  }[]>
  /**
   * Pre-built one-to-many relationship rows for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataRelationshipTable} as `relationships`.
   */
  oneToManyCache: Record<string, {
    /** OData schema name for the relationship. */
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
  }[]>
  /**
   * Pre-built many-to-one relationship rows for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataRelationshipTable} as `relationships`.
   */
  manyToOneCache: Record<string, {
    /** OData schema name for the relationship. */
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
  }[]>
  /**
   * Pre-built many-to-many relationship rows for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataManyToManyTable} as `relationships`.
   */
  manyToManyCache: Record<string, {
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
  }[]>
  /**
   * Pre-built privilege rows for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataPrivilegesTable} as `privileges`.
   */
  privilegesCache: Record<string, {
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
  }[]>
  /**
   * Pre-built solutions data for every loaded entity, keyed by logical name.
   * Ready to pass directly to {@link MetadataSolutionsTable} as `loading`, `error`, and `solutions`.
   */
  solutionsCache: Record<string, {
    /** Whether solutions are still being fetched from Dataverse for this entity. */
    loading: boolean
    /** Error from the solutions fetch, or `null` on success. */
    error: string | null
    /** Solutions that contain this entity as a component. */
    solutions: {
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
    }[]
  }>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Mounts all 27 entity metadata hooks once at startup and returns their results
 * alongside a pre-built `metadataCache` lookup map.
 *
 * @remarks
 * This hook is the single aggregation point for all Dataverse entity metadata in
 * the metadata-samples app. It is designed to be called once in `MainApp` and the
 * results passed down to route components via props.
 *
 * `metadataCache` is derived via `useMemo` from all hook `tableInfo` values and
 * is stable across renders unless a table's metadata changes.
 *
 * **Extension pattern:** add the new hook call, include `newHook.tableInfo` in
 * both the `tableInfos` array and the `useMemo` dependency array, then add the
 * result to {@link IUseMetadataCacheResult}.
 *
 * @returns {@link IUseMetadataCacheResult} — all individual metadata results and the aggregated cache.
 *
 * @example
 * ```tsx
 * const { metadataCache, accountMetadata } = useMetadataCache()
 * ```
 */
export function useMetadataCache(): IUseMetadataCacheResult {
  const aadUserMetadata = useAadUserMetadata()
  const accountMetadata = useAccountMetadata()
  const appEventLogMetadata = useAppEventLogMetadata()
  const appointmentMetadata = useAppointmentMetadata()
  const auditMetadata = useAuditMetadata()
  const businessUnitMetadata = useBusinessUnitMetadata()
  const configurationSettingMetadata = useConfigurationSettingMetadata()
  const contactMetadata = useContactMetadata()
  const customApiMetadata = useCustomApiMetadata()
  const customApiRequestParameterMetadata = useCustomApiRequestParameterMetadata()
  const customApiResponsePropertyMetadata = useCustomApiResponsePropertyMetadata()
  const emailMetadata = useEmailMetadata()
  const entitiesMetadata = useEntitiesMetadata()
  const environmentVariableDefinitionMetadata = useEnvironmentVariableDefinitionMetadata()
  const environmentVariableValueMetadata = useEnvironmentVariableValueMetadata()
  const leadMetadata = useLeadMetadata()
  const opportunityMetadata = useOpportunityMetadata()
  const savedQueriesMetadata = useSavedQueriesMetadata()
  const solutionComponentDefinitionMetadata = useSolutionComponentDefinitionMetadata()
  const solutionComponentMetadata = useSolutionComponentMetadata()
  const solutionMetadata = useSolutionMetadata()
  const systemFormMetadata = useSystemFormMetadata()
  const systemUserMetadata = useSystemUserMetadata()
  const taskMetadata = useTaskMetadata()
  const teamMetadata = useTeamMetadata()
  const transactionCurrencyMetadata = useTransactionCurrencyMetadata()
  const webresourceMetadata = useWebresourceMetadata()
  const subscriptionMetadata = useSubscriptionMetadata()

  // AI-CONTEXT: Build a map of logicalName → IEntityMetadataCacheEntry from all startup metadata hooks.
  // AI-PATTERN: Add new metadata hooks to the tableInfos array to automatically include them in the cache.
  // AI-CONSTRAINT: Only add hooks mounted unconditionally above — never conditionally mounted hooks.
  const metadataCache = useMemo<Record<string, IEntityMetadataCacheEntry>>(() => {
    const tableInfos = [
      aadUserMetadata.tableInfo, accountMetadata.tableInfo, appEventLogMetadata.tableInfo,
      appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
      configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
      customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
      emailMetadata.tableInfo, entitiesMetadata.tableInfo,
      environmentVariableDefinitionMetadata.tableInfo, environmentVariableValueMetadata.tableInfo,
      leadMetadata.tableInfo, opportunityMetadata.tableInfo, savedQueriesMetadata.tableInfo,
      solutionComponentDefinitionMetadata.tableInfo, solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo,
      systemFormMetadata.tableInfo, systemUserMetadata.tableInfo, taskMetadata.tableInfo,
      teamMetadata.tableInfo, transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
      subscriptionMetadata.tableInfo,
    ]
    const cache: Record<string, IEntityMetadataCacheEntry> = {}
    for (const info of tableInfos) {
      const logicalName = info.logicalName
      if (!logicalName) continue
      cache[logicalName] = {
        logicalName,
        displayName:        info.displayName        ?? logicalName,
        schemaName:         info.schemaName         ?? '',
        entityTypeCode:     info.objectTypeCode,
        tableType:          info.tableType          ?? 'Standard',
        ownershipType:      info.ownershipType      ?? null,
        primaryIdAttribute: info.primaryIdAttribute ?? null,
        description:        info.description        ?? null,
        isActivity:         info.isActivity         ?? null,
      }
    }
    return cache
  }, [
    aadUserMetadata.tableInfo, accountMetadata.tableInfo, appEventLogMetadata.tableInfo,
    appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
    configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
    customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
    emailMetadata.tableInfo, entitiesMetadata.tableInfo,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableValueMetadata.tableInfo,
    leadMetadata.tableInfo, opportunityMetadata.tableInfo, savedQueriesMetadata.tableInfo,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo,
    systemFormMetadata.tableInfo, systemUserMetadata.tableInfo, taskMetadata.tableInfo,
    teamMetadata.tableInfo, transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
    subscriptionMetadata.tableInfo,
  ])

  // AI-CONTEXT: tableInfoCache maps logicalName → full IEntityTableInfo for the MetadataTableTable component.
  const tableInfoCache = useMemo<Record<string, IEntityTableInfo>>(() => {
    const tableInfos = [
      aadUserMetadata.tableInfo, accountMetadata.tableInfo, appEventLogMetadata.tableInfo,
      appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
      configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
      customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
      emailMetadata.tableInfo, entitiesMetadata.tableInfo,
      environmentVariableDefinitionMetadata.tableInfo, environmentVariableValueMetadata.tableInfo,
      leadMetadata.tableInfo, opportunityMetadata.tableInfo, savedQueriesMetadata.tableInfo,
      solutionComponentDefinitionMetadata.tableInfo, solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo,
      systemFormMetadata.tableInfo, systemUserMetadata.tableInfo, taskMetadata.tableInfo,
      teamMetadata.tableInfo, transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
      subscriptionMetadata.tableInfo,
    ]
    const cache: Record<string, IEntityTableInfo> = {}
    for (const info of tableInfos) {
      if (info.logicalName) cache[info.logicalName] = info
    }
    return cache
  }, [
    aadUserMetadata.tableInfo, accountMetadata.tableInfo, appEventLogMetadata.tableInfo,
    appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
    configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
    customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
    emailMetadata.tableInfo, entitiesMetadata.tableInfo,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableValueMetadata.tableInfo,
    leadMetadata.tableInfo, opportunityMetadata.tableInfo, savedQueriesMetadata.tableInfo,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo,
    systemFormMetadata.tableInfo, systemUserMetadata.tableInfo, taskMetadata.tableInfo,
    teamMetadata.tableInfo, transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
    subscriptionMetadata.tableInfo,
  ])

  // AI-CONTEXT: columnsCache maps logicalName → minimal attribute row shape for MetadataColumnsTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const columnsCache = useMemo(() => {
    const cache: Record<string, { logicalName: string; displayName: string; attributeType: string; isRequiredForForm: boolean; description: string }[]> = {}
    if (aadUserMetadata.tableInfo.logicalName)                      cache[aadUserMetadata.tableInfo.logicalName]                      = aadUserMetadata.attributes
    if (accountMetadata.tableInfo.logicalName)                      cache[accountMetadata.tableInfo.logicalName]                      = accountMetadata.attributes
    if (appEventLogMetadata.tableInfo.logicalName)                  cache[appEventLogMetadata.tableInfo.logicalName]                  = appEventLogMetadata.attributes
    if (appointmentMetadata.tableInfo.logicalName)                  cache[appointmentMetadata.tableInfo.logicalName]                  = appointmentMetadata.attributes
    if (auditMetadata.tableInfo.logicalName)                        cache[auditMetadata.tableInfo.logicalName]                        = auditMetadata.attributes
    if (businessUnitMetadata.tableInfo.logicalName)                 cache[businessUnitMetadata.tableInfo.logicalName]                 = businessUnitMetadata.attributes
    if (configurationSettingMetadata.tableInfo.logicalName)         cache[configurationSettingMetadata.tableInfo.logicalName]         = configurationSettingMetadata.attributes
    if (contactMetadata.tableInfo.logicalName)                      cache[contactMetadata.tableInfo.logicalName]                      = contactMetadata.attributes
    if (customApiMetadata.tableInfo.logicalName)                    cache[customApiMetadata.tableInfo.logicalName]                    = customApiMetadata.attributes
    if (customApiRequestParameterMetadata.tableInfo.logicalName)    cache[customApiRequestParameterMetadata.tableInfo.logicalName]    = customApiRequestParameterMetadata.attributes
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)    cache[customApiResponsePropertyMetadata.tableInfo.logicalName]    = customApiResponsePropertyMetadata.attributes
    if (emailMetadata.tableInfo.logicalName)                        cache[emailMetadata.tableInfo.logicalName]                        = emailMetadata.attributes
    if (entitiesMetadata.tableInfo.logicalName)                     cache[entitiesMetadata.tableInfo.logicalName]                     = entitiesMetadata.attributes
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = environmentVariableDefinitionMetadata.attributes
    if (environmentVariableValueMetadata.tableInfo.logicalName)     cache[environmentVariableValueMetadata.tableInfo.logicalName]     = environmentVariableValueMetadata.attributes
    if (leadMetadata.tableInfo.logicalName)                         cache[leadMetadata.tableInfo.logicalName]                         = leadMetadata.attributes
    if (opportunityMetadata.tableInfo.logicalName)                  cache[opportunityMetadata.tableInfo.logicalName]                  = opportunityMetadata.attributes
    if (savedQueriesMetadata.tableInfo.logicalName)                 cache[savedQueriesMetadata.tableInfo.logicalName]                 = savedQueriesMetadata.attributes
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)  cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]  = solutionComponentDefinitionMetadata.attributes
    if (solutionComponentMetadata.tableInfo.logicalName)            cache[solutionComponentMetadata.tableInfo.logicalName]            = solutionComponentMetadata.attributes
    if (solutionMetadata.tableInfo.logicalName)                     cache[solutionMetadata.tableInfo.logicalName]                     = solutionMetadata.attributes
    if (systemFormMetadata.tableInfo.logicalName)                   cache[systemFormMetadata.tableInfo.logicalName]                   = systemFormMetadata.attributes
    if (systemUserMetadata.tableInfo.logicalName)                   cache[systemUserMetadata.tableInfo.logicalName]                   = systemUserMetadata.attributes
    if (taskMetadata.tableInfo.logicalName)                         cache[taskMetadata.tableInfo.logicalName]                         = taskMetadata.attributes
    if (teamMetadata.tableInfo.logicalName)                         cache[teamMetadata.tableInfo.logicalName]                         = teamMetadata.attributes
    if (transactionCurrencyMetadata.tableInfo.logicalName)          cache[transactionCurrencyMetadata.tableInfo.logicalName]          = transactionCurrencyMetadata.attributes
    if (webresourceMetadata.tableInfo.logicalName)                  cache[webresourceMetadata.tableInfo.logicalName]                  = webresourceMetadata.attributes
    if (subscriptionMetadata.tableInfo.logicalName)                 cache[subscriptionMetadata.tableInfo.logicalName]                 = subscriptionMetadata.attributes
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.attributes,
    accountMetadata.tableInfo, accountMetadata.attributes,
    appEventLogMetadata.tableInfo, appEventLogMetadata.attributes,
    appointmentMetadata.tableInfo, appointmentMetadata.attributes,
    auditMetadata.tableInfo, auditMetadata.attributes,
    businessUnitMetadata.tableInfo, businessUnitMetadata.attributes,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.attributes,
    contactMetadata.tableInfo, contactMetadata.attributes,
    customApiMetadata.tableInfo, customApiMetadata.attributes,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.attributes,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.attributes,
    emailMetadata.tableInfo, emailMetadata.attributes,
    entitiesMetadata.tableInfo, entitiesMetadata.attributes,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.attributes,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.attributes,
    leadMetadata.tableInfo, leadMetadata.attributes,
    opportunityMetadata.tableInfo, opportunityMetadata.attributes,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.attributes,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.attributes,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.attributes,
    solutionMetadata.tableInfo, solutionMetadata.attributes,
    systemFormMetadata.tableInfo, systemFormMetadata.attributes,
    systemUserMetadata.tableInfo, systemUserMetadata.attributes,
    taskMetadata.tableInfo, taskMetadata.attributes,
    teamMetadata.tableInfo, teamMetadata.attributes,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.attributes,
    webresourceMetadata.tableInfo, webresourceMetadata.attributes,
    subscriptionMetadata.tableInfo, subscriptionMetadata.attributes,
  ])

  // AI-CONTEXT: oneToManyCache maps logicalName → one-to-many relationship rows for MetadataRelationshipTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const oneToManyCache = useMemo(() => {
    const cache: Record<string, { schemaName: string; referencingEntity: string; referencingAttribute: string; referencedEntity: string; referencedAttribute: string; isHierarchical: boolean }[]> = {}
    if (aadUserMetadata.tableInfo.logicalName)                      cache[aadUserMetadata.tableInfo.logicalName]                      = aadUserMetadata.oneToManyRelationships
    if (accountMetadata.tableInfo.logicalName)                      cache[accountMetadata.tableInfo.logicalName]                      = accountMetadata.oneToManyRelationships
    if (appEventLogMetadata.tableInfo.logicalName)                  cache[appEventLogMetadata.tableInfo.logicalName]                  = appEventLogMetadata.oneToManyRelationships
    if (appointmentMetadata.tableInfo.logicalName)                  cache[appointmentMetadata.tableInfo.logicalName]                  = appointmentMetadata.oneToManyRelationships
    if (auditMetadata.tableInfo.logicalName)                        cache[auditMetadata.tableInfo.logicalName]                        = auditMetadata.oneToManyRelationships
    if (businessUnitMetadata.tableInfo.logicalName)                 cache[businessUnitMetadata.tableInfo.logicalName]                 = businessUnitMetadata.oneToManyRelationships
    if (configurationSettingMetadata.tableInfo.logicalName)         cache[configurationSettingMetadata.tableInfo.logicalName]         = configurationSettingMetadata.oneToManyRelationships
    if (contactMetadata.tableInfo.logicalName)                      cache[contactMetadata.tableInfo.logicalName]                      = contactMetadata.oneToManyRelationships
    if (customApiMetadata.tableInfo.logicalName)                    cache[customApiMetadata.tableInfo.logicalName]                    = customApiMetadata.oneToManyRelationships
    if (customApiRequestParameterMetadata.tableInfo.logicalName)    cache[customApiRequestParameterMetadata.tableInfo.logicalName]    = customApiRequestParameterMetadata.oneToManyRelationships
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)    cache[customApiResponsePropertyMetadata.tableInfo.logicalName]    = customApiResponsePropertyMetadata.oneToManyRelationships
    if (emailMetadata.tableInfo.logicalName)                        cache[emailMetadata.tableInfo.logicalName]                        = emailMetadata.oneToManyRelationships
    if (entitiesMetadata.tableInfo.logicalName)                     cache[entitiesMetadata.tableInfo.logicalName]                     = entitiesMetadata.oneToManyRelationships
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = environmentVariableDefinitionMetadata.oneToManyRelationships
    if (environmentVariableValueMetadata.tableInfo.logicalName)     cache[environmentVariableValueMetadata.tableInfo.logicalName]     = environmentVariableValueMetadata.oneToManyRelationships
    if (leadMetadata.tableInfo.logicalName)                         cache[leadMetadata.tableInfo.logicalName]                         = leadMetadata.oneToManyRelationships
    if (opportunityMetadata.tableInfo.logicalName)                  cache[opportunityMetadata.tableInfo.logicalName]                  = opportunityMetadata.oneToManyRelationships
    if (savedQueriesMetadata.tableInfo.logicalName)                 cache[savedQueriesMetadata.tableInfo.logicalName]                 = savedQueriesMetadata.oneToManyRelationships
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)  cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]  = solutionComponentDefinitionMetadata.oneToManyRelationships
    if (solutionComponentMetadata.tableInfo.logicalName)            cache[solutionComponentMetadata.tableInfo.logicalName]            = solutionComponentMetadata.oneToManyRelationships
    if (solutionMetadata.tableInfo.logicalName)                     cache[solutionMetadata.tableInfo.logicalName]                     = solutionMetadata.oneToManyRelationships
    if (systemFormMetadata.tableInfo.logicalName)                   cache[systemFormMetadata.tableInfo.logicalName]                   = systemFormMetadata.oneToManyRelationships
    if (systemUserMetadata.tableInfo.logicalName)                   cache[systemUserMetadata.tableInfo.logicalName]                   = systemUserMetadata.oneToManyRelationships
    if (taskMetadata.tableInfo.logicalName)                         cache[taskMetadata.tableInfo.logicalName]                         = taskMetadata.oneToManyRelationships
    if (teamMetadata.tableInfo.logicalName)                         cache[teamMetadata.tableInfo.logicalName]                         = teamMetadata.oneToManyRelationships
    if (transactionCurrencyMetadata.tableInfo.logicalName)          cache[transactionCurrencyMetadata.tableInfo.logicalName]          = transactionCurrencyMetadata.oneToManyRelationships
    if (webresourceMetadata.tableInfo.logicalName)                  cache[webresourceMetadata.tableInfo.logicalName]                  = webresourceMetadata.oneToManyRelationships
    if (subscriptionMetadata.tableInfo.logicalName)                 cache[subscriptionMetadata.tableInfo.logicalName]                 = subscriptionMetadata.oneToManyRelationships
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.oneToManyRelationships,
    accountMetadata.tableInfo, accountMetadata.oneToManyRelationships,
    appEventLogMetadata.tableInfo, appEventLogMetadata.oneToManyRelationships,
    appointmentMetadata.tableInfo, appointmentMetadata.oneToManyRelationships,
    auditMetadata.tableInfo, auditMetadata.oneToManyRelationships,
    businessUnitMetadata.tableInfo, businessUnitMetadata.oneToManyRelationships,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.oneToManyRelationships,
    contactMetadata.tableInfo, contactMetadata.oneToManyRelationships,
    customApiMetadata.tableInfo, customApiMetadata.oneToManyRelationships,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.oneToManyRelationships,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.oneToManyRelationships,
    emailMetadata.tableInfo, emailMetadata.oneToManyRelationships,
    entitiesMetadata.tableInfo, entitiesMetadata.oneToManyRelationships,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.oneToManyRelationships,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.oneToManyRelationships,
    leadMetadata.tableInfo, leadMetadata.oneToManyRelationships,
    opportunityMetadata.tableInfo, opportunityMetadata.oneToManyRelationships,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.oneToManyRelationships,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.oneToManyRelationships,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.oneToManyRelationships,
    solutionMetadata.tableInfo, solutionMetadata.oneToManyRelationships,
    systemFormMetadata.tableInfo, systemFormMetadata.oneToManyRelationships,
    systemUserMetadata.tableInfo, systemUserMetadata.oneToManyRelationships,
    taskMetadata.tableInfo, taskMetadata.oneToManyRelationships,
    teamMetadata.tableInfo, teamMetadata.oneToManyRelationships,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.oneToManyRelationships,
    webresourceMetadata.tableInfo, webresourceMetadata.oneToManyRelationships,
    subscriptionMetadata.tableInfo, subscriptionMetadata.oneToManyRelationships,
  ])

  // AI-CONTEXT: manyToOneCache maps logicalName → many-to-one relationship rows for MetadataRelationshipTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const manyToOneCache = useMemo(() => {
    const cache: Record<string, { schemaName: string; referencingEntity: string; referencingAttribute: string; referencedEntity: string; referencedAttribute: string; isHierarchical: boolean }[]> = {}
    if (aadUserMetadata.tableInfo.logicalName)                       cache[aadUserMetadata.tableInfo.logicalName]                       = aadUserMetadata.manyToOneRelationships
    if (accountMetadata.tableInfo.logicalName)                       cache[accountMetadata.tableInfo.logicalName]                       = accountMetadata.manyToOneRelationships
    if (appEventLogMetadata.tableInfo.logicalName)                   cache[appEventLogMetadata.tableInfo.logicalName]                   = appEventLogMetadata.manyToOneRelationships
    if (appointmentMetadata.tableInfo.logicalName)                   cache[appointmentMetadata.tableInfo.logicalName]                   = appointmentMetadata.manyToOneRelationships
    if (auditMetadata.tableInfo.logicalName)                         cache[auditMetadata.tableInfo.logicalName]                         = auditMetadata.manyToOneRelationships
    if (businessUnitMetadata.tableInfo.logicalName)                  cache[businessUnitMetadata.tableInfo.logicalName]                  = businessUnitMetadata.manyToOneRelationships
    if (configurationSettingMetadata.tableInfo.logicalName)          cache[configurationSettingMetadata.tableInfo.logicalName]          = configurationSettingMetadata.manyToOneRelationships
    if (contactMetadata.tableInfo.logicalName)                       cache[contactMetadata.tableInfo.logicalName]                       = contactMetadata.manyToOneRelationships
    if (customApiMetadata.tableInfo.logicalName)                     cache[customApiMetadata.tableInfo.logicalName]                     = customApiMetadata.manyToOneRelationships
    if (customApiRequestParameterMetadata.tableInfo.logicalName)     cache[customApiRequestParameterMetadata.tableInfo.logicalName]     = customApiRequestParameterMetadata.manyToOneRelationships
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)     cache[customApiResponsePropertyMetadata.tableInfo.logicalName]     = customApiResponsePropertyMetadata.manyToOneRelationships
    if (emailMetadata.tableInfo.logicalName)                         cache[emailMetadata.tableInfo.logicalName]                         = emailMetadata.manyToOneRelationships
    if (entitiesMetadata.tableInfo.logicalName)                      cache[entitiesMetadata.tableInfo.logicalName]                      = entitiesMetadata.manyToOneRelationships
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = environmentVariableDefinitionMetadata.manyToOneRelationships
    if (environmentVariableValueMetadata.tableInfo.logicalName)      cache[environmentVariableValueMetadata.tableInfo.logicalName]      = environmentVariableValueMetadata.manyToOneRelationships
    if (leadMetadata.tableInfo.logicalName)                          cache[leadMetadata.tableInfo.logicalName]                          = leadMetadata.manyToOneRelationships
    if (opportunityMetadata.tableInfo.logicalName)                   cache[opportunityMetadata.tableInfo.logicalName]                   = opportunityMetadata.manyToOneRelationships
    if (savedQueriesMetadata.tableInfo.logicalName)                  cache[savedQueriesMetadata.tableInfo.logicalName]                  = savedQueriesMetadata.manyToOneRelationships
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)   cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]   = solutionComponentDefinitionMetadata.manyToOneRelationships
    if (solutionComponentMetadata.tableInfo.logicalName)             cache[solutionComponentMetadata.tableInfo.logicalName]             = solutionComponentMetadata.manyToOneRelationships
    if (solutionMetadata.tableInfo.logicalName)                      cache[solutionMetadata.tableInfo.logicalName]                      = solutionMetadata.manyToOneRelationships
    if (systemFormMetadata.tableInfo.logicalName)                    cache[systemFormMetadata.tableInfo.logicalName]                    = systemFormMetadata.manyToOneRelationships
    if (systemUserMetadata.tableInfo.logicalName)                    cache[systemUserMetadata.tableInfo.logicalName]                    = systemUserMetadata.manyToOneRelationships
    if (taskMetadata.tableInfo.logicalName)                          cache[taskMetadata.tableInfo.logicalName]                          = taskMetadata.manyToOneRelationships
    if (teamMetadata.tableInfo.logicalName)                          cache[teamMetadata.tableInfo.logicalName]                          = teamMetadata.manyToOneRelationships
    if (transactionCurrencyMetadata.tableInfo.logicalName)           cache[transactionCurrencyMetadata.tableInfo.logicalName]           = transactionCurrencyMetadata.manyToOneRelationships
    if (webresourceMetadata.tableInfo.logicalName)                   cache[webresourceMetadata.tableInfo.logicalName]                   = webresourceMetadata.manyToOneRelationships
    if (subscriptionMetadata.tableInfo.logicalName)                  cache[subscriptionMetadata.tableInfo.logicalName]                  = subscriptionMetadata.manyToOneRelationships
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.manyToOneRelationships,
    accountMetadata.tableInfo, accountMetadata.manyToOneRelationships,
    appEventLogMetadata.tableInfo, appEventLogMetadata.manyToOneRelationships,
    appointmentMetadata.tableInfo, appointmentMetadata.manyToOneRelationships,
    auditMetadata.tableInfo, auditMetadata.manyToOneRelationships,
    businessUnitMetadata.tableInfo, businessUnitMetadata.manyToOneRelationships,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.manyToOneRelationships,
    contactMetadata.tableInfo, contactMetadata.manyToOneRelationships,
    customApiMetadata.tableInfo, customApiMetadata.manyToOneRelationships,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.manyToOneRelationships,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.manyToOneRelationships,
    emailMetadata.tableInfo, emailMetadata.manyToOneRelationships,
    entitiesMetadata.tableInfo, entitiesMetadata.manyToOneRelationships,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.manyToOneRelationships,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.manyToOneRelationships,
    leadMetadata.tableInfo, leadMetadata.manyToOneRelationships,
    opportunityMetadata.tableInfo, opportunityMetadata.manyToOneRelationships,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.manyToOneRelationships,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.manyToOneRelationships,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.manyToOneRelationships,
    solutionMetadata.tableInfo, solutionMetadata.manyToOneRelationships,
    systemFormMetadata.tableInfo, systemFormMetadata.manyToOneRelationships,
    systemUserMetadata.tableInfo, systemUserMetadata.manyToOneRelationships,
    taskMetadata.tableInfo, taskMetadata.manyToOneRelationships,
    teamMetadata.tableInfo, teamMetadata.manyToOneRelationships,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.manyToOneRelationships,
    webresourceMetadata.tableInfo, webresourceMetadata.manyToOneRelationships,
    subscriptionMetadata.tableInfo, subscriptionMetadata.manyToOneRelationships,
  ])

  // AI-CONTEXT: manyToManyCache maps logicalName → many-to-many relationship rows for MetadataManyToManyTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const manyToManyCache = useMemo(() => {
    const cache: Record<string, { schemaName: string; entity1LogicalName: string; entity2LogicalName: string; intersectEntityName: string; entity1IntersectAttribute: string; entity2IntersectAttribute: string }[]> = {}
    if (aadUserMetadata.tableInfo.logicalName)                       cache[aadUserMetadata.tableInfo.logicalName]                       = aadUserMetadata.manyToManyRelationships
    if (accountMetadata.tableInfo.logicalName)                       cache[accountMetadata.tableInfo.logicalName]                       = accountMetadata.manyToManyRelationships
    if (appEventLogMetadata.tableInfo.logicalName)                   cache[appEventLogMetadata.tableInfo.logicalName]                   = appEventLogMetadata.manyToManyRelationships
    if (appointmentMetadata.tableInfo.logicalName)                   cache[appointmentMetadata.tableInfo.logicalName]                   = appointmentMetadata.manyToManyRelationships
    if (auditMetadata.tableInfo.logicalName)                         cache[auditMetadata.tableInfo.logicalName]                         = auditMetadata.manyToManyRelationships
    if (businessUnitMetadata.tableInfo.logicalName)                  cache[businessUnitMetadata.tableInfo.logicalName]                  = businessUnitMetadata.manyToManyRelationships
    if (configurationSettingMetadata.tableInfo.logicalName)          cache[configurationSettingMetadata.tableInfo.logicalName]          = configurationSettingMetadata.manyToManyRelationships
    if (contactMetadata.tableInfo.logicalName)                       cache[contactMetadata.tableInfo.logicalName]                       = contactMetadata.manyToManyRelationships
    if (customApiMetadata.tableInfo.logicalName)                     cache[customApiMetadata.tableInfo.logicalName]                     = customApiMetadata.manyToManyRelationships
    if (customApiRequestParameterMetadata.tableInfo.logicalName)     cache[customApiRequestParameterMetadata.tableInfo.logicalName]     = customApiRequestParameterMetadata.manyToManyRelationships
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)     cache[customApiResponsePropertyMetadata.tableInfo.logicalName]     = customApiResponsePropertyMetadata.manyToManyRelationships
    if (emailMetadata.tableInfo.logicalName)                         cache[emailMetadata.tableInfo.logicalName]                         = emailMetadata.manyToManyRelationships
    if (entitiesMetadata.tableInfo.logicalName)                      cache[entitiesMetadata.tableInfo.logicalName]                      = entitiesMetadata.manyToManyRelationships
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = environmentVariableDefinitionMetadata.manyToManyRelationships
    if (environmentVariableValueMetadata.tableInfo.logicalName)      cache[environmentVariableValueMetadata.tableInfo.logicalName]      = environmentVariableValueMetadata.manyToManyRelationships
    if (leadMetadata.tableInfo.logicalName)                          cache[leadMetadata.tableInfo.logicalName]                          = leadMetadata.manyToManyRelationships
    if (opportunityMetadata.tableInfo.logicalName)                   cache[opportunityMetadata.tableInfo.logicalName]                   = opportunityMetadata.manyToManyRelationships
    if (savedQueriesMetadata.tableInfo.logicalName)                  cache[savedQueriesMetadata.tableInfo.logicalName]                  = savedQueriesMetadata.manyToManyRelationships
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)   cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]   = solutionComponentDefinitionMetadata.manyToManyRelationships
    if (solutionComponentMetadata.tableInfo.logicalName)             cache[solutionComponentMetadata.tableInfo.logicalName]             = solutionComponentMetadata.manyToManyRelationships
    if (solutionMetadata.tableInfo.logicalName)                      cache[solutionMetadata.tableInfo.logicalName]                      = solutionMetadata.manyToManyRelationships
    if (systemFormMetadata.tableInfo.logicalName)                    cache[systemFormMetadata.tableInfo.logicalName]                    = systemFormMetadata.manyToManyRelationships
    if (systemUserMetadata.tableInfo.logicalName)                    cache[systemUserMetadata.tableInfo.logicalName]                    = systemUserMetadata.manyToManyRelationships
    if (taskMetadata.tableInfo.logicalName)                          cache[taskMetadata.tableInfo.logicalName]                          = taskMetadata.manyToManyRelationships
    if (teamMetadata.tableInfo.logicalName)                          cache[teamMetadata.tableInfo.logicalName]                          = teamMetadata.manyToManyRelationships
    if (transactionCurrencyMetadata.tableInfo.logicalName)           cache[transactionCurrencyMetadata.tableInfo.logicalName]           = transactionCurrencyMetadata.manyToManyRelationships
    if (webresourceMetadata.tableInfo.logicalName)                   cache[webresourceMetadata.tableInfo.logicalName]                   = webresourceMetadata.manyToManyRelationships
    if (subscriptionMetadata.tableInfo.logicalName)                  cache[subscriptionMetadata.tableInfo.logicalName]                  = subscriptionMetadata.manyToManyRelationships
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.manyToManyRelationships,
    accountMetadata.tableInfo, accountMetadata.manyToManyRelationships,
    appEventLogMetadata.tableInfo, appEventLogMetadata.manyToManyRelationships,
    appointmentMetadata.tableInfo, appointmentMetadata.manyToManyRelationships,
    auditMetadata.tableInfo, auditMetadata.manyToManyRelationships,
    businessUnitMetadata.tableInfo, businessUnitMetadata.manyToManyRelationships,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.manyToManyRelationships,
    contactMetadata.tableInfo, contactMetadata.manyToManyRelationships,
    customApiMetadata.tableInfo, customApiMetadata.manyToManyRelationships,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.manyToManyRelationships,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.manyToManyRelationships,
    emailMetadata.tableInfo, emailMetadata.manyToManyRelationships,
    entitiesMetadata.tableInfo, entitiesMetadata.manyToManyRelationships,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.manyToManyRelationships,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.manyToManyRelationships,
    leadMetadata.tableInfo, leadMetadata.manyToManyRelationships,
    opportunityMetadata.tableInfo, opportunityMetadata.manyToManyRelationships,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.manyToManyRelationships,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.manyToManyRelationships,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.manyToManyRelationships,
    solutionMetadata.tableInfo, solutionMetadata.manyToManyRelationships,
    systemFormMetadata.tableInfo, systemFormMetadata.manyToManyRelationships,
    systemUserMetadata.tableInfo, systemUserMetadata.manyToManyRelationships,
    taskMetadata.tableInfo, taskMetadata.manyToManyRelationships,
    teamMetadata.tableInfo, teamMetadata.manyToManyRelationships,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.manyToManyRelationships,
    webresourceMetadata.tableInfo, webresourceMetadata.manyToManyRelationships,
    subscriptionMetadata.tableInfo, subscriptionMetadata.manyToManyRelationships,
  ])

  // AI-CONTEXT: solutionsCache maps logicalName → { loading, error, solutions } for MetadataSolutionsTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const solutionsCache = useMemo(() => {
    const cache: Record<string, { loading: boolean; error: string | null; solutions: { friendlyName: string; uniqueName: string; version: string; isManaged: boolean; solutionId: string }[] }> = {}
    if (aadUserMetadata.tableInfo.logicalName)                      cache[aadUserMetadata.tableInfo.logicalName]                      = { loading: aadUserMetadata.solutionsLoading, error: aadUserMetadata.solutionsError, solutions: aadUserMetadata.solutions }
    if (accountMetadata.tableInfo.logicalName)                      cache[accountMetadata.tableInfo.logicalName]                      = { loading: accountMetadata.solutionsLoading, error: accountMetadata.solutionsError, solutions: accountMetadata.solutions }
    if (appEventLogMetadata.tableInfo.logicalName)                  cache[appEventLogMetadata.tableInfo.logicalName]                  = { loading: appEventLogMetadata.solutionsLoading, error: appEventLogMetadata.solutionsError, solutions: appEventLogMetadata.solutions }
    if (appointmentMetadata.tableInfo.logicalName)                  cache[appointmentMetadata.tableInfo.logicalName]                  = { loading: appointmentMetadata.solutionsLoading, error: appointmentMetadata.solutionsError, solutions: appointmentMetadata.solutions }
    if (auditMetadata.tableInfo.logicalName)                        cache[auditMetadata.tableInfo.logicalName]                        = { loading: auditMetadata.solutionsLoading, error: auditMetadata.solutionsError, solutions: auditMetadata.solutions }
    if (businessUnitMetadata.tableInfo.logicalName)                 cache[businessUnitMetadata.tableInfo.logicalName]                 = { loading: businessUnitMetadata.solutionsLoading, error: businessUnitMetadata.solutionsError, solutions: businessUnitMetadata.solutions }
    if (configurationSettingMetadata.tableInfo.logicalName)         cache[configurationSettingMetadata.tableInfo.logicalName]         = { loading: configurationSettingMetadata.solutionsLoading, error: configurationSettingMetadata.solutionsError, solutions: configurationSettingMetadata.solutions }
    if (contactMetadata.tableInfo.logicalName)                      cache[contactMetadata.tableInfo.logicalName]                      = { loading: contactMetadata.solutionsLoading, error: contactMetadata.solutionsError, solutions: contactMetadata.solutions }
    if (customApiMetadata.tableInfo.logicalName)                    cache[customApiMetadata.tableInfo.logicalName]                    = { loading: customApiMetadata.solutionsLoading, error: customApiMetadata.solutionsError, solutions: customApiMetadata.solutions }
    if (customApiRequestParameterMetadata.tableInfo.logicalName)    cache[customApiRequestParameterMetadata.tableInfo.logicalName]    = { loading: customApiRequestParameterMetadata.solutionsLoading, error: customApiRequestParameterMetadata.solutionsError, solutions: customApiRequestParameterMetadata.solutions }
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)    cache[customApiResponsePropertyMetadata.tableInfo.logicalName]    = { loading: customApiResponsePropertyMetadata.solutionsLoading, error: customApiResponsePropertyMetadata.solutionsError, solutions: customApiResponsePropertyMetadata.solutions }
    if (emailMetadata.tableInfo.logicalName)                        cache[emailMetadata.tableInfo.logicalName]                        = { loading: emailMetadata.solutionsLoading, error: emailMetadata.solutionsError, solutions: emailMetadata.solutions }
    if (entitiesMetadata.tableInfo.logicalName)                     cache[entitiesMetadata.tableInfo.logicalName]                     = { loading: entitiesMetadata.solutionsLoading, error: entitiesMetadata.solutionsError, solutions: entitiesMetadata.solutions }
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = { loading: environmentVariableDefinitionMetadata.solutionsLoading, error: environmentVariableDefinitionMetadata.solutionsError, solutions: environmentVariableDefinitionMetadata.solutions }
    if (environmentVariableValueMetadata.tableInfo.logicalName)     cache[environmentVariableValueMetadata.tableInfo.logicalName]     = { loading: environmentVariableValueMetadata.solutionsLoading, error: environmentVariableValueMetadata.solutionsError, solutions: environmentVariableValueMetadata.solutions }
    if (leadMetadata.tableInfo.logicalName)                         cache[leadMetadata.tableInfo.logicalName]                         = { loading: leadMetadata.solutionsLoading, error: leadMetadata.solutionsError, solutions: leadMetadata.solutions }
    if (opportunityMetadata.tableInfo.logicalName)                  cache[opportunityMetadata.tableInfo.logicalName]                  = { loading: opportunityMetadata.solutionsLoading, error: opportunityMetadata.solutionsError, solutions: opportunityMetadata.solutions }
    if (savedQueriesMetadata.tableInfo.logicalName)                 cache[savedQueriesMetadata.tableInfo.logicalName]                 = { loading: savedQueriesMetadata.solutionsLoading, error: savedQueriesMetadata.solutionsError, solutions: savedQueriesMetadata.solutions }
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)  cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]  = { loading: solutionComponentDefinitionMetadata.solutionsLoading, error: solutionComponentDefinitionMetadata.solutionsError, solutions: solutionComponentDefinitionMetadata.solutions }
    if (solutionComponentMetadata.tableInfo.logicalName)            cache[solutionComponentMetadata.tableInfo.logicalName]            = { loading: solutionComponentMetadata.solutionsLoading, error: solutionComponentMetadata.solutionsError, solutions: solutionComponentMetadata.solutions }
    if (solutionMetadata.tableInfo.logicalName)                     cache[solutionMetadata.tableInfo.logicalName]                     = { loading: solutionMetadata.solutionsLoading, error: solutionMetadata.solutionsError, solutions: solutionMetadata.solutions }
    if (systemFormMetadata.tableInfo.logicalName)                   cache[systemFormMetadata.tableInfo.logicalName]                   = { loading: systemFormMetadata.solutionsLoading, error: systemFormMetadata.solutionsError, solutions: systemFormMetadata.solutions }
    if (systemUserMetadata.tableInfo.logicalName)                   cache[systemUserMetadata.tableInfo.logicalName]                   = { loading: systemUserMetadata.solutionsLoading, error: systemUserMetadata.solutionsError, solutions: systemUserMetadata.solutions }
    if (taskMetadata.tableInfo.logicalName)                         cache[taskMetadata.tableInfo.logicalName]                         = { loading: taskMetadata.solutionsLoading, error: taskMetadata.solutionsError, solutions: taskMetadata.solutions }
    if (teamMetadata.tableInfo.logicalName)                         cache[teamMetadata.tableInfo.logicalName]                         = { loading: teamMetadata.solutionsLoading, error: teamMetadata.solutionsError, solutions: teamMetadata.solutions }
    if (transactionCurrencyMetadata.tableInfo.logicalName)          cache[transactionCurrencyMetadata.tableInfo.logicalName]          = { loading: transactionCurrencyMetadata.solutionsLoading, error: transactionCurrencyMetadata.solutionsError, solutions: transactionCurrencyMetadata.solutions }
    if (webresourceMetadata.tableInfo.logicalName)                  cache[webresourceMetadata.tableInfo.logicalName]                  = { loading: webresourceMetadata.solutionsLoading, error: webresourceMetadata.solutionsError, solutions: webresourceMetadata.solutions }
    if (subscriptionMetadata.tableInfo.logicalName)                 cache[subscriptionMetadata.tableInfo.logicalName]                 = { loading: subscriptionMetadata.solutionsLoading, error: subscriptionMetadata.solutionsError, solutions: subscriptionMetadata.solutions }
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.solutions, aadUserMetadata.solutionsLoading, aadUserMetadata.solutionsError,
    accountMetadata.tableInfo, accountMetadata.solutions, accountMetadata.solutionsLoading, accountMetadata.solutionsError,
    appEventLogMetadata.tableInfo, appEventLogMetadata.solutions, appEventLogMetadata.solutionsLoading, appEventLogMetadata.solutionsError,
    appointmentMetadata.tableInfo, appointmentMetadata.solutions, appointmentMetadata.solutionsLoading, appointmentMetadata.solutionsError,
    auditMetadata.tableInfo, auditMetadata.solutions, auditMetadata.solutionsLoading, auditMetadata.solutionsError,
    businessUnitMetadata.tableInfo, businessUnitMetadata.solutions, businessUnitMetadata.solutionsLoading, businessUnitMetadata.solutionsError,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.solutions, configurationSettingMetadata.solutionsLoading, configurationSettingMetadata.solutionsError,
    contactMetadata.tableInfo, contactMetadata.solutions, contactMetadata.solutionsLoading, contactMetadata.solutionsError,
    customApiMetadata.tableInfo, customApiMetadata.solutions, customApiMetadata.solutionsLoading, customApiMetadata.solutionsError,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.solutions, customApiRequestParameterMetadata.solutionsLoading, customApiRequestParameterMetadata.solutionsError,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.solutions, customApiResponsePropertyMetadata.solutionsLoading, customApiResponsePropertyMetadata.solutionsError,
    emailMetadata.tableInfo, emailMetadata.solutions, emailMetadata.solutionsLoading, emailMetadata.solutionsError,
    entitiesMetadata.tableInfo, entitiesMetadata.solutions, entitiesMetadata.solutionsLoading, entitiesMetadata.solutionsError,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.solutions, environmentVariableDefinitionMetadata.solutionsLoading, environmentVariableDefinitionMetadata.solutionsError,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.solutions, environmentVariableValueMetadata.solutionsLoading, environmentVariableValueMetadata.solutionsError,
    leadMetadata.tableInfo, leadMetadata.solutions, leadMetadata.solutionsLoading, leadMetadata.solutionsError,
    opportunityMetadata.tableInfo, opportunityMetadata.solutions, opportunityMetadata.solutionsLoading, opportunityMetadata.solutionsError,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.solutions, savedQueriesMetadata.solutionsLoading, savedQueriesMetadata.solutionsError,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.solutions, solutionComponentDefinitionMetadata.solutionsLoading, solutionComponentDefinitionMetadata.solutionsError,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.solutions, solutionComponentMetadata.solutionsLoading, solutionComponentMetadata.solutionsError,
    solutionMetadata.tableInfo, solutionMetadata.solutions, solutionMetadata.solutionsLoading, solutionMetadata.solutionsError,
    systemFormMetadata.tableInfo, systemFormMetadata.solutions, systemFormMetadata.solutionsLoading, systemFormMetadata.solutionsError,
    systemUserMetadata.tableInfo, systemUserMetadata.solutions, systemUserMetadata.solutionsLoading, systemUserMetadata.solutionsError,
    taskMetadata.tableInfo, taskMetadata.solutions, taskMetadata.solutionsLoading, taskMetadata.solutionsError,
    teamMetadata.tableInfo, teamMetadata.solutions, teamMetadata.solutionsLoading, teamMetadata.solutionsError,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.solutions, transactionCurrencyMetadata.solutionsLoading, transactionCurrencyMetadata.solutionsError,
    webresourceMetadata.tableInfo, webresourceMetadata.solutions, webresourceMetadata.solutionsLoading, webresourceMetadata.solutionsError,
    subscriptionMetadata.tableInfo, subscriptionMetadata.solutions, subscriptionMetadata.solutionsLoading, subscriptionMetadata.solutionsError,
  ])

  // AI-CONTEXT: privilegesCache maps logicalName → privilege rows for MetadataPrivilegesTable.
  // AI-PATTERN: Add new entity hook entries here when adding a new entity to the cache.
  const privilegesCache = useMemo(() => {
    const cache: Record<string, { name: string; privilegeId: string; privilegeType: string; canBeBasic: boolean; canBeDeep: boolean; canBeLocal: boolean; canBeGlobal: boolean; canBeEntityReference: boolean; canBeParentEntityReference: boolean }[]> = {}
    if (aadUserMetadata.tableInfo.logicalName)                      cache[aadUserMetadata.tableInfo.logicalName]                      = aadUserMetadata.privileges
    if (accountMetadata.tableInfo.logicalName)                      cache[accountMetadata.tableInfo.logicalName]                      = accountMetadata.privileges
    if (appEventLogMetadata.tableInfo.logicalName)                  cache[appEventLogMetadata.tableInfo.logicalName]                  = appEventLogMetadata.privileges
    if (appointmentMetadata.tableInfo.logicalName)                  cache[appointmentMetadata.tableInfo.logicalName]                  = appointmentMetadata.privileges
    if (auditMetadata.tableInfo.logicalName)                        cache[auditMetadata.tableInfo.logicalName]                        = auditMetadata.privileges
    if (businessUnitMetadata.tableInfo.logicalName)                 cache[businessUnitMetadata.tableInfo.logicalName]                 = businessUnitMetadata.privileges
    if (configurationSettingMetadata.tableInfo.logicalName)         cache[configurationSettingMetadata.tableInfo.logicalName]         = configurationSettingMetadata.privileges
    if (contactMetadata.tableInfo.logicalName)                      cache[contactMetadata.tableInfo.logicalName]                      = contactMetadata.privileges
    if (customApiMetadata.tableInfo.logicalName)                    cache[customApiMetadata.tableInfo.logicalName]                    = customApiMetadata.privileges
    if (customApiRequestParameterMetadata.tableInfo.logicalName)    cache[customApiRequestParameterMetadata.tableInfo.logicalName]    = customApiRequestParameterMetadata.privileges
    if (customApiResponsePropertyMetadata.tableInfo.logicalName)    cache[customApiResponsePropertyMetadata.tableInfo.logicalName]    = customApiResponsePropertyMetadata.privileges
    if (emailMetadata.tableInfo.logicalName)                        cache[emailMetadata.tableInfo.logicalName]                        = emailMetadata.privileges
    if (entitiesMetadata.tableInfo.logicalName)                     cache[entitiesMetadata.tableInfo.logicalName]                     = entitiesMetadata.privileges
    if (environmentVariableDefinitionMetadata.tableInfo.logicalName) cache[environmentVariableDefinitionMetadata.tableInfo.logicalName] = environmentVariableDefinitionMetadata.privileges
    if (environmentVariableValueMetadata.tableInfo.logicalName)     cache[environmentVariableValueMetadata.tableInfo.logicalName]     = environmentVariableValueMetadata.privileges
    if (leadMetadata.tableInfo.logicalName)                         cache[leadMetadata.tableInfo.logicalName]                         = leadMetadata.privileges
    if (opportunityMetadata.tableInfo.logicalName)                  cache[opportunityMetadata.tableInfo.logicalName]                  = opportunityMetadata.privileges
    if (savedQueriesMetadata.tableInfo.logicalName)                 cache[savedQueriesMetadata.tableInfo.logicalName]                 = savedQueriesMetadata.privileges
    if (solutionComponentDefinitionMetadata.tableInfo.logicalName)  cache[solutionComponentDefinitionMetadata.tableInfo.logicalName]  = solutionComponentDefinitionMetadata.privileges
    if (solutionComponentMetadata.tableInfo.logicalName)            cache[solutionComponentMetadata.tableInfo.logicalName]            = solutionComponentMetadata.privileges
    if (solutionMetadata.tableInfo.logicalName)                     cache[solutionMetadata.tableInfo.logicalName]                     = solutionMetadata.privileges
    if (systemFormMetadata.tableInfo.logicalName)                   cache[systemFormMetadata.tableInfo.logicalName]                   = systemFormMetadata.privileges
    if (systemUserMetadata.tableInfo.logicalName)                   cache[systemUserMetadata.tableInfo.logicalName]                   = systemUserMetadata.privileges
    if (taskMetadata.tableInfo.logicalName)                         cache[taskMetadata.tableInfo.logicalName]                         = taskMetadata.privileges
    if (teamMetadata.tableInfo.logicalName)                         cache[teamMetadata.tableInfo.logicalName]                         = teamMetadata.privileges
    if (transactionCurrencyMetadata.tableInfo.logicalName)          cache[transactionCurrencyMetadata.tableInfo.logicalName]          = transactionCurrencyMetadata.privileges
    if (webresourceMetadata.tableInfo.logicalName)                  cache[webresourceMetadata.tableInfo.logicalName]                  = webresourceMetadata.privileges
    if (subscriptionMetadata.tableInfo.logicalName)                 cache[subscriptionMetadata.tableInfo.logicalName]                 = subscriptionMetadata.privileges
    return cache
  }, [
    aadUserMetadata.tableInfo, aadUserMetadata.privileges,
    accountMetadata.tableInfo, accountMetadata.privileges,
    appEventLogMetadata.tableInfo, appEventLogMetadata.privileges,
    appointmentMetadata.tableInfo, appointmentMetadata.privileges,
    auditMetadata.tableInfo, auditMetadata.privileges,
    businessUnitMetadata.tableInfo, businessUnitMetadata.privileges,
    configurationSettingMetadata.tableInfo, configurationSettingMetadata.privileges,
    contactMetadata.tableInfo, contactMetadata.privileges,
    customApiMetadata.tableInfo, customApiMetadata.privileges,
    customApiRequestParameterMetadata.tableInfo, customApiRequestParameterMetadata.privileges,
    customApiResponsePropertyMetadata.tableInfo, customApiResponsePropertyMetadata.privileges,
    emailMetadata.tableInfo, emailMetadata.privileges,
    entitiesMetadata.tableInfo, entitiesMetadata.privileges,
    environmentVariableDefinitionMetadata.tableInfo, environmentVariableDefinitionMetadata.privileges,
    environmentVariableValueMetadata.tableInfo, environmentVariableValueMetadata.privileges,
    leadMetadata.tableInfo, leadMetadata.privileges,
    opportunityMetadata.tableInfo, opportunityMetadata.privileges,
    savedQueriesMetadata.tableInfo, savedQueriesMetadata.privileges,
    solutionComponentDefinitionMetadata.tableInfo, solutionComponentDefinitionMetadata.privileges,
    solutionComponentMetadata.tableInfo, solutionComponentMetadata.privileges,
    solutionMetadata.tableInfo, solutionMetadata.privileges,
    systemFormMetadata.tableInfo, systemFormMetadata.privileges,
    systemUserMetadata.tableInfo, systemUserMetadata.privileges,
    taskMetadata.tableInfo, taskMetadata.privileges,
    teamMetadata.tableInfo, teamMetadata.privileges,
    transactionCurrencyMetadata.tableInfo, transactionCurrencyMetadata.privileges,
    webresourceMetadata.tableInfo, webresourceMetadata.privileges,
    subscriptionMetadata.tableInfo, subscriptionMetadata.privileges,
  ])

  return {
    metadataCache,
    tableInfoCache,
    columnsCache,
    oneToManyCache,
    manyToOneCache,
    manyToManyCache,
    privilegesCache,
    solutionsCache,
    aadUserMetadata, accountMetadata, appEventLogMetadata, appointmentMetadata, auditMetadata,
    businessUnitMetadata, configurationSettingMetadata, contactMetadata,
    customApiMetadata, customApiRequestParameterMetadata, customApiResponsePropertyMetadata,
    emailMetadata, entitiesMetadata, environmentVariableDefinitionMetadata, environmentVariableValueMetadata,
    leadMetadata, opportunityMetadata, savedQueriesMetadata,
    solutionComponentDefinitionMetadata, solutionComponentMetadata, solutionMetadata,
    systemFormMetadata, systemUserMetadata, taskMetadata, teamMetadata,
    transactionCurrencyMetadata, webresourceMetadata, subscriptionMetadata,
  }
}
