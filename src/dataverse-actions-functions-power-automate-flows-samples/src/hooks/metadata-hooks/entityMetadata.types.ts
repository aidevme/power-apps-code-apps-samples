import type { EntityMetadata, GetEntityMetadataOptions } from '@microsoft/power-apps/data/metadata/dataverse'
import { getEntityClusterModeName, getOwnershipTypeName } from '@microsoft/power-apps/data/metadata/dataverse'

// ---------------------------------------------------------------------------
// Metadata field request list
// ---------------------------------------------------------------------------

/**
 * All EntityMetadata field names to request from `getMetadata`.
 * Pass this array as `{ metadata: ALL_ENTITY_METADATA_FIELDS }` to ensure every
 * {@link IEntityTableInfo} property is populated.
 */
export const ALL_ENTITY_METADATA_FIELDS = [
  'ActivityTypeMask',
  'AutoCreateAccessTeams',
  'AutoRouteToOwnerQueue',
  'CanBeInCustomEntityAssociation',
  'CanBeInManyToMany',
  'CanBePrimaryEntityInRelationship',
  'CanBeRelatedEntityInRelationship',
  'CanChangeHierarchicalRelationship',
  'CanChangeTrackingBeEnabled',
  'CanCreateAttributes',
  'CanCreateCharts',
  'CanCreateForms',
  'CanCreateViews',
  'CanEnableSyncToExternalSearchIndex',
  'CanModifyAdditionalSettings',
  'CanTriggerWorkflow',
  'ChangeTrackingEnabled',
  'ClusterMode',
  'CollectionSchemaName',
  'DataProviderId',
  'DataSourceId',
  'DaysSinceRecordLastModified',
  'Description',
  'DisplayCollectionName',
  'DisplayName',
  'EnforceStateTransitions',
  'EntityColor',
  'EntityHelpUrl',
  'EntityHelpUrlEnabled',
  'EntitySetName',
  'ExternalCollectionName',
  'HasActivities',
  'HasChanged',
  'HasFeedback',
  'HasNotes',
  'IconLargeName',
  'IconMediumName',
  'IconSmallName',
  'IconVectorName',
  'IntroducedVersion',
  'IsActivity',
  'IsActivityParty',
  'IsAIRUpdated',
  'IsAuditEnabled',
  'IsAvailableOffline',
  'IsBPFEntity',
  'IsBusinessProcessEnabled',
  'IsChildEntity',
  'IsConnectionsEnabled',
  'IsCustomEntity',
  'IsCustomizable',
  'IsDocumentManagementEnabled',
  'IsDocumentRecommendationsEnabled',
  'IsDuplicateDetectionEnabled',
  'IsEnabledForCharts',
  'IsEnabledForExternalChannels',
  'IsEnabledForTrace',
  'IsImportable',
  'IsInteractionCentricEnabled',
  'IsIntersect',
  'IsKnowledgeManagementEnabled',
  'IsLogicalEntity',
  'IsMailMergeEnabled',
  'IsManaged',
  'IsMappable',
  'IsMSTeamsIntegrationEnabled',
  'IsOfflineInMobileClient',
  'IsOneNoteIntegrationEnabled',
  'IsOptimisticConcurrencyEnabled',
  'IsPrivate',
  'IsQuickCreateEnabled',
  'IsReadingPaneEnabled',
  'IsReadOnlyInMobileClient',
  'IsRenameable',
  'IsSLAEnabled',
  'IsSolutionAware',
  'IsStateModelAware',
  'IsValidForAdvancedFind',
  'IsValidForQueue',
  'IsVisibleInMobile',
  'IsVisibleInMobileClient',
  'LogicalCollectionName',
  'LogicalName',
  'MetadataId',
  'MobileOfflineFilters',
  'ObjectTypeCode',
  'OwnershipType',
  'PrimaryIdAttribute',
  'PrimaryImageAttribute',
  'PrimaryNameAttribute',
  'ReportViewName',
  'SchemaName',
  'SyncToExternalSearchIndex',
  'TableType',
  'UsesBusinessDataLabelTable',
] as const satisfies NonNullable<GetEntityMetadataOptions['metadata']>

// ---------------------------------------------------------------------------
// IEntityTableInfo
// ---------------------------------------------------------------------------

/**
 * Comprehensive, camelCase, null-safe view of Dataverse {@link EntityMetadata}.
 * All properties are `null` while loading or on error.
 * Derived by {@link deriveTableInfo} from the raw `Partial<EntityMetadata>` returned by `getMetadata`.
 */
