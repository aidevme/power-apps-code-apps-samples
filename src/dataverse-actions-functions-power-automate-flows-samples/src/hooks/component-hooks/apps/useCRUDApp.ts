import { useState } from 'react'
import type { Accounts } from '../../../generated/models/AccountsModel'
import type { Aadusers } from '../../../generated/models/AadusersModel'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derives the display table type from the fields available on a registered
 * {@link Entities} record. Used to populate {@link IRegisteredEntity.tableType}.
 *
 * @param meta - The entity metadata record, or `undefined` when not yet loaded.
 * @returns `'Activity'`, `'Elastic'`, `'Virtual'`, or `'Standard'`.
 */
function deriveTableType(meta: import('../../../generated/models/EntitiesModel').Entities | undefined): string {
  if (!meta) return 'Standard'
  if (meta.isactivity) return 'Activity'
  if (meta.physicalname?.toLowerCase().endsWith('_elastic')) return 'Elastic'
  // Virtual entities have an external name but no physical SQL storage (physicalname absent)
  if (meta.externalname && !meta.physicalname) return 'Virtual'
  return 'Standard'
}
import type { Aidevme_appeventlogs } from '../../../generated/models/Aidevme_appeventlogsModel'
import type { Aidevme_codeappssamplesconfigurationsettings } from '../../../generated/models/Aidevme_codeappssamplesconfigurationsettingsModel'
import type { Appointments } from '../../../generated/models/AppointmentsModel'
import type { Businessunits } from '../../../generated/models/BusinessunitsModel'
import type { Contacts } from '../../../generated/models/ContactsModel'
import type { Emails } from '../../../generated/models/EmailsModel'
import type { Entities } from '../../../generated/models/EntitiesModel'
import type { Leads } from '../../../generated/models/LeadsModel'
import type { Opportunities } from '../../../generated/models/OpportunitiesModel'
import type { Systemusers } from '../../../generated/models/SystemusersModel'
import type { Tasks } from '../../../generated/models/TasksModel'
import type { Teams } from '../../../generated/models/TeamsModel'
import type { Transactioncurrencies } from '../../../generated/models/TransactioncurrenciesModel'
import type { Systemforms } from '../../../generated/models/SystemformsModel'
import {
  REGISTERED_TABLE_COLLECTIONS,
  useAadUsers,
  useAccounts,
  useAppEventLogs,
  useAppointments,
  useBusinessUnits,
  useConfigurationSettings,
  useContacts,
  useEmails,
  useLeads,
  useLookupResolver,
  useOpportunities,
  useSystemForms,
  useSystemUsers,
  useTasks,
  useTeams,
  useTransactionCurrencies,
} from '../..'

/** Return value of the {@link useCRUDApp} hook. */
export interface IUseCRUDAppResult {
  // ---------------------------------------------------------------------------
  // Entity selection
  // ---------------------------------------------------------------------------

  /** Currently selected entity logical name, or `null` when none is selected. */
  selectedLogicalName: string | null
  /** Set of selected row record IDs within the active table. */
  selectedIds: Set<string>
  /** Display label for the Dropdown's `value` prop. */
  selectedLabel: string
  /** Ordered list of registered entity entries, each pairing a collection name with optional metadata and a derived table type. */
  registeredEntities: { collectionName: string; meta: Entities | undefined; tableType: string }[]
  /** Dataverse object type code for the currently selected entity, if available. */
  entityTypeCode: number | undefined

  // ---------------------------------------------------------------------------
  // Callbacks
  // ---------------------------------------------------------------------------

  /**
   * Switches the active entity and clears the current row selection.
   *
   * @param logicalName - Entity logical name to select, or `null` to deselect.
   */
  handleEntitySelect: (logicalName: string | null) => void
  /**
   * Updates the set of selected row IDs in the active table.
   *
   * @param ids - New selection set.
   */
  handleSelectionChange: (ids: Set<string>) => void
  /**
   * Opens a Dataverse entity form in a new browser tab.
   *
   * @param etn - Entity type name (logical name), e.g. `'account'`.
   * @param id - Optional record GUID. Omit to open the create-new form.
   */
  openRecord: (etn: string, id?: string) => void

  // ---------------------------------------------------------------------------
  // Lookup name maps
  // ---------------------------------------------------------------------------

  /** Map of systemuser GUID → display name for "Created By" columns. */
  createdByNames: Record<string, string>
  /** Map of account GUID → display name for "Company Name" columns. */
  companyNames: Record<string, string>
  /** Map of business unit GUID → display name for "Business Unit" / "Parent Business" columns. */
  businessUnitNames: Record<string, string>

  // ---------------------------------------------------------------------------
  // Per-entity data
  // ---------------------------------------------------------------------------

