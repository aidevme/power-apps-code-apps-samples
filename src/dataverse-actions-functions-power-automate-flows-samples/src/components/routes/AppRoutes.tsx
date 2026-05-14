// AI-CONTEXT: Route configuration component — owns the full react-router-dom <Routes> tree for the app.
// AI-FILE-RELATIONS:
//   - consumer:  src/App.tsx (the only caller)
//   - route-map: src/tools/routes.ts (ROUTES constants)
//   - metadata:  src/components/apps/miscellaneous/metadata/EntityDetailsApp.tsx (IEntityDetailsAppProps)
// AI-CONSTRAINT: Never add hooks or business logic here — all data arrives via props from App.tsx.
// AI-PATTERN: Add new <Route> entries here; App.tsx stays clean as a layout-only composition shell.

import { Routes, Route } from 'react-router-dom'
import {
  MainApp, CRUDApp,
  DataverseFunctionsApp, DataverseActionsApp, DataverseCustomActionsApp, DataverseCustomAPIsApp,
  PowerAutomateFlowsApp, AzureSQLApp, AzureBlobStorageApp, AzureFunctionsApp, SharePointApp,
  EnvironmentVariablesApp, MicrosoftGraphApp, ConfigurationSettingsApp,
  ContentSecurityPolicyManagementApp, ERDDiagramApp, EntityDetailsApp,
  MetadataBrowserApp, EntityMetadataApp, DocumentationsApp,
} from '..'
import type { IEntityDetailsAppProps, IEntityMetadataCacheEntry } from '..'
import { ROUTES } from '../../tools'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for {@link AppRoutes}.
 *
 * @remarks
 * Extends {@link IEntityDetailsAppProps} (entities + all 27 entity-metadata results)
 * and adds the two extra props consumed by {@link CRUDApp} and {@link EntityMetadataApp}.
 */
export interface IAppRoutesProps extends IEntityDetailsAppProps {
  /** Whether the entity list is still loading. */
  entitiesLoading: boolean
  /** Pre-built cache of entity display names keyed by logical name. */
  metadataCache?: Record<string, IEntityMetadataCacheEntry>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders all client-side routes for the application.
 *
 * @remarks
 * Extracted from {@link App} to keep the root component focused on layout and session bootstrap.
 * All data flows down from `App.tsx` via {@link IAppRoutesProps}.
 * Add new `<Route>` entries here; never in `App.tsx`.
 *
 * @example
 * ```tsx
 * <AppRoutes
 *   entities={entities}
 *   entitiesLoading={entitiesLoading}
 *   metadataCache={metadataCache}
 *   accountMetadata={accountMetadata}
 *   {...rest of metadata props}
 * />
 * ```
 */
export function AppRoutes({
  entities, entitiesLoading, metadataCache,
  accountMetadata, aadUserMetadata, appEventLogMetadata, appointmentMetadata,
  auditMetadata, businessUnitMetadata, configurationSettingMetadata, contactMetadata,
  customApiMetadata, customApiRequestParameterMetadata, customApiResponsePropertyMetadata,
  emailMetadata, entitiesMetadata, environmentVariableDefinitionMetadata, environmentVariableValueMetadata,
  leadMetadata, opportunityMetadata, savedQueriesMetadata,
  solutionComponentDefinitionMetadata, solutionComponentMetadata, solutionMetadata,
  systemFormMetadata, systemUserMetadata, taskMetadata, teamMetadata,
  transactionCurrencyMetadata, webresourceMetadata,
}: IAppRoutesProps) {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<MainApp />} />
      <Route path={ROUTES.CRUD} element={<CRUDApp entities={entities} entitiesLoading={entitiesLoading} metadataCache={metadataCache} />} />
      <Route path={ROUTES.FUNCTIONS} element={<DataverseFunctionsApp />} />
      <Route path={ROUTES.ACTIONS} element={<DataverseActionsApp />} />
      <Route path={ROUTES.CUSTOM_ACTIONS} element={<DataverseCustomActionsApp />} />
      <Route path={ROUTES.CUSTOM_APIS} element={<DataverseCustomAPIsApp />} />
      <Route path={ROUTES.FLOWS} element={<PowerAutomateFlowsApp />} />
      <Route path={ROUTES.AZURE_SQL} element={<AzureSQLApp />} />
      <Route path={ROUTES.AZURE_BLOB_STORAGE} element={<AzureBlobStorageApp />} />
      <Route path={ROUTES.AZURE_FUNCTIONS} element={<AzureFunctionsApp />} />
      <Route path={ROUTES.SHAREPOINT} element={<SharePointApp />} />
      <Route path={ROUTES.ENV_VARIABLES} element={<EnvironmentVariablesApp />} />
      <Route path={ROUTES.GRAPH} element={<MicrosoftGraphApp />} />
      <Route path={ROUTES.CONFIG_SETTINGS} element={<ConfigurationSettingsApp />} />
      <Route path={ROUTES.CSP_MANAGEMENT} element={<ContentSecurityPolicyManagementApp />} />
      <Route path={ROUTES.ERD_DIAGRAM} element={<ERDDiagramApp />} />
      <Route path={ROUTES.ENTITY_DETAILS} element={<EntityDetailsApp
        entities={entities}
        accountMetadata={accountMetadata} aadUserMetadata={aadUserMetadata} appEventLogMetadata={appEventLogMetadata} appointmentMetadata={appointmentMetadata}
        auditMetadata={auditMetadata} businessUnitMetadata={businessUnitMetadata} configurationSettingMetadata={configurationSettingMetadata}
        contactMetadata={contactMetadata} customApiMetadata={customApiMetadata} customApiRequestParameterMetadata={customApiRequestParameterMetadata} customApiResponsePropertyMetadata={customApiResponsePropertyMetadata}
        emailMetadata={emailMetadata} entitiesMetadata={entitiesMetadata} environmentVariableDefinitionMetadata={environmentVariableDefinitionMetadata} environmentVariableValueMetadata={environmentVariableValueMetadata}
        leadMetadata={leadMetadata} opportunityMetadata={opportunityMetadata} savedQueriesMetadata={savedQueriesMetadata}
        solutionComponentDefinitionMetadata={solutionComponentDefinitionMetadata} solutionComponentMetadata={solutionComponentMetadata} solutionMetadata={solutionMetadata}
        systemFormMetadata={systemFormMetadata} systemUserMetadata={systemUserMetadata} taskMetadata={taskMetadata} teamMetadata={teamMetadata}
        transactionCurrencyMetadata={transactionCurrencyMetadata} webresourceMetadata={webresourceMetadata}
      />} />
      <Route path={ROUTES.METADATA} element={<MetadataBrowserApp />} />
      <Route path={ROUTES.ENTITY_METADATA} element={<EntityMetadataApp metadataCache={metadataCache} />} />
      <Route path={ROUTES.DOCS} element={<DocumentationsApp />} />
    </Routes>
  )
}
