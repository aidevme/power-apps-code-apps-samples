// AI-CONTEXT: Tabbed metadata viewer — wires hook data to MetadataTables presentation components.
// AI-FILE-RELATIONS:
//   - tables:   src/components/tables/metadata/MetadataTables.tsx (all table components)
//   - hooks:    src/hooks/index.ts (metadata hook result interfaces)
// AI-CONSTRAINT: No sort state, handlers, or derived arrays here — all that lives inside MetadataTables.
// AI-PATTERN: Each tab block either renders a table component or a placeholder; never inline table JSX.

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Tab, TabList, Text, makeStyles, tokens,
} from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'
import { Notes } from '../../../misc/notes/Notes'
import type { NoteType } from '../../../misc/notes/Notes'
import type { EntitiesModel } from '../../../../generated'
import type {
  IUseAadUserMetadataResult, IUseAccountMetadataResult, IUseAppEventLogMetadataResult,
  IUseAppointmentMetadataResult, IUseAuditMetadataResult, IUseBusinessUnitMetadataResult,
  IUseConfigurationSettingMetadataResult, IUseContactMetadataResult,
  IUseCustomApiMetadataResult, IUseCustomApiRequestParameterMetadataResult, IUseCustomApiResponsePropertyMetadataResult,
  IUseEmailMetadataResult, IUseEntitiesMetadataResult,
  IUseEnvironmentVariableDefinitionMetadataResult, IUseEnvironmentVariableValueMetadataResult,
  IUseLeadMetadataResult, IUseOpportunityMetadataResult, IUseSavedQueriesMetadataResult,
  IUseSolutionComponentDefinitionMetadataResult, IUseSolutionComponentMetadataResult, IUseSolutionMetadataResult,
  IUseSystemFormMetadataResult, IUseSystemUserMetadataResult, IUseTaskMetadataResult,
  IUseTeamMetadataResult, IUseTransactionCurrencyMetadataResult, IUseWebresourceMetadataResult,
} from '../../../../hooks'
import {
  MetadataTableInfoTable,
  MetadataColumnsTable,
  MetadataKeysTable,
  MetadataRelationshipTable,
  MetadataManyToManyTable,
  MetadataPrivilegesTable,
  MetadataSolutionsTable,
} from '../../../tables/metadata/MetadataTables'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENTITY_DETAILS_APP_NOTE_TYPE: NoteType = 'info'
const ENTITY_DETAILS_APP_INFO_LABEL_TEXT =
  'Metadata is fetched from the Dataverse EntityDefinitions endpoint (/api/data/v9.2/EntityDefinitions). ' +
  'Field details are resolved via the Attributes collection on the entity definition.'
const ENTITY_DETAILS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The tab identifiers available in {@link EntityDetailsApp}. */
type EntityDetailsTabValue =
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

