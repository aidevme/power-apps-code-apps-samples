// ---------------------------------------------------------------------------
// Platform / Power Apps context
// ---------------------------------------------------------------------------

/** Provides the current Power Apps host context (user, environment, locale). */
export { useContext } from './context-hooks/useContext'

// ---------------------------------------------------------------------------
// Dataverse — entity data hooks
// ---------------------------------------------------------------------------

/** Loads and manages Account records from Dataverse. */
export { useAccounts } from './dataverse-hooks/useAccounts'
/** Loads and manages AAD User records from the Dataverse aaduser virtual table. */
export { useAadUsers } from './dataverse-hooks/useAadUsers'
/** Loads and manages Appointment activity records from Dataverse. */
export { useAppointments } from './dataverse-hooks/useAppointments'
/** Loads and manages Business Unit records from Dataverse. */
export { useBusinessUnits } from './dataverse-hooks/useBusinessUnits'
/** Loads and manages Contact records from Dataverse. */
export { useContacts } from './dataverse-hooks/useContacts'
/** Loads and manages Email activity records from Dataverse. */
export { useEmails } from './dataverse-hooks/useEmails'
/** Loads and manages Lead records from Dataverse. */
export { useLeads } from './dataverse-hooks/useLeads'
/** Loads and manages Opportunity records from Dataverse. */
export { useOpportunities } from './dataverse-hooks/useOpportunities'
/** Loads and manages System User records from Dataverse. */
export { useSystemUsers } from './dataverse-hooks/useSystemUsers'
/** Loads and manages Task activity records from Dataverse. */
export { useTasks } from './dataverse-hooks/useTasks'
/** Loads and manages Team records from Dataverse. */
export { useTeams } from './dataverse-hooks/useTeams'
/** Loads and manages Transaction Currency records from Dataverse. */
export { useTransactionCurrencies } from './dataverse-hooks/useTransactionCurrencies'
/** Loads and manages Custom API records from Dataverse. */
export { useCustomApis } from './dataverse-hooks/useCustomApis'
export type { IUseCustomApisResult } from './dataverse-hooks/useCustomApis'
/** Loads Custom API Request Parameter records from Dataverse, optionally filtered by parent Custom API ID. */
export { useCustomApiRequestParameters } from './dataverse-hooks/useCustomApiRequestParameters'
export type { IUseCustomApiRequestParametersResult } from './dataverse-hooks/useCustomApiRequestParameters'
/** Loads Custom API Response Property records from Dataverse, optionally filtered by parent Custom API ID. */
export { useCustomApiResponseProperties } from './dataverse-hooks/useCustomApiResponseProperties'
export type { IUseCustomApiResponsePropertiesResult } from './dataverse-hooks/useCustomApiResponseProperties'
/** Loads and manages Workflow (process) records from Dataverse. */
export { useWorkflows, fetchWorkflowDetail } from './useWorkflows'

// ---------------------------------------------------------------------------
// Dataverse — metadata & configuration hooks
// ---------------------------------------------------------------------------