export interface IEntityTableInfo {
  /** Bitmask indicating which activity type this entity represents. */
  activityTypeMask: number | null
  /** Whether the table automatically creates access teams for new records. */
  autoCreateAccessTeams: boolean | null
  /** Whether records are automatically routed to the owner's default queue. */
  autoRouteToOwnerQueue: boolean | null
  /** Whether the table can be used in a custom entity N:N association. */
  canBeInCustomEntityAssociation: boolean | null
  /** Whether the table can participate in many-to-many relationships. */
  canBeInManyToMany: boolean | null
  /** Whether the table can be the primary entity in a relationship. */
  canBePrimaryEntityInRelationship: boolean | null
  /** Whether the table can be the related entity in a relationship. */
  canBeRelatedEntityInRelationship: boolean | null
  /** Whether the hierarchical relationship configuration can be changed. */
  canChangeHierarchicalRelationship: boolean | null
  /** Whether change tracking can be enabled on this table. */
  canChangeTrackingBeEnabled: boolean | null
  /** Whether new columns can be created on this table. */
  canCreateAttributes: boolean | null
  /** Whether charts can be created for this table. */
  canCreateCharts: boolean | null
  /** Whether forms can be created for this table. */
  canCreateForms: boolean | null
  /** Whether views can be created for this table. */
  canCreateViews: boolean | null
  /** Whether syncing to the external search index can be enabled. */
  canEnableSyncToExternalSearchIndex: boolean | null
  /** Whether additional settings can be modified on this table. */
  canModifyAdditionalSettings: boolean | null
  /** Whether workflows can be triggered by changes to this table. */
  canTriggerWorkflow: boolean | null
  /** Whether change tracking is currently enabled. */
  changeTrackingEnabled: boolean | null
  /** Storage cluster mode: `"Local"`, `"Partitioned"`, or `"Replicated"`. */
  clusterMode: string | null
  /** Schema name of the entity collection, e.g. `"Accounts"`. */
  collectionSchemaName: string | null
  /** ID of the external data provider (virtual entity). */
  dataProviderId: string | null
  /** ID of the external data source (virtual entity). */
  dataSourceId: string | null
  /** Days since the record was last modified, used for offline sync filtering. */
  daysSinceRecordLastModified: number | null
  /** User-localised description of the table. */
  description: string | null
  /** User-localised plural display name, e.g. `"Accounts"`. */
  displayCollectionName: string | null
  /** User-localised singular display name, e.g. `"Account"`. */
  displayName: string | null
  /** Whether state transitions are enforced (invalid transitions are blocked). */
  enforceStateTransitions: boolean | null
  /** RGB colour string used for the entity icon in model-driven apps. */
  entityColor: string | null
  /** URL for the entity's custom help page. */
  entityHelpUrl: string | null
  /** Whether the custom entity help URL is enabled. */
  entityHelpUrlEnabled: boolean | null
  /** OData entity set name used in API paths, e.g. `"accounts"`. */
  entitySetName: string | null
  /** External collection name for virtual entities. */
  externalCollectionName: string | null
  /** Whether this table has associated activity tables. */
  hasActivities: boolean | null
  /** Whether the metadata has changed since it was last retrieved. */
  hasChanged: boolean | null
  /** Whether the table supports feedback (ratings). */
  hasFeedback: boolean | null
  /** Whether the table supports notes (annotations). */
  hasNotes: boolean | null
  /** File name of the large (32×32) icon image. */
  iconLargeName: string | null
  /** File name of the medium (16×16) icon image. */
  iconMediumName: string | null
  /** File name of the small (16×16) icon image. */
  iconSmallName: string | null
  /** File name of the SVG vector icon. */
  iconVectorName: string | null
  /** Solution version when this table was introduced, e.g. `"5.0.0.0"`. */
  introducedVersion: string | null
  /** Whether this table is an activity table (e.g. Task, Email, Appointment). */
  isActivity: boolean | null
  /** Whether this table can be an activity party (e.g. recipient on an email). */
  isActivityParty: boolean | null
  /** Whether AIR (auto-save / inline edit) is enabled. */
  isAIRUpdated: boolean | null
  /** Whether auditing is enabled for this table. */
  isAuditEnabled: boolean | null
  /** Whether records from this table are available offline. */
  isAvailableOffline: boolean | null
  /** Whether this table is a Business Process Flow entity. */
  isBPFEntity: boolean | null
  /** Whether business process flows are enabled for this table. */
  isBusinessProcessEnabled: boolean | null
  /** Whether this is a child entity (owned by a parent entity). */
  isChildEntity: boolean | null
  /** Whether the Connections feature is enabled. */
  isConnectionsEnabled: boolean | null
  /** Whether this is a custom (user-created) entity. */
  isCustomEntity: boolean | null
  /** Whether the table definition can be customised. */
  isCustomizable: boolean | null
  /** Whether document management (SharePoint integration) is enabled. */
  isDocumentManagementEnabled: boolean | null
  /** Whether AI-based document recommendations are enabled. */
  isDocumentRecommendationsEnabled: boolean | null
  /** Whether duplicate detection rules are enabled. */
  isDuplicateDetectionEnabled: boolean | null
  /** Whether charts are enabled for this table. */
  isEnabledForCharts: boolean | null
  /** Whether the table is accessible via external channels. */
  isEnabledForExternalChannels: boolean | null
  /** Whether server-side tracing is enabled. */
  isEnabledForTrace: boolean | null
  /** Whether the table can be included in data imports. */
  isImportable: boolean | null
  /** Whether the interaction-centric (conversation) layout is enabled. */
  isInteractionCentricEnabled: boolean | null
  /** Whether this table is an intersect (junction) entity for N:N relationships. */
  isIntersect: boolean | null
  /** Whether Knowledge Management is enabled. */
  isKnowledgeManagementEnabled: boolean | null
  /** Whether this is a logical entity backed by multiple physical tables. */
  isLogicalEntity: boolean | null
  /** Whether Mail Merge is enabled. */
  isMailMergeEnabled: boolean | null
  /** Whether this table is part of a managed solution. */
  isManaged: boolean | null
  /** Whether the table supports field mapping (data maps). */
  isMappable: boolean | null
  /** Whether Microsoft Teams integration is enabled. */
  isMSTeamsIntegrationEnabled: boolean | null
  /** Whether records are available in the offline mobile client. */
  isOfflineInMobileClient: boolean | null
  /** Whether OneNote integration is enabled. */
  isOneNoteIntegrationEnabled: boolean | null
  /** Whether optimistic concurrency (ETag) is enforced. */
  isOptimisticConcurrencyEnabled: boolean | null
  /** Whether the table is private (not visible outside the solution). */
  isPrivate: boolean | null
  /** Whether quick-create forms are enabled. */
  isQuickCreateEnabled: boolean | null
  /** Whether the reading pane is enabled in views. */
  isReadingPaneEnabled: boolean | null
  /** Whether the table is read-only in the mobile client. */
  isReadOnlyInMobileClient: boolean | null
  /** Whether the table display name can be renamed. */
  isRenameable: boolean | null
  /** Whether Service Level Agreement (SLA) is enabled. */
  isSLAEnabled: boolean | null
  /** Whether the table is solution-aware (can be added to solutions). */
  isSolutionAware: boolean | null
  /** Whether the table uses a state model with enforced transitions. */
  isStateModelAware: boolean | null
  /** Whether the table appears in Advanced Find. */
  isValidForAdvancedFind: boolean | null
  /** Whether the table supports queues. */
  isValidForQueue: boolean | null
  /** Whether the table is visible in mobile (legacy Dynamics mobile). */
  isVisibleInMobile: boolean | null
  /** Whether the table is visible in the Power Apps mobile client. */
  isVisibleInMobileClient: boolean | null
  /** Logical name of the collection, e.g. `"accounts"`. */
  logicalCollectionName: string | null
  /** Logical (API) name of the table, e.g. `"account"`. */
  logicalName: string | null
  /** Unique identifier (GUID) of the metadata record. */
  metadataId: string | null
  /** OData FetchXML filter expression used for mobile offline sync. */
  mobileOfflineFilters: string | null
  /** Integer type code for the entity, e.g. `1` for Account. */
  objectTypeCode: number | null
  /** Ownership model: `"UserOwned"`, `"OrganizationOwned"`, `"TeamOwned"`, etc. */
  ownershipType: string | null
  /** Logical name of the primary key attribute, e.g. `"accountid"`. */
  primaryIdAttribute: string | null
  /** Logical name of the primary image attribute (entity image column). */
  primaryImageAttribute: string | null
  /** Logical name of the primary name attribute, e.g. `"name"`. */
  primaryNameAttribute: string | null
  /** Name of the filtered view used in SSRS reports. */
  reportViewName: string | null
  /** Schema (PascalCase) name of the table, e.g. `"Account"`. */
  schemaName: string | null
  /** Whether the table is synced to the external (Dataverse Search) index. */
  syncToExternalSearchIndex: boolean | null
  /** Table type: `"Standard"`, `"Elastic"`, `"Virtual"`, or `"Activity"`. */
  tableType: string | null
  /** Whether the table uses the business data label table for localisation. */
  usesBusinessDataLabelTable: boolean | null
}