  /** Account records. */
  accounts: Accounts[]
  /** Whether account records are loading. */
  accountsLoading: boolean
  /** Reloads account records from Dataverse. */
  loadAccounts: () => void

  /** AAD User records from the virtual table. */
  aadUsers: Aadusers[]
  /** Whether AAD User records are loading. */
  aadUsersLoading: boolean
  /** Reloads AAD User records from Dataverse. */
  loadAadUsers: () => void

  /** App Event Log records. */
  appEventLogs: Aidevme_appeventlogs[]
  /** Whether app event log records are loading. */
  appEventLogsLoading: boolean
  /** Reloads app event log records from Dataverse. */
  loadAppEventLogs: () => void

  /** Appointment records. */
  appointments: Appointments[]
  /** Whether appointment records are loading. */
  appointmentsLoading: boolean
  /** Reloads appointment records from Dataverse. */
  loadAppointments: () => void

  /** Business Unit records. */
  businessUnits: Businessunits[]
  /** Whether business unit records are loading. */
  businessUnitsLoading: boolean
  /** Reloads business unit records from Dataverse. */
  loadBusinessUnits: () => void

  /** Configuration Setting records. */
  configurationSettings: Aidevme_codeappssamplesconfigurationsettings[]
  /** Whether configuration setting records are loading. */
  configurationSettingsLoading: boolean
  /** Reloads configuration setting records from Dataverse. */
  loadConfigurationSettings: () => void

  /** Contact records. */
  contacts: Contacts[]
  /** Whether contact records are loading. */
  contactsLoading: boolean
  /** Reloads contact records from Dataverse. */
  loadContacts: () => void

  /** Email records. */
  emails: Emails[]
  /** Whether email records are loading. */
  emailsLoading: boolean
  /** Reloads email records from Dataverse. */
  loadEmails: () => void

  /** Lead records. */
  leads: Leads[]
  /** Whether lead records are loading. */
  leadsLoading: boolean
  /** Reloads lead records from Dataverse. */
  loadLeads: () => void

  /** Opportunity records. */
  opportunities: Opportunities[]
  /** Whether opportunity records are loading. */
  opportunitiesLoading: boolean
  /** Reloads opportunity records from Dataverse. */
  loadOpportunities: () => void

  /** System User records. */
  systemUsers: Systemusers[]
  /** Whether system user records are loading. */
  systemUsersLoading: boolean
  /** Reloads system user records from Dataverse. */
  loadSystemUsers: () => void

  /** Task records. */
  tasks: Tasks[]
  /** Whether task records are loading. */
  tasksLoading: boolean
  /** Reloads task records from Dataverse. */
  loadTasks: () => void

  /** Team records. */
  teams: Teams[]
  /** Whether team records are loading. */
  teamsLoading: boolean
  /** Reloads team records from Dataverse. */
  loadTeams: () => void

  /** Transaction Currency records. */
  transactionCurrencies: Transactioncurrencies[]
  /** Whether transaction currency records are loading. */
  transactionCurrenciesLoading: boolean
  /** Reloads transaction currency records from Dataverse. */
  loadTransactionCurrencies: () => void

  /** System form records loaded from Dataverse. */
  systemForms: Systemforms[]
  /** Whether system form records are loading. */
  systemFormsLoading: boolean
  /** Reloads system form records from Dataverse. */
  loadSystemForms: () => void
}

/**
 * Manages all state, service calls, and derived values for the {@link CRUDApp} component.
 *
 * Owns entity selection, row selection, all per-entity Dataverse hooks, lookup
 * resolver wiring, and the `openRecord` helper. The component remains a pure
 * rendering layer that consumes this hook's output via props.
 *
 * @param entities - Entity metadata records loaded by the parent (e.g. from `useEntities`),
 *   used to build the entity dropdown and resolve display labels.
 * @returns All state, records, loading flags, and callbacks needed by {@link CRUDApp}.
 * @example
 * ```ts
 * const crudApp = useCRUDApp(entities)
 * ```
 */
