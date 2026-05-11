// ---------------------------------------------------------------------------
// Platform / Power Apps context
// ---------------------------------------------------------------------------

/** Provides the current Power Apps host context (user, environment, locale). */
export { useContext } from './useContext'

// ---------------------------------------------------------------------------
// Dataverse — entity data hooks
// ---------------------------------------------------------------------------

/** Loads and manages Account records from Dataverse. */
export { useAccounts } from './useAccounts'
/** Loads and manages AAD User records from the Dataverse aaduser virtual table. */
export { useAadUsers } from './useAadUsers'
/** Loads and manages Appointment activity records from Dataverse. */
export { useAppointments } from './useAppointments'
/** Loads and manages Business Unit records from Dataverse. */
export { useBusinessUnits } from './useBusinessUnits'
/** Loads and manages Contact records from Dataverse. */
export { useContacts } from './useContacts'
/** Loads and manages Email activity records from Dataverse. */
export { useEmails } from './useEmails'
/** Loads and manages Lead records from Dataverse. */
export { useLeads } from './useLeads'
/** Loads and manages Opportunity records from Dataverse. */
export { useOpportunities } from './useOpportunities'
/** Loads and manages System User records from Dataverse. */
export { useSystemUsers } from './useSystemUsers'
/** Loads and manages Task activity records from Dataverse. */
export { useTasks } from './useTasks'
/** Loads and manages Team records from Dataverse. */
export { useTeams } from './useTeams'
/** Loads and manages Transaction Currency records from Dataverse. */
export { useTransactionCurrencies } from './useTransactionCurrencies'
/** Loads and manages Workflow (process) records from Dataverse. */
export { useWorkflows, fetchWorkflowDetail } from './useWorkflows'

// ---------------------------------------------------------------------------
// Dataverse — metadata & configuration hooks
// ---------------------------------------------------------------------------

/** Provides the list of registered entity table collections and the entity registry. */
export { useEntities, REGISTERED_TABLE_COLLECTIONS } from './useEntities'
/** Shared entity metadata field list, table-info interface, and derivation helper used by all metadata hooks. */
export type { IEntityTableInfo } from './metadata-hooks/entityMetadata.types'
export { ALL_ENTITY_METADATA_FIELDS } from './metadata-hooks/entityMetadata.types'
/** Fetches entity and column metadata for the AAD User table, including display names and required-field flags. */
export { useAadUserMetadata } from './metadata-hooks/useAadUserMetadata'
export type { IUseAadUserMetadataResult, IAadUserAttributeMetadata } from './metadata-hooks/useAadUserMetadata'
/** Fetches entity and column metadata for the Account table, including display names and required-field flags. */
export { useAccountMetadata } from './metadata-hooks/useAccountMetadata'
export type { IUseAccountMetadataResult, IAccountAttributeMetadata } from './metadata-hooks/useAccountMetadata'
/** Fetches entity and column metadata for the AppEventLog table, including display names and required-field flags. */
export { useAppEventLogMetadata } from './metadata-hooks/useAppEventLogMetadata'
export type { IUseAppEventLogMetadataResult, IAppEventLogAttributeMetadata } from './metadata-hooks/useAppEventLogMetadata'
/** Fetches entity and column metadata for the Contact table, including display names and required-field flags. */
export { useContactMetadata } from './metadata-hooks/useContactMetadata'
export type { IUseContactMetadataResult, IContactAttributeMetadata } from './metadata-hooks/useContactMetadata'
/** Fetches entity and column metadata for the Task table, including display names and required-field flags. */
export { useTaskMetadata } from './metadata-hooks/useTaskMetadata'
export type { IUseTaskMetadataResult, ITaskAttributeMetadata } from './metadata-hooks/useTaskMetadata'
/** Resolves a Dataverse lookup reference to its display name and entity type. */
export { useLookupResolver } from './useLookupResolver'
/** Loads saved queries (public views) for a given entity type. */
export { useSavedQueries } from './useSavedQueries'
export type { IUseSavedQueriesResult } from './useSavedQueries'
/** Loads system forms, optionally scoped to a specific entity. */
export { useSystemForms } from './useSystemForms'
export type { IUseSystemFormsResult } from './useSystemForms'
/** Loads the current user's personal settings (language, timezone, etc.). */
export { useUserSettings } from './useUserSettings'
export type { IUseUserSettingsResult } from './useUserSettings'

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
export { useAppEventLogs } from './useAppEventLogs'
/** Loads active Code Apps sample configuration settings from Dataverse, ordered by key. */
export { useConfigurationSettings } from './useConfigurationSettings'
export type { IUseConfigurationSettingsResult } from './useConfigurationSettings'
/** Fetches and parses the sample README markdown for display in the documentation view. */
export { useReadme } from './useReadme'

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