const useEntityDetailsAppStyles = makeStyles({
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
})

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for {@link EntityDetailsApp}. */
export interface IEntityDetailsAppProps {
  /** Entity metadata records used to resolve the display name from the `?entity` query parameter. */
  entities: EntitiesModel.Entities[]
  /** Metadata result for the Account table (`"account"`). */
  accountMetadata: IUseAccountMetadataResult
  /** Metadata result for the AadUser table (`"aaduser"`). */
  aadUserMetadata: IUseAadUserMetadataResult
  /** Metadata result for the AppEventLog table (`"aidevme_appeventlog"`). */
  appEventLogMetadata: IUseAppEventLogMetadataResult
  /** Metadata result for the Appointment table (`"appointment"`). */
  appointmentMetadata: IUseAppointmentMetadataResult
  /** Metadata result for the Audit table (`"audit"`). */
  auditMetadata: IUseAuditMetadataResult
  /** Metadata result for the BusinessUnit table (`"businessunit"`). */
  businessUnitMetadata: IUseBusinessUnitMetadataResult
  /** Metadata result for the ConfigurationSetting table (`"aidevme_codeappssamplesconfigurationsetting"`). */
  configurationSettingMetadata: IUseConfigurationSettingMetadataResult
  /** Metadata result for the Contact table (`"contact"`). */
  contactMetadata: IUseContactMetadataResult
  /** Metadata result for the CustomApi table (`"customapi"`). */
  customApiMetadata: IUseCustomApiMetadataResult
  /** Metadata result for the CustomApiRequestParameter table (`"customapirequestparameter"`). */
  customApiRequestParameterMetadata: IUseCustomApiRequestParameterMetadataResult
  /** Metadata result for the CustomApiResponseProperty table (`"customapiresponseproperty"`). */
  customApiResponsePropertyMetadata: IUseCustomApiResponsePropertyMetadataResult
  /** Metadata result for the Email table (`"email"`). */
  emailMetadata: IUseEmailMetadataResult
  /** Metadata result for the Entities virtual table (`"entity"`). */
  entitiesMetadata: IUseEntitiesMetadataResult
  /** Metadata result for the EnvironmentVariableDefinition table (`"environmentvariabledefinition"`). */
  environmentVariableDefinitionMetadata: IUseEnvironmentVariableDefinitionMetadataResult
  /** Metadata result for the EnvironmentVariableValue table (`"environmentvariablevalue"`). */
  environmentVariableValueMetadata: IUseEnvironmentVariableValueMetadataResult
  /** Metadata result for the Lead table (`"lead"`). */
  leadMetadata: IUseLeadMetadataResult
  /** Metadata result for the Opportunity table (`"opportunity"`). */
  opportunityMetadata: IUseOpportunityMetadataResult
  /** Metadata result for the SavedQueries table (`"savedquery"`). */
  savedQueriesMetadata: IUseSavedQueriesMetadataResult
  /** Metadata result for the SolutionComponentDefinition table (`"solutioncomponentdefinition"`). */
  solutionComponentDefinitionMetadata: IUseSolutionComponentDefinitionMetadataResult
  /** Metadata result for the SolutionComponent table (`"solutioncomponent"`). */
  solutionComponentMetadata: IUseSolutionComponentMetadataResult
  /** Metadata result for the Solution table (`"solution"`). */
  solutionMetadata: IUseSolutionMetadataResult
  /** Metadata result for the SystemForm table (`"systemform"`). */
  systemFormMetadata: IUseSystemFormMetadataResult
  /** Metadata result for the SystemUser table (`"systemuser"`). */
  systemUserMetadata: IUseSystemUserMetadataResult
  /** Metadata result for the Task table (`"task"`). */
  taskMetadata: IUseTaskMetadataResult
  /** Metadata result for the Team table (`"team"`). */
  teamMetadata: IUseTeamMetadataResult
  /** Metadata result for the TransactionCurrency table (`"transactioncurrency"`). */
  transactionCurrencyMetadata: IUseTransactionCurrencyMetadataResult
  /** Metadata result for the Webresource table (`"webresource"`). */
  webresourceMetadata: IUseWebresourceMetadataResult
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Displays the schema and metadata details for a selected Dataverse table.
 *
 * Reads the `?entity` query parameter set by {@link CRUDApp} when the user
 * opens entity options and selects "Show entity details". Organises metadata
 * into tabs: Table, Columns, Keys, OneToManyRelationships,
 * ManyToOneRelationships, ManyToManyRelationships, Privileges, and Solutions.
 *
 * @example
 * ```tsx
 * <EntityDetailsApp entities={entities} />
 * ```
 */
export function EntityDetailsApp({
  entities,
  accountMetadata, aadUserMetadata, appEventLogMetadata, appointmentMetadata,
  auditMetadata, businessUnitMetadata, configurationSettingMetadata, contactMetadata,
  customApiMetadata, customApiRequestParameterMetadata, customApiResponsePropertyMetadata,
  emailMetadata, entitiesMetadata, environmentVariableDefinitionMetadata, environmentVariableValueMetadata,
  leadMetadata, opportunityMetadata, savedQueriesMetadata,
  solutionComponentDefinitionMetadata, solutionComponentMetadata, solutionMetadata,
  systemFormMetadata, systemUserMetadata, taskMetadata, teamMetadata,
  transactionCurrencyMetadata, webresourceMetadata,
}: IEntityDetailsAppProps) {
  const styles = useEntityDetailsAppStyles()
  const [searchParams] = useSearchParams()
  const [selectedTab, setSelectedTab] = useState<EntityDetailsTabValue>('table')

  const entityLogicalName = searchParams.get('entity')
  const match = entities.find(e => e.logicalname === entityLogicalName)
  const displayName = match?.name ?? entityLogicalName

  // AI-CONTEXT: Each result object is null when the entity is not supported by any loaded hook.
  // AI-PATTERN: Add new metadata hooks here (and in all result chains below) when extending to new entities.
  const tableMetadataResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           tableInfo: accountMetadata.tableInfo }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            tableInfo: aadUserMetadata.tableInfo }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        tableInfo: appEventLogMetadata.tableInfo }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        tableInfo: appointmentMetadata.tableInfo }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              tableInfo: auditMetadata.tableInfo }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       tableInfo: businessUnitMetadata.tableInfo }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            tableInfo: configurationSettingMetadata.tableInfo }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           tableInfo: contactMetadata.tableInfo }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          tableInfo: customApiMetadata.tableInfo }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          tableInfo: customApiRequestParameterMetadata.tableInfo }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          tableInfo: customApiResponsePropertyMetadata.tableInfo }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              tableInfo: emailMetadata.tableInfo }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           tableInfo: entitiesMetadata.tableInfo }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      tableInfo: environmentVariableDefinitionMetadata.tableInfo }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           tableInfo: environmentVariableValueMetadata.tableInfo }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               tableInfo: leadMetadata.tableInfo }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        tableInfo: opportunityMetadata.tableInfo }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       tableInfo: savedQueriesMetadata.tableInfo }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        tableInfo: solutionComponentDefinitionMetadata.tableInfo }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  tableInfo: solutionComponentMetadata.tableInfo }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           tableInfo: solutionMetadata.tableInfo }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         tableInfo: systemFormMetadata.tableInfo }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         tableInfo: systemUserMetadata.tableInfo }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               tableInfo: taskMetadata.tableInfo }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               tableInfo: teamMetadata.tableInfo }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                tableInfo: transactionCurrencyMetadata.tableInfo }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        tableInfo: webresourceMetadata.tableInfo }
    : null

  const columnsMetadataResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           attributes: accountMetadata.attributes }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            attributes: aadUserMetadata.attributes }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        attributes: appEventLogMetadata.attributes }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        attributes: appointmentMetadata.attributes }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              attributes: auditMetadata.attributes }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       attributes: businessUnitMetadata.attributes }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            attributes: configurationSettingMetadata.attributes }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           attributes: contactMetadata.attributes }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          attributes: customApiMetadata.attributes }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          attributes: customApiRequestParameterMetadata.attributes }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          attributes: customApiResponsePropertyMetadata.attributes }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              attributes: emailMetadata.attributes }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           attributes: entitiesMetadata.attributes }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      attributes: environmentVariableDefinitionMetadata.attributes }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           attributes: environmentVariableValueMetadata.attributes }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               attributes: leadMetadata.attributes }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        attributes: opportunityMetadata.attributes }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       attributes: savedQueriesMetadata.attributes }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        attributes: solutionComponentDefinitionMetadata.attributes }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  attributes: solutionComponentMetadata.attributes }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           attributes: solutionMetadata.attributes }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         attributes: systemFormMetadata.attributes }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         attributes: systemUserMetadata.attributes }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               attributes: taskMetadata.attributes }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               attributes: teamMetadata.attributes }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                attributes: transactionCurrencyMetadata.attributes }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        attributes: webresourceMetadata.attributes }
    : null

  // AI-CONTEXT: All 27 metadata hooks expose `privileges`.
  const privilegesMetadataResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           privileges: accountMetadata.privileges }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            privileges: aadUserMetadata.privileges }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        privileges: appEventLogMetadata.privileges }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        privileges: appointmentMetadata.privileges }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              privileges: auditMetadata.privileges }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       privileges: businessUnitMetadata.privileges }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            privileges: configurationSettingMetadata.privileges }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           privileges: contactMetadata.privileges }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          privileges: customApiMetadata.privileges }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          privileges: customApiRequestParameterMetadata.privileges }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          privileges: customApiResponsePropertyMetadata.privileges }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              privileges: emailMetadata.privileges }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           privileges: entitiesMetadata.privileges }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      privileges: environmentVariableDefinitionMetadata.privileges }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           privileges: environmentVariableValueMetadata.privileges }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               privileges: leadMetadata.privileges }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        privileges: opportunityMetadata.privileges }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       privileges: savedQueriesMetadata.privileges }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        privileges: solutionComponentDefinitionMetadata.privileges }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  privileges: solutionComponentMetadata.privileges }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           privileges: solutionMetadata.privileges }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         privileges: systemFormMetadata.privileges }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         privileges: systemUserMetadata.privileges }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               privileges: taskMetadata.privileges }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               privileges: teamMetadata.privileges }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                privileges: transactionCurrencyMetadata.privileges }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        privileges: webresourceMetadata.privileges }
    : null

  // AI-CONTEXT: All 27 metadata hooks expose `solutions`, `solutionsLoading`, and `solutionsError`.
  const solutionsMetadataResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.solutionsLoading,                           error: accountMetadata.solutionsError,                           solutions: accountMetadata.solutions }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.solutionsLoading,                            error: aadUserMetadata.solutionsError,                            solutions: aadUserMetadata.solutions }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.solutionsLoading,                        error: appEventLogMetadata.solutionsError,                        solutions: appEventLogMetadata.solutions }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.solutionsLoading,                        error: appointmentMetadata.solutionsError,                        solutions: appointmentMetadata.solutions }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.solutionsLoading,                              error: auditMetadata.solutionsError,                              solutions: auditMetadata.solutions }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.solutionsLoading,                       error: businessUnitMetadata.solutionsError,                       solutions: businessUnitMetadata.solutions }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.solutionsLoading,            error: configurationSettingMetadata.solutionsError,               solutions: configurationSettingMetadata.solutions }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.solutionsLoading,                           error: contactMetadata.solutionsError,                           solutions: contactMetadata.solutions }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.solutionsLoading,                          error: customApiMetadata.solutionsError,                          solutions: customApiMetadata.solutions }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.solutionsLoading,          error: customApiRequestParameterMetadata.solutionsError,          solutions: customApiRequestParameterMetadata.solutions }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.solutionsLoading,          error: customApiResponsePropertyMetadata.solutionsError,          solutions: customApiResponsePropertyMetadata.solutions }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.solutionsLoading,                              error: emailMetadata.solutionsError,                              solutions: emailMetadata.solutions }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.solutionsLoading,                           error: entitiesMetadata.solutionsError,                           solutions: entitiesMetadata.solutions }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.solutionsLoading,      error: environmentVariableDefinitionMetadata.solutionsError,      solutions: environmentVariableDefinitionMetadata.solutions }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.solutionsLoading,           error: environmentVariableValueMetadata.solutionsError,           solutions: environmentVariableValueMetadata.solutions }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.solutionsLoading,                               error: leadMetadata.solutionsError,                               solutions: leadMetadata.solutions }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.solutionsLoading,                        error: opportunityMetadata.solutionsError,                        solutions: opportunityMetadata.solutions }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.solutionsLoading,                       error: savedQueriesMetadata.solutionsError,                       solutions: savedQueriesMetadata.solutions }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.solutionsLoading,        error: solutionComponentDefinitionMetadata.solutionsError,        solutions: solutionComponentDefinitionMetadata.solutions }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.solutionsLoading,                  error: solutionComponentMetadata.solutionsError,                  solutions: solutionComponentMetadata.solutions }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.solutionsLoading,                           error: solutionMetadata.solutionsError,                           solutions: solutionMetadata.solutions }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.solutionsLoading,                         error: systemFormMetadata.solutionsError,                         solutions: systemFormMetadata.solutions }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.solutionsLoading,                         error: systemUserMetadata.solutionsError,                         solutions: systemUserMetadata.solutions }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.solutionsLoading,                               error: taskMetadata.solutionsError,                               solutions: taskMetadata.solutions }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.solutionsLoading,                               error: teamMetadata.solutionsError,                               solutions: teamMetadata.solutions }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.solutionsLoading,                error: transactionCurrencyMetadata.solutionsError,                solutions: transactionCurrencyMetadata.solutions }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.solutionsLoading,                        error: webresourceMetadata.solutionsError,                        solutions: webresourceMetadata.solutions }
    : null

  // AI-CONTEXT: All 27 metadata hooks expose `keyMetadata` (primaryIdAttribute, primaryNameAttribute, primaryKey).
  const keyMetadataResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           ...accountMetadata.keyMetadata }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            ...aadUserMetadata.keyMetadata }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        ...appEventLogMetadata.keyMetadata }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        ...appointmentMetadata.keyMetadata }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              ...auditMetadata.keyMetadata }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       ...businessUnitMetadata.keyMetadata }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            ...configurationSettingMetadata.keyMetadata }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           ...contactMetadata.keyMetadata }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          ...customApiMetadata.keyMetadata }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          ...customApiRequestParameterMetadata.keyMetadata }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          ...customApiResponsePropertyMetadata.keyMetadata }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              ...emailMetadata.keyMetadata }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           ...entitiesMetadata.keyMetadata }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      ...environmentVariableDefinitionMetadata.keyMetadata }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           ...environmentVariableValueMetadata.keyMetadata }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               ...leadMetadata.keyMetadata }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        ...opportunityMetadata.keyMetadata }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       ...savedQueriesMetadata.keyMetadata }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        ...solutionComponentDefinitionMetadata.keyMetadata }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  ...solutionComponentMetadata.keyMetadata }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           ...solutionMetadata.keyMetadata }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         ...systemFormMetadata.keyMetadata }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         ...systemUserMetadata.keyMetadata }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               ...taskMetadata.keyMetadata }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               ...teamMetadata.keyMetadata }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                ...transactionCurrencyMetadata.keyMetadata }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        ...webresourceMetadata.keyMetadata }
    : null

  const oneToManyResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           relationships: accountMetadata.oneToManyRelationships }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            relationships: aadUserMetadata.oneToManyRelationships }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        relationships: appEventLogMetadata.oneToManyRelationships }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        relationships: appointmentMetadata.oneToManyRelationships }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              relationships: auditMetadata.oneToManyRelationships }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       relationships: businessUnitMetadata.oneToManyRelationships }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            relationships: configurationSettingMetadata.oneToManyRelationships }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           relationships: contactMetadata.oneToManyRelationships }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          relationships: customApiMetadata.oneToManyRelationships }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          relationships: customApiRequestParameterMetadata.oneToManyRelationships }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          relationships: customApiResponsePropertyMetadata.oneToManyRelationships }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              relationships: emailMetadata.oneToManyRelationships }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           relationships: entitiesMetadata.oneToManyRelationships }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      relationships: environmentVariableDefinitionMetadata.oneToManyRelationships }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           relationships: environmentVariableValueMetadata.oneToManyRelationships }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               relationships: leadMetadata.oneToManyRelationships }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        relationships: opportunityMetadata.oneToManyRelationships }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       relationships: savedQueriesMetadata.oneToManyRelationships }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        relationships: solutionComponentDefinitionMetadata.oneToManyRelationships }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  relationships: solutionComponentMetadata.oneToManyRelationships }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           relationships: solutionMetadata.oneToManyRelationships }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         relationships: systemFormMetadata.oneToManyRelationships }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         relationships: systemUserMetadata.oneToManyRelationships }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               relationships: taskMetadata.oneToManyRelationships }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               relationships: teamMetadata.oneToManyRelationships }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                relationships: transactionCurrencyMetadata.oneToManyRelationships }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        relationships: webresourceMetadata.oneToManyRelationships }
    : null

  const manyToOneResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           relationships: accountMetadata.manyToOneRelationships }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            relationships: aadUserMetadata.manyToOneRelationships }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        relationships: appEventLogMetadata.manyToOneRelationships }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        relationships: appointmentMetadata.manyToOneRelationships }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              relationships: auditMetadata.manyToOneRelationships }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       relationships: businessUnitMetadata.manyToOneRelationships }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            relationships: configurationSettingMetadata.manyToOneRelationships }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           relationships: contactMetadata.manyToOneRelationships }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          relationships: customApiMetadata.manyToOneRelationships }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          relationships: customApiRequestParameterMetadata.manyToOneRelationships }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          relationships: customApiResponsePropertyMetadata.manyToOneRelationships }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              relationships: emailMetadata.manyToOneRelationships }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           relationships: entitiesMetadata.manyToOneRelationships }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      relationships: environmentVariableDefinitionMetadata.manyToOneRelationships }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           relationships: environmentVariableValueMetadata.manyToOneRelationships }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               relationships: leadMetadata.manyToOneRelationships }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        relationships: opportunityMetadata.manyToOneRelationships }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       relationships: savedQueriesMetadata.manyToOneRelationships }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        relationships: solutionComponentDefinitionMetadata.manyToOneRelationships }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  relationships: solutionComponentMetadata.manyToOneRelationships }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           relationships: solutionMetadata.manyToOneRelationships }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         relationships: systemFormMetadata.manyToOneRelationships }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         relationships: systemUserMetadata.manyToOneRelationships }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               relationships: taskMetadata.manyToOneRelationships }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               relationships: teamMetadata.manyToOneRelationships }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                relationships: transactionCurrencyMetadata.manyToOneRelationships }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        relationships: webresourceMetadata.manyToOneRelationships }
    : null

  const manyToManyResult =
    entityLogicalName === 'account'                                    ? { loading: accountMetadata.loading,                           relationships: accountMetadata.manyToManyRelationships }
    : entityLogicalName === 'aaduser'                                  ? { loading: aadUserMetadata.loading,                            relationships: aadUserMetadata.manyToManyRelationships }
    : entityLogicalName === 'aidevme_appeventlog'                      ? { loading: appEventLogMetadata.loading,                        relationships: appEventLogMetadata.manyToManyRelationships }
    : entityLogicalName === 'appointment'                              ? { loading: appointmentMetadata.loading,                        relationships: appointmentMetadata.manyToManyRelationships }
    : entityLogicalName === 'audit'                                    ? { loading: auditMetadata.loading,                              relationships: auditMetadata.manyToManyRelationships }
    : entityLogicalName === 'businessunit'                             ? { loading: businessUnitMetadata.loading,                       relationships: businessUnitMetadata.manyToManyRelationships }
    : entityLogicalName === 'aidevme_codeappssamplesconfigurationsetting' ? { loading: configurationSettingMetadata.loading,            relationships: configurationSettingMetadata.manyToManyRelationships }
    : entityLogicalName === 'contact'                                  ? { loading: contactMetadata.loading,                           relationships: contactMetadata.manyToManyRelationships }
    : entityLogicalName === 'customapi'                                ? { loading: customApiMetadata.loading,                          relationships: customApiMetadata.manyToManyRelationships }
    : entityLogicalName === 'customapirequestparameter'                ? { loading: customApiRequestParameterMetadata.loading,          relationships: customApiRequestParameterMetadata.manyToManyRelationships }
    : entityLogicalName === 'customapiresponseproperty'                ? { loading: customApiResponsePropertyMetadata.loading,          relationships: customApiResponsePropertyMetadata.manyToManyRelationships }
    : entityLogicalName === 'email'                                    ? { loading: emailMetadata.loading,                              relationships: emailMetadata.manyToManyRelationships }
    : entityLogicalName === 'entity'                                   ? { loading: entitiesMetadata.loading,                           relationships: entitiesMetadata.manyToManyRelationships }
    : entityLogicalName === 'environmentvariabledefinition'            ? { loading: environmentVariableDefinitionMetadata.loading,      relationships: environmentVariableDefinitionMetadata.manyToManyRelationships }
    : entityLogicalName === 'environmentvariablevalue'                 ? { loading: environmentVariableValueMetadata.loading,           relationships: environmentVariableValueMetadata.manyToManyRelationships }
    : entityLogicalName === 'lead'                                     ? { loading: leadMetadata.loading,                               relationships: leadMetadata.manyToManyRelationships }
    : entityLogicalName === 'opportunity'                              ? { loading: opportunityMetadata.loading,                        relationships: opportunityMetadata.manyToManyRelationships }
    : entityLogicalName === 'savedquery'                               ? { loading: savedQueriesMetadata.loading,                       relationships: savedQueriesMetadata.manyToManyRelationships }
    : entityLogicalName === 'solutioncomponentdefinition'              ? { loading: solutionComponentDefinitionMetadata.loading,        relationships: solutionComponentDefinitionMetadata.manyToManyRelationships }
    : entityLogicalName === 'solutioncomponent'                        ? { loading: solutionComponentMetadata.loading,                  relationships: solutionComponentMetadata.manyToManyRelationships }
    : entityLogicalName === 'solution'                                 ? { loading: solutionMetadata.loading,                           relationships: solutionMetadata.manyToManyRelationships }
    : entityLogicalName === 'systemform'                               ? { loading: systemFormMetadata.loading,                         relationships: systemFormMetadata.manyToManyRelationships }
    : entityLogicalName === 'systemuser'                               ? { loading: systemUserMetadata.loading,                         relationships: systemUserMetadata.manyToManyRelationships }
    : entityLogicalName === 'task'                                     ? { loading: taskMetadata.loading,                               relationships: taskMetadata.manyToManyRelationships }
    : entityLogicalName === 'team'                                     ? { loading: teamMetadata.loading,                               relationships: teamMetadata.manyToManyRelationships }
    : entityLogicalName === 'transactioncurrency'                      ? { loading: transactionCurrencyMetadata.loading,                relationships: transactionCurrencyMetadata.manyToManyRelationships }
    : entityLogicalName === 'webresource'                              ? { loading: webresourceMetadata.loading,                        relationships: webresourceMetadata.manyToManyRelationships }
    : null

  const description =
    `Displays the full metadata for the ${displayName ? `"${displayName}"` : 'selected'} Dataverse table — ` +
    'fields, data types, primary key, logical name, collection name, entity set name, and activity flags.'

  const handleTabSelect = (_ev: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as EntityDetailsTabValue)
  }

  return (
    <div className={styles.root}>
      <Notes
        noteType={ENTITY_DETAILS_APP_NOTE_TYPE}
        showInfoLabel={ENTITY_DETAILS_APP_INFO_LABEL_TEXT}
        infoLabelLink={ENTITY_DETAILS_APP_INFO_LABEL_LINK}
      >
        {description}
      </Notes>

      <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
        <Tab value="table">Table</Tab>
        <Tab value="columns">Columns</Tab>
        <Tab value="keys">Keys</Tab>
        <Tab value="oneToMany">OneToManyRelationships</Tab>
        <Tab value="manyToOne">ManyToOneRelationships</Tab>
        <Tab value="manyToMany">ManyToManyRelationships</Tab>
        <Tab value="privileges">Privileges</Tab>
        <Tab value="solutions">Solutions</Tab>
      </TabList>

      <div className={styles.tabPanel}>
        {selectedTab === 'table' && (
          tableMetadataResult
            ? <MetadataTableInfoTable loading={tableMetadataResult.loading} tableInfo={tableMetadataResult.tableInfo} />
            : <div className={styles.placeholder}><Text>Table — coming soon</Text></div>
        )}
        {selectedTab === 'columns' && (
          columnsMetadataResult
            ? <MetadataColumnsTable loading={columnsMetadataResult.loading} attributes={columnsMetadataResult.attributes} />
            : <div className={styles.placeholder}><Text>Columns — select an entity first</Text></div>
        )}
        {selectedTab === 'keys' && (
          keyMetadataResult
            ? <MetadataKeysTable loading={keyMetadataResult.loading} primaryIdAttribute={keyMetadataResult.primaryIdAttribute} primaryNameAttribute={keyMetadataResult.primaryNameAttribute} primaryKey={keyMetadataResult.primaryKey} />
            : <div className={styles.placeholder}><Text>Keys — select an entity first</Text></div>
        )}
        {selectedTab === 'oneToMany' && (
          oneToManyResult
            ? <MetadataRelationshipTable loading={oneToManyResult.loading} relationships={oneToManyResult.relationships} schemaNameTooltip="OData schema name for the relationship, e.g. account_contacts" />
            : <div className={styles.placeholder}><Text>OneToManyRelationships — select an entity first</Text></div>
        )}
        {selectedTab === 'manyToOne' && (
          manyToOneResult
            ? <MetadataRelationshipTable loading={manyToOneResult.loading} relationships={manyToOneResult.relationships} />
            : <div className={styles.placeholder}><Text>ManyToOneRelationships — select an entity first</Text></div>
        )}
        {selectedTab === 'manyToMany' && (
          manyToManyResult
            ? <MetadataManyToManyTable loading={manyToManyResult.loading} relationships={manyToManyResult.relationships} />
            : <div className={styles.placeholder}><Text>ManyToManyRelationships — select an entity first</Text></div>
        )}
        {selectedTab === 'privileges' && (
          privilegesMetadataResult
            ? <MetadataPrivilegesTable loading={privilegesMetadataResult.loading} privileges={privilegesMetadataResult.privileges} />
            : <div className={styles.placeholder}><Text>Privileges — select an entity first</Text></div>
        )}
        {selectedTab === 'solutions' && (
          solutionsMetadataResult
            ? <MetadataSolutionsTable loading={solutionsMetadataResult.loading} error={solutionsMetadataResult.error} solutions={solutionsMetadataResult.solutions} />
            : <div className={styles.placeholder}><Text>Solutions — select an entity first</Text></div>
        )}
      </div>
    </div>
  )
}