export function useCRUDApp(entities: Entities[]): IUseCRUDAppResult {
  const [selectedLogicalName, setSelectedLogicalName] = useState<string | null>('account')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleEntitySelect = (logicalName: string | null) => {
    setSelectedLogicalName(logicalName)
    setSelectedIds(new Set())
  }

  const handleSelectionChange = (ids: Set<string>) => setSelectedIds(ids)

  const { settings: configurationSettings, loading: configurationSettingsLoading, reload: loadConfigurationSettings } = useConfigurationSettings()
  const { accounts, loading: accountsLoading, loadAccounts } = useAccounts()
  const { aadUsers, loading: aadUsersLoading, loadAadUsers } = useAadUsers()
  const { appEventLogs, loading: appEventLogsLoading, loadAppEventLogs } = useAppEventLogs()
  const { appointments, loading: appointmentsLoading, loadAppointments } = useAppointments()
  const { businessUnits, loading: businessUnitsLoading, loadBusinessUnits } = useBusinessUnits()
  const { contacts, loading: contactsLoading, loadContacts } = useContacts()
  const { emails, loading: emailsLoading, loadEmails } = useEmails()
  const { leads, loading: leadsLoading, loadLeads } = useLeads()
  const { opportunities, loading: opportunitiesLoading, loadOpportunities } = useOpportunities()
  const { systemUsers, loading: systemUsersLoading, loadSystemUsers } = useSystemUsers()
  const { tasks, loading: tasksLoading, loadTasks } = useTasks()
  const { teams, loading: teamsLoading, loadTeams } = useTeams()
  const { transactionCurrencies, loading: transactionCurrenciesLoading, loadTransactionCurrencies } = useTransactionCurrencies()
  const { systemForms, loading: systemFormsLoading, reload: loadSystemForms } = useSystemForms()

  const accountCreatedByIds = accounts.map(a => a._createdby_value).filter(Boolean) as string[]
  const contactCreatedByIds = contacts.map(c => c._createdby_value).filter(Boolean) as string[]
  const leadCreatedByIds = leads.map(l => l._createdby_value).filter(Boolean) as string[]
  const contactCompanyIds = contacts.map(c => c._accountid_value).filter(Boolean) as string[]
  const systemUserBusinessUnitIds = systemUsers.map(u => u._businessunitid_value).filter(Boolean) as string[]
  const businessUnitParentIds = businessUnits.map(b => b._parentbusinessunitid_value).filter(Boolean) as string[]

  const { userNameMap: createdByNames, accountNameMap: companyNames, businessUnitNameMap: businessUnitNames } = useLookupResolver(
    [...accountCreatedByIds, ...contactCreatedByIds, ...leadCreatedByIds],
    contactCompanyIds,
    [...systemUserBusinessUnitIds, ...businessUnitParentIds],
  )

  const entitiesByCollection = new Map(entities.map(e => [e.logicalcollectionname, e]))

  const registeredEntities = [...REGISTERED_TABLE_COLLECTIONS]
    .map(collectionName => {
      const meta = entitiesByCollection.get(collectionName)
      return {
        collectionName,
        meta,
        tableType: deriveTableType(meta),
      }
    })

  const selectedEntity = registeredEntities.find(e => (e.meta?.logicalname ?? e.collectionName) === selectedLogicalName)
  const selectedLabel = selectedEntity
    ? (selectedEntity.meta ? getEntityLabel(selectedEntity.meta) : selectedEntity.collectionName)
    : ''

  const entityTypeCode = selectedEntity?.meta?.objecttypecode ?? undefined

  const openRecord = (etn: string, id?: string) => {
    const path = id
      ? `/main.aspx?pagetype=entityrecord&etn=${etn}&id=${id}`
      : `/main.aspx?pagetype=entityrecord&etn=${etn}`
    window.open(path, '_blank')
  }

  return {
    selectedLogicalName,
    selectedIds,
    selectedLabel,
    registeredEntities,
    entityTypeCode,
    handleEntitySelect,
    handleSelectionChange,
    openRecord,
    createdByNames,
    companyNames,
    businessUnitNames,
    accounts,
    accountsLoading,
    loadAccounts,
    aadUsers,
    aadUsersLoading,
    loadAadUsers,
    appEventLogs,
    appEventLogsLoading,
    loadAppEventLogs,
    appointments,
    appointmentsLoading,
    loadAppointments,
    businessUnits,
    businessUnitsLoading,
    loadBusinessUnits,
    configurationSettings,
    configurationSettingsLoading,
    loadConfigurationSettings,
    contacts,
    contactsLoading,
    loadContacts,
    emails,
    emailsLoading,
    loadEmails,
    leads,
    leadsLoading,
    loadLeads,
    opportunities,
    opportunitiesLoading,
    loadOpportunities,
    systemUsers,
    systemUsersLoading,
    loadSystemUsers,
    tasks,
    tasksLoading,
    loadTasks,
    teams,
    teamsLoading,
    loadTeams,
    transactionCurrencies,
    transactionCurrenciesLoading,
    loadTransactionCurrencies,
    systemForms,
    systemFormsLoading,
    loadSystemForms,
  }
}

// ---------------------------------------------------------------------------
// Private helpers (used only inside this hook)
// ---------------------------------------------------------------------------

function getEntityType(e: Entities): string {
  if (e.isactivity) return 'Activity'
  if (e.physicalname?.toLowerCase().endsWith('_elastic')) return 'Elastic'
  if (e.externalname) return 'Virtual'
  return 'Standard'
}

function getEntityLabel(e: Entities): string {
  const displayName = e.name ?? e.originallocalizedname ?? e.logicalname ?? e.entityid
  return `${displayName} (${getEntityType(e)})`
}