// ---------------------------------------------------------------------------
// deriveTableInfo
// ---------------------------------------------------------------------------

/**
 * Derives a null-safe {@link IEntityTableInfo} from raw Dataverse entity metadata.
 * `BooleanManagedProperty` fields are unwrapped to their `.Value`.
 * `Label` fields are unwrapped to their `UserLocalizedLabel.Label`.
 * `ClusterMode` and `OwnershipType` enum keys are converted to human-readable strings.
 *
 * @param metadata Raw entity metadata from `getMetadata`, or `null` while loading / on error.
 * @returns A fully populated {@link IEntityTableInfo}; every property is `null` when absent.
 */
export function deriveTableInfo(metadata: Partial<EntityMetadata> | null): IEntityTableInfo {
  return {
    activityTypeMask:                    metadata?.ActivityTypeMask ?? null,
    autoCreateAccessTeams:               metadata?.AutoCreateAccessTeams ?? null,
    autoRouteToOwnerQueue:               metadata?.AutoRouteToOwnerQueue ?? null,
    canBeInCustomEntityAssociation:      metadata?.CanBeInCustomEntityAssociation?.Value ?? null,
    canBeInManyToMany:                   metadata?.CanBeInManyToMany?.Value ?? null,
    canBePrimaryEntityInRelationship:    metadata?.CanBePrimaryEntityInRelationship?.Value ?? null,
    canBeRelatedEntityInRelationship:    metadata?.CanBeRelatedEntityInRelationship?.Value ?? null,
    canChangeHierarchicalRelationship:   metadata?.CanChangeHierarchicalRelationship?.Value ?? null,
    canChangeTrackingBeEnabled:          metadata?.CanChangeTrackingBeEnabled?.Value ?? null,
    canCreateAttributes:                 metadata?.CanCreateAttributes?.Value ?? null,
    canCreateCharts:                     metadata?.CanCreateCharts?.Value ?? null,
    canCreateForms:                      metadata?.CanCreateForms?.Value ?? null,
    canCreateViews:                      metadata?.CanCreateViews?.Value ?? null,
    canEnableSyncToExternalSearchIndex:  metadata?.CanEnableSyncToExternalSearchIndex?.Value ?? null,
    canModifyAdditionalSettings:         metadata?.CanModifyAdditionalSettings?.Value ?? null,
    canTriggerWorkflow:                  metadata?.CanTriggerWorkflow ?? null,
    changeTrackingEnabled:               metadata?.ChangeTrackingEnabled ?? null,
    clusterMode:                         metadata?.ClusterMode != null ? getEntityClusterModeName(metadata.ClusterMode) : null,
    collectionSchemaName:                metadata?.CollectionSchemaName ?? null,
    dataProviderId:                      metadata?.DataProviderId ?? null,
    dataSourceId:                        metadata?.DataSourceId ?? null,
    daysSinceRecordLastModified:         metadata?.DaysSinceRecordLastModified ?? null,
    description:                         metadata?.Description?.UserLocalizedLabel?.Label ?? null,
    displayCollectionName:               metadata?.DisplayCollectionName?.UserLocalizedLabel?.Label ?? null,
    displayName:                         metadata?.DisplayName?.UserLocalizedLabel?.Label ?? null,
    enforceStateTransitions:             metadata?.EnforceStateTransitions ?? null,
    entityColor:                         metadata?.EntityColor ?? null,
    entityHelpUrl:                       metadata?.EntityHelpUrl ?? null,
    entityHelpUrlEnabled:                metadata?.EntityHelpUrlEnabled ?? null,
    entitySetName:                       metadata?.EntitySetName ?? null,
    externalCollectionName:              metadata?.ExternalCollectionName ?? null,
    hasActivities:                       metadata?.HasActivities ?? null,
    hasChanged:                          metadata?.HasChanged ?? null,
    hasFeedback:                         metadata?.HasFeedback ?? null,
    hasNotes:                            metadata?.HasNotes ?? null,
    iconLargeName:                       metadata?.IconLargeName ?? null,
    iconMediumName:                      metadata?.IconMediumName ?? null,
    iconSmallName:                       metadata?.IconSmallName ?? null,
    iconVectorName:                      metadata?.IconVectorName ?? null,
    introducedVersion:                   metadata?.IntroducedVersion ?? null,
    isActivity:                          metadata?.IsActivity ?? null,
    isActivityParty:                     metadata?.IsActivityParty ?? null,
    isAIRUpdated:                        metadata?.IsAIRUpdated ?? null,
    isAuditEnabled:                      metadata?.IsAuditEnabled?.Value ?? null,
    isAvailableOffline:                  metadata?.IsAvailableOffline ?? null,
    isBPFEntity:                         metadata?.IsBPFEntity ?? null,
    isBusinessProcessEnabled:            metadata?.IsBusinessProcessEnabled ?? null,
    isChildEntity:                       metadata?.IsChildEntity ?? null,
    isConnectionsEnabled:                metadata?.IsConnectionsEnabled?.Value ?? null,
    isCustomEntity:                      metadata?.IsCustomEntity ?? null,
    isCustomizable:                      metadata?.IsCustomizable?.Value ?? null,
    isDocumentManagementEnabled:         metadata?.IsDocumentManagementEnabled ?? null,
    isDocumentRecommendationsEnabled:    metadata?.IsDocumentRecommendationsEnabled ?? null,
    isDuplicateDetectionEnabled:         metadata?.IsDuplicateDetectionEnabled?.Value ?? null,
    isEnabledForCharts:                  metadata?.IsEnabledForCharts ?? null,
    isEnabledForExternalChannels:        metadata?.IsEnabledForExternalChannels ?? null,
    isEnabledForTrace:                   metadata?.IsEnabledForTrace ?? null,
    isImportable:                        metadata?.IsImportable ?? null,
    isInteractionCentricEnabled:         metadata?.IsInteractionCentricEnabled ?? null,
    isIntersect:                         metadata?.IsIntersect ?? null,
    isKnowledgeManagementEnabled:        metadata?.IsKnowledgeManagementEnabled ?? null,
    isLogicalEntity:                     metadata?.IsLogicalEntity ?? null,
    isMailMergeEnabled:                  metadata?.IsMailMergeEnabled?.Value ?? null,
    isManaged:                           metadata?.IsManaged ?? null,
    isMappable:                          metadata?.IsMappable?.Value ?? null,
    isMSTeamsIntegrationEnabled:         metadata?.IsMSTeamsIntegrationEnabled ?? null,
    isOfflineInMobileClient:             metadata?.IsOfflineInMobileClient?.Value ?? null,
    isOneNoteIntegrationEnabled:         metadata?.IsOneNoteIntegrationEnabled ?? null,
    isOptimisticConcurrencyEnabled:      metadata?.IsOptimisticConcurrencyEnabled ?? null,
    isPrivate:                           metadata?.IsPrivate ?? null,
    isQuickCreateEnabled:                metadata?.IsQuickCreateEnabled ?? null,
    isReadingPaneEnabled:                metadata?.IsReadingPaneEnabled ?? null,
    isReadOnlyInMobileClient:            metadata?.IsReadOnlyInMobileClient?.Value ?? null,
    isRenameable:                        metadata?.IsRenameable?.Value ?? null,
    isSLAEnabled:                        metadata?.IsSLAEnabled ?? null,
    isSolutionAware:                     metadata?.IsSolutionAware ?? null,
    isStateModelAware:                   metadata?.IsStateModelAware ?? null,
    isValidForAdvancedFind:              metadata?.IsValidForAdvancedFind ?? null,
    isValidForQueue:                     metadata?.IsValidForQueue?.Value ?? null,
    isVisibleInMobile:                   metadata?.IsVisibleInMobile?.Value ?? null,
    isVisibleInMobileClient:             metadata?.IsVisibleInMobileClient?.Value ?? null,
    logicalCollectionName:               metadata?.LogicalCollectionName ?? null,
    logicalName:                         metadata?.LogicalName ?? null,
    metadataId:                          metadata?.MetadataId ?? null,
    mobileOfflineFilters:                metadata?.MobileOfflineFilters ?? null,
    objectTypeCode:                      metadata?.ObjectTypeCode ?? null,
    ownershipType:                       metadata?.OwnershipType != null ? getOwnershipTypeName(metadata.OwnershipType) : null,
    primaryIdAttribute:                  metadata?.PrimaryIdAttribute ?? null,
    primaryImageAttribute:               metadata?.PrimaryImageAttribute ?? null,
    primaryNameAttribute:                metadata?.PrimaryNameAttribute ?? null,
    reportViewName:                      metadata?.ReportViewName ?? null,
    schemaName:                          metadata?.SchemaName ?? null,
    syncToExternalSearchIndex:           metadata?.SyncToExternalSearchIndex ?? null,
    tableType:                           metadata?.TableType ?? null,
    usesBusinessDataLabelTable:          metadata?.UsesBusinessDataLabelTable ?? null,
  }
}