/** Provides the list of registered entity table collections and the entity registry. */
export { useEntities, REGISTERED_TABLE_COLLECTIONS } from './dataverse-hooks/useEntities'
/** Shared entity metadata field list, table-info interface, and derivation helper used by all metadata hooks. */
export type { IEntityTableInfo } from './metadata-hooks/entityMetadata.types'
export { ALL_ENTITY_METADATA_FIELDS } from './metadata-hooks/entityMetadata.types'
/** Fetches entity and column metadata for the AAD User table, including display names and required-field flags. */
export { useAadUserMetadata } from './metadata-hooks/useAadUserMetadata'
export type { IUseAadUserMetadataResult, IAadUserAttributeMetadata, IAadUserKeyMetadata, IAadUserOneToManyRelationship, IAadUserManyToManyRelationship, IAadUserPrivilege, AadUserPrivilegeType, IAadUserSolution } from './metadata-hooks/useAadUserMetadata'
/** Fetches entity and column metadata for the Account table, including display names and required-field flags. */
export { useAccountMetadata } from './metadata-hooks/useAccountMetadata'
export type { IUseAccountMetadataResult, IAccountAttributeMetadata } from './metadata-hooks/useAccountMetadata'
/** Fetches entity and column metadata for the BusinessUnit table, including display names and required-field flags. */
export { useBusinessUnitMetadata } from './metadata-hooks/useBusinessUnitMetadata'
export type { IUseBusinessUnitMetadataResult, IBusinessUnitAttributeMetadata, IBusinessUnitKeyMetadata, IBusinessUnitOneToManyRelationship, IBusinessUnitManyToManyRelationship, IBusinessUnitPrivilege, BusinessUnitPrivilegeType, IBusinessUnitSolution } from './metadata-hooks/useBusinessUnitMetadata'
/** Fetches entity and column metadata for the Custom API table, including display names and required-field flags. */
export { useCustomApiMetadata } from './metadata-hooks/useCustomApiMetadata'
export type { IUseCustomApiMetadataResult, ICustomApiAttributeMetadata, ICustomApiKeyMetadata, ICustomApiOneToManyRelationship, ICustomApiManyToManyRelationship, ICustomApiPrivilege, CustomApiPrivilegeType, ICustomApiSolution } from './metadata-hooks/useCustomApiMetadata'
/** Fetches entity and column metadata for the Custom API Request Parameter table, including display names and required-field flags. */
export { useCustomApiRequestParameterMetadata } from './metadata-hooks/useCustomApiRequestParameterMetadata'
export type { IUseCustomApiRequestParameterMetadataResult, ICustomApiRequestParameterAttributeMetadata, ICustomApiRequestParameterKeyMetadata, ICustomApiRequestParameterOneToManyRelationship, ICustomApiRequestParameterManyToManyRelationship, ICustomApiRequestParameterPrivilege, CustomApiRequestParameterPrivilegeType, ICustomApiRequestParameterSolution } from './metadata-hooks/useCustomApiRequestParameterMetadata'
/** Fetches entity and column metadata for the Custom API Response Property table, including display names and required-field flags. */
export { useCustomApiResponsePropertyMetadata } from './metadata-hooks/useCustomApiResponsePropertyMetadata'
export type { IUseCustomApiResponsePropertyMetadataResult, ICustomApiResponsePropertyAttributeMetadata, ICustomApiResponsePropertyKeyMetadata, ICustomApiResponsePropertyOneToManyRelationship, ICustomApiResponsePropertyManyToManyRelationship, ICustomApiResponsePropertyPrivilege, CustomApiResponsePropertyPrivilegeType, ICustomApiResponsePropertySolution } from './metadata-hooks/useCustomApiResponsePropertyMetadata'
/** Fetches entity and column metadata for the AppEventLog table, including display names and required-field flags. */
export { useAppEventLogMetadata } from './metadata-hooks/useAppEventLogMetadata'
export type { IUseAppEventLogMetadataResult, IAppEventLogAttributeMetadata, IAppEventLogKeyMetadata, IAppEventLogOneToManyRelationship, IAppEventLogManyToManyRelationship, IAppEventLogPrivilege, AppEventLogPrivilegeType, IAppEventLogSolution } from './metadata-hooks/useAppEventLogMetadata'
/** Fetches entity and column metadata for the Contact table, including display names and required-field flags. */
export { useContactMetadata } from './metadata-hooks/useContactMetadata'
export type { IUseContactMetadataResult, IContactAttributeMetadata } from './metadata-hooks/useContactMetadata'
/** Fetches entity and column metadata for the Task table, including display names and required-field flags. */
export { useTaskMetadata } from './metadata-hooks/useTaskMetadata'
export type { IUseTaskMetadataResult, ITaskAttributeMetadata, ITaskKeyMetadata, ITaskOneToManyRelationship, ITaskManyToManyRelationship, ITaskPrivilege, TaskPrivilegeType, ITaskSolution } from './metadata-hooks/useTaskMetadata'
/** Fetches entity and column metadata for the Opportunity table, including display names and required-field flags. */
export { useOpportunityMetadata } from './metadata-hooks/useOpportunityMetadata'
export type { IUseOpportunityMetadataResult, IOpportunityAttributeMetadata, IOpportunityKeyMetadata, IOpportunityOneToManyRelationship, IOpportunityManyToManyRelationship, IOpportunityPrivilege, OpportunityPrivilegeType, IOpportunitySolution } from './metadata-hooks/useOpportunityMetadata'
/** Fetches entity and column metadata for the Lead table, including display names and required-field flags. */
export { useLeadMetadata } from './metadata-hooks/useLeadMetadata'
export type { IUseLeadMetadataResult, ILeadAttributeMetadata, ILeadKeyMetadata, ILeadOneToManyRelationship, ILeadManyToManyRelationship, ILeadPrivilege, LeadPrivilegeType, ILeadSolution } from './metadata-hooks/useLeadMetadata'
/** Fetches entity and column metadata for the Appointment table, including display names and required-field flags. */
export { useAppointmentMetadata } from './metadata-hooks/useAppointmentMetadata'
export type { IUseAppointmentMetadataResult, IAppointmentAttributeMetadata, IAppointmentKeyMetadata, IAppointmentOneToManyRelationship, IAppointmentManyToManyRelationship, IAppointmentPrivilege, AppointmentPrivilegeType, IAppointmentSolution } from './metadata-hooks/useAppointmentMetadata'
/** Fetches entity and column metadata for the Email table, including display names and required-field flags. */
export { useEmailMetadata } from './metadata-hooks/useEmailMetadata'
export type { IUseEmailMetadataResult, IEmailAttributeMetadata, IEmailKeyMetadata, IEmailOneToManyRelationship, IEmailManyToManyRelationship, IEmailPrivilege, EmailPrivilegeType, IEmailSolution } from './metadata-hooks/useEmailMetadata'
/** Fetches entity and column metadata for the Entities table, including display names and required-field flags. */
export { useEntitiesMetadata } from './metadata-hooks/useEntitiesMetadata'
export type { IUseEntitiesMetadataResult, IEntitiesAttributeMetadata, IEntitiesKeyMetadata, IEntitiesOneToManyRelationship, IEntitiesManyToManyRelationship, IEntitiesPrivilege, EntitiesPrivilegeType, IEntitiesSolution } from './metadata-hooks/useEntitiesMetadata'
/** Fetches entity and column metadata for the SavedQueries table, including display names and required-field flags. */
export { useSavedQueriesMetadata } from './metadata-hooks/useSavedQueriesMetadata'
export type { IUseSavedQueriesMetadataResult, ISavedQueriesAttributeMetadata, ISavedQueriesKeyMetadata, ISavedQueriesOneToManyRelationship, ISavedQueriesManyToManyRelationship, ISavedQueriesPrivilege, SavedQueriesPrivilegeType, ISavedQueriesSolution } from './metadata-hooks/useSavedQueriesMetadata'
/** Fetches entity and column metadata for the Team table, including display names and required-field flags. */
export { useTeamMetadata } from './metadata-hooks/useTeamMetadata'
export type { IUseTeamMetadataResult, ITeamAttributeMetadata, ITeamKeyMetadata, ITeamOneToManyRelationship, ITeamManyToManyRelationship, ITeamPrivilege, TeamPrivilegeType, ITeamSolution } from './metadata-hooks/useTeamMetadata'
/** Fetches entity and column metadata for the SystemForm table, including display names and required-field flags. */
export { useSystemFormMetadata } from './metadata-hooks/useSystemFormMetadata'
export type { IUseSystemFormMetadataResult, ISystemFormAttributeMetadata, ISystemFormKeyMetadata, ISystemFormOneToManyRelationship, ISystemFormManyToManyRelationship, ISystemFormPrivilege, SystemFormPrivilegeType, ISystemFormSolution } from './metadata-hooks/useSystemFormMetadata'
/** Fetches entity and column metadata for the SystemUser table, including display names and required-field flags. */
export { useSystemUserMetadata } from './metadata-hooks/useSystemUserMetadata'
export type { IUseSystemUserMetadataResult, ISystemUserAttributeMetadata, ISystemUserKeyMetadata, ISystemUserOneToManyRelationship, ISystemUserManyToManyRelationship, ISystemUserPrivilege, SystemUserPrivilegeType, ISystemUserSolution } from './metadata-hooks/useSystemUserMetadata'
/** Fetches entity and column metadata for the aidevme_codeappssamplesconfigurationsettings table, including display names and required-field flags. */
export { useConfigurationSettingMetadata } from './metadata-hooks/useConfigurationSettingMetadata'
export type { IUseConfigurationSettingMetadataResult, IConfigurationSettingAttributeMetadata, IConfigurationSettingKeyMetadata, IConfigurationSettingOneToManyRelationship, IConfigurationSettingManyToManyRelationship, IConfigurationSettingPrivilege, ConfigurationSettingPrivilegeType, IConfigurationSettingSolution } from './metadata-hooks/useConfigurationSettingMetadata'
/** Fetches entity and column metadata for the TransactionCurrency table, including display names and required-field flags. */
export { useTransactionCurrencyMetadata } from './metadata-hooks/useTransactionCurrencyMetadata'
export type { IUseTransactionCurrencyMetadataResult, ITransactionCurrencyAttributeMetadata, ITransactionCurrencyKeyMetadata, ITransactionCurrencyOneToManyRelationship, ITransactionCurrencyManyToManyRelationship, ITransactionCurrencyPrivilege, TransactionCurrencyPrivilegeType, ITransactionCurrencySolution } from './metadata-hooks/useTransactionCurrencyMetadata'
/** Fetches entity and column metadata for the EnvironmentVariableDefinition table, including display names and required-field flags. */
export { useEnvironmentVariableDefinitionMetadata } from './metadata-hooks/useEnvironmentVariableDefinitionMetadata'
export type { IUseEnvironmentVariableDefinitionMetadataResult, IEnvironmentVariableDefinitionAttributeMetadata, IEnvironmentVariableDefinitionKeyMetadata, IEnvironmentVariableDefinitionOneToManyRelationship, IEnvironmentVariableDefinitionManyToManyRelationship, IEnvironmentVariableDefinitionPrivilege, EnvironmentVariableDefinitionPrivilegeType, IEnvironmentVariableDefinitionSolution } from './metadata-hooks/useEnvironmentVariableDefinitionMetadata'
/** Fetches entity and column metadata for the EnvironmentVariableValue table, including display names and required-field flags. */
export { useEnvironmentVariableValueMetadata } from './metadata-hooks/useEnvironmentVariableValueMetadata'
export type { IUseEnvironmentVariableValueMetadataResult, IEnvironmentVariableValueAttributeMetadata, IEnvironmentVariableValueKeyMetadata, IEnvironmentVariableValueOneToManyRelationship, IEnvironmentVariableValueManyToManyRelationship, IEnvironmentVariableValuePrivilege, EnvironmentVariableValuePrivilegeType, IEnvironmentVariableValueSolution } from './metadata-hooks/useEnvironmentVariableValueMetadata'
/** Fetches entity and column metadata for the Webresource table, including display names and required-field flags. */
export { useWebresourceMetadata } from './metadata-hooks/useWebresourceMetadata'
export type { IUseWebresourceMetadataResult, IWebresourceAttributeMetadata, IWebresourceKeyMetadata, IWebresourceOneToManyRelationship, IWebresourceManyToManyRelationship, IWebresourcePrivilege, WebresourcePrivilegeType, IWebresourceSolution } from './metadata-hooks/useWebresourceMetadata'
/** Fetches entity and column metadata for the Solution table, including display names and required-field flags. */
export { useSolutionMetadata } from './metadata-hooks/useSolutionMetadata'
export type { IUseSolutionMetadataResult, ISolutionAttributeMetadata, ISolutionKeyMetadata, ISolutionOneToManyRelationship, ISolutionManyToManyRelationship, ISolutionPrivilege, SolutionPrivilegeType, ISolutionSolution } from './metadata-hooks/useSolutionMetadata'
/** Fetches entity and column metadata for the SolutionComponent table, including display names and required-field flags. */
export { useSolutionComponentMetadata } from './metadata-hooks/useSolutionComponentMetadata'
export type { IUseSolutionComponentMetadataResult, ISolutionComponentAttributeMetadata, ISolutionComponentKeyMetadata, ISolutionComponentOneToManyRelationship, ISolutionComponentManyToManyRelationship, ISolutionComponentPrivilege, SolutionComponentPrivilegeType, ISolutionComponentSolution } from './metadata-hooks/useSolutionComponentMetadata'
/** Fetches entity and column metadata for the SolutionComponentDefinition table, including display names and required-field flags. */
export { useSolutionComponentDefinitionMetadata } from './metadata-hooks/useSolutionComponentDefinitionMetadata'
export type { IUseSolutionComponentDefinitionMetadataResult, ISolutionComponentDefinitionAttributeMetadata, ISolutionComponentDefinitionKeyMetadata, ISolutionComponentDefinitionOneToManyRelationship, ISolutionComponentDefinitionManyToManyRelationship, ISolutionComponentDefinitionPrivilege, SolutionComponentDefinitionPrivilegeType, ISolutionComponentDefinitionSolution } from './metadata-hooks/useSolutionComponentDefinitionMetadata'
/** Fetches entity and column metadata for the Audit table, including display names and required-field flags. */
export { useAuditMetadata } from './metadata-hooks/useAuditMetadata'
export type { IUseAuditMetadataResult, IAuditAttributeMetadata, IAuditKeyMetadata, IAuditOneToManyRelationship, IAuditManyToManyRelationship, IAuditPrivilege, AuditPrivilegeType, IAuditSolution } from './metadata-hooks/useAuditMetadata'
/** Resolves a Dataverse lookup reference to its display name and entity type. */
export { useLookupResolver } from './dataverse-hooks/useLookupResolver'
/** Loads saved queries (public views) for a given entity type. */
export { useSavedQueries } from './dataverse-hooks/useSavedQueries'
export type { IUseSavedQueriesResult } from './dataverse-hooks/useSavedQueries'
/** Loads system forms, optionally scoped to a specific entity. */
export { useSystemForms } from './dataverse-hooks/useSystemForms'
export type { IUseSystemFormsResult } from './dataverse-hooks/useSystemForms'
/** Loads the current user's personal settings (language, timezone, etc.). */
export { useUserSettings } from './dataverse-hooks/useUserSettings'
export type { IUseUserSettingsResult } from './dataverse-hooks/useUserSettings'

// ---------------------------------------------------------------------------
// Dataverse — environment variable hooks
// ---------------------------------------------------------------------------

/** Loads a single environment variable definition and its current value. */
export { useEnvironmentVariable } from './useEnvironmentVariable'
/** Loads all environment variable definitions and their current values. */
export { useEnvironmentVariables } from './useEnvironmentVariables'

// ---------------------------------------------------------------------------
// Application utility hooks
// ---------------------------------------------------------------------------

/** Loads and manages App Event Log records for diagnostics and auditing. */
export { useAppEventLogs } from './dataverse-hooks/useAppEventLogs'
/** Loads active Code Apps sample configuration settings from Dataverse, ordered by key. */
export { useConfigurationSettings } from './dataverse-hooks/useConfigurationSettings'
export type { IUseConfigurationSettingsResult } from './dataverse-hooks/useConfigurationSettings'
/** Fetches and parses the sample README markdown for display in the documentation view. */
export { useReadme } from './component-hooks/useReadme'

// ---------------------------------------------------------------------------
// Component-scoped hooks
// ---------------------------------------------------------------------------

/** Provides computed display values for the Footer component. */
export { useFooter } from './component-hooks/header-footer/useFooter'
export type { IUseFooterResult } from './component-hooks/header-footer/useFooter'
/** Provides route-derived display state for the Header component. */
export { useHeader } from './component-hooks/header-footer/useHeader'
export type { IUseHeaderResult } from './component-hooks/header-footer/useHeader'
/** Manages Shiki syntax-highlighting state and clipboard ops for the SyntaxHighlighter component. */
export { useSyntaxHighlighter } from './component-hooks/syntax-highlighter/useSyntaxHighlighter'
export type { IUseSyntaxHighlighterResult } from './component-hooks/syntax-highlighter/useSyntaxHighlighter'
/** Manages entity selection, all Dataverse entity hooks, lookup resolution, and record-open callbacks for the CRUDApp component. */
export { useCRUDApp } from './component-hooks/apps/useCRUDApp'
export type { IUseCRUDAppResult } from './component-hooks/apps/useCRUDApp'
