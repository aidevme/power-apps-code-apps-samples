import type { Entities } from '../../../generated/models/EntitiesModel'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
} from '@fluentui/react-components'
import { DiagramRegular, MoreHorizontal20Regular } from '@fluentui/react-icons'
import { useCRUDApp } from '../../../hooks/component-hooks/apps/useCRUDApp'
import { DataverseTable } from '../../tables/DataverseTable'
import { EntitySelector } from '../../selectors/EntitySelector'
import { EntityTypeSelector } from '../../selectors/EntityTypeSelector'
import type { EntityTypeFilter } from '../../selectors/EntityTypeSelector'
import { Notes } from '../../misc/Notes'
import { useCRUDAppStyles } from '../../../styles/crudapp.styles'
import { ROUTES, CRUD_APP_DESCRIPTION, CRUD_APP_NOTE_TYPE, CRUD_APP_INFO_LABEL_TEXT, CRUD_APP_INFO_LABEL_LINK } from '../../../tools'

/** Props for {@link CRUDApp}. */
export interface ICRUDAppProps {
  /** Entity metadata records loaded at startup, used to populate the entity dropdown. */
  entities: Entities[]
  /** Whether entity metadata is still loading. */
  entitiesLoading: boolean
}

/**
 * Demonstrates loading Dataverse entity metadata and switching between
 * account and contact record tables based on the selected entity.
 *
 * @example
 * ```tsx
 * <CRUDApp />
 * ```
 */
export function CRUDApp({ entities }: ICRUDAppProps) {
  const styles = useCRUDAppStyles()
  const navigate = useNavigate()
  const {
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
    accounts, accountsLoading, loadAccounts,
    aadUsers, aadUsersLoading, loadAadUsers,
    appEventLogs, appEventLogsLoading, loadAppEventLogs,
    appointments, appointmentsLoading, loadAppointments,
    businessUnits, businessUnitsLoading, loadBusinessUnits,
    configurationSettings, configurationSettingsLoading, loadConfigurationSettings,
    contacts, contactsLoading, loadContacts,
    emails, emailsLoading, loadEmails,
    leads, leadsLoading, loadLeads,
    opportunities, opportunitiesLoading, loadOpportunities,
    systemUsers, systemUsersLoading, loadSystemUsers,
    tasks, tasksLoading, loadTasks,
    teams, teamsLoading, loadTeams,
    transactionCurrencies, transactionCurrenciesLoading, loadTransactionCurrencies,
    systemForms, systemFormsLoading, loadSystemForms,
  } = useCRUDApp(entities)

  const [entityTypeFilters, setEntityTypeFilters] = useState<EntityTypeFilter[]>(['all', 'standard', 'activity', 'virtual', 'elastic'])

  const selectedEntity = registeredEntities.find(e => e.meta?.logicalname === selectedLogicalName)
  const selectedDisplayName = selectedEntity?.meta?.name ?? selectedLogicalName

  const filteredEntities = entityTypeFilters.length === 0 || entityTypeFilters.includes('all')
    ? registeredEntities
    : registeredEntities.filter(({ tableType }) =>
        entityTypeFilters.some(f => f !== 'all' && f.toLowerCase() === tableType.toLowerCase())
      )

  const commonProps = {
    selectedIds,
    onSelectionChange: handleSelectionChange,
    entityTypeCode,
  }

  const renderTable = () => {
    if (selectedLogicalName === 'aaduser') {
      return <DataverseTable entityType="aaduser" records={aadUsers} loading={aadUsersLoading} populated
        {...commonProps}
        onNew={() => openRecord('aaduser')}
        onEdit={(id) => openRecord('aaduser', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('aaduser', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadAadUsers() }}
      />
    }
    if (selectedLogicalName === 'account') {
      return <DataverseTable entityType="account" records={accounts} loading={accountsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('account')}
        onEdit={(id) => openRecord('account', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('account', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadAccounts() }}
      />
    }
    if (selectedLogicalName === 'contact') {
      return <DataverseTable entityType="contact" records={contacts} loading={contactsLoading} populated createdByNames={createdByNames} companyNames={companyNames}
        {...commonProps}
        onNew={() => openRecord('contact')}
        onEdit={(id) => openRecord('contact', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('contact', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadContacts() }}
      />
    }
    if (selectedLogicalName === 'systemuser') {
      return <DataverseTable entityType="systemuser" records={systemUsers} loading={systemUsersLoading} populated businessUnitNames={businessUnitNames}
        {...commonProps}
        onNew={() => openRecord('systemuser')}
        onEdit={(id) => openRecord('systemuser', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('systemuser', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadSystemUsers() }}
      />
    }
    if (selectedLogicalName === 'appointment') {
      return <DataverseTable entityType="appointment" records={appointments} loading={appointmentsLoading} populated
        {...commonProps}
        onNew={() => openRecord('appointment')}
        onEdit={(id) => openRecord('appointment', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('appointment', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadAppointments() }}
      />
    }
    if (selectedLogicalName === 'email') {
      return <DataverseTable entityType="email" records={emails} loading={emailsLoading} populated
        {...commonProps}
        onNew={() => openRecord('email')}
        onEdit={(id) => openRecord('email', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('email', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadEmails() }}
      />
    }
    if (selectedLogicalName === 'lead') {
      return <DataverseTable entityType="lead" records={leads} loading={leadsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('lead')}
        onEdit={(id) => openRecord('lead', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('lead', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadLeads() }}
      />
    }
    if (selectedLogicalName === 'opportunity') {
      return <DataverseTable entityType="opportunity" records={opportunities} loading={opportunitiesLoading} populated
        {...commonProps}
        onNew={() => openRecord('opportunity')}
        onEdit={(id) => openRecord('opportunity', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('opportunity', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadOpportunities() }}
      />
    }
    if (selectedLogicalName === 'task') {
      return <DataverseTable entityType="task" records={tasks} loading={tasksLoading} populated
        {...commonProps}
        onNew={() => openRecord('task')}
        onEdit={(id) => openRecord('task', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('task', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadTasks() }}
      />
    }
    if (selectedLogicalName === 'team') {
      return <DataverseTable entityType="team" records={teams} loading={teamsLoading} populated
        {...commonProps}
        onNew={() => openRecord('team')}
        onEdit={(id) => openRecord('team', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('team', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadTeams() }}
      />
    }
    if (selectedLogicalName === 'transactioncurrency') {
      return <DataverseTable entityType="transactioncurrency" records={transactionCurrencies} loading={transactionCurrenciesLoading} populated
        {...commonProps}
        onNew={() => openRecord('transactioncurrency')}
        onEdit={(id) => openRecord('transactioncurrency', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('transactioncurrency', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadTransactionCurrencies() }}
      />
    }
    if (selectedLogicalName === 'businessunit') {
      return <DataverseTable entityType="businessunit" records={businessUnits} loading={businessUnitsLoading} populated businessUnitNames={businessUnitNames}
        {...commonProps}
        onNew={() => openRecord('businessunit')}
        onEdit={(id) => openRecord('businessunit', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('businessunit', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadBusinessUnits() }}
      />
    }
    if (selectedLogicalName === 'aidevme_codeappssamplesconfigurationsetting' || selectedLogicalName === 'aidevme_codeappssamplesconfigurationsettings') {
      return <DataverseTable entityType="aidevme_codeappssamplesconfigurationsetting" records={configurationSettings} loading={configurationSettingsLoading} populated
        {...commonProps}
        onNew={() => openRecord('aidevme_codeappssamplesconfigurationsetting')}
        onEdit={(id) => openRecord('aidevme_codeappssamplesconfigurationsetting', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('aidevme_codeappssamplesconfigurationsetting', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadConfigurationSettings() }}
      />
    }
    if (selectedLogicalName === 'aidevme_appeventlog' || selectedLogicalName === 'aidevme_appeventlogs') {
      return <DataverseTable entityType="aidevme_appeventlog" records={appEventLogs} loading={appEventLogsLoading} populated
        {...commonProps}
        onNew={() => openRecord('aidevme_appeventlog')}
        onEdit={(id) => openRecord('aidevme_appeventlog', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('aidevme_appeventlog', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadAppEventLogs() }}
      />
    }
    if (selectedLogicalName === 'systemform') {
      return <DataverseTable entityType="systemform" records={systemForms} loading={systemFormsLoading} populated
        {...commonProps}
        onNew={() => openRecord('systemform')}
        onEdit={(id) => openRecord('systemform', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('systemform', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadSystemForms() }}
      />
    }
    return null
  }

  return (
    <div className={styles.root}>

      <Notes noteType={CRUD_APP_NOTE_TYPE} showInfoLabel={CRUD_APP_INFO_LABEL_TEXT} infoLabelLink={CRUD_APP_INFO_LABEL_LINK}>{CRUD_APP_DESCRIPTION}</Notes>
      <div className={styles.fieldCard}>
        <EntityTypeSelector value={entityTypeFilters} onChange={setEntityTypeFilters} />
        <div className={styles.fieldWrapper}>
          <div className={styles.entitySelectorContainer}>
            <EntitySelector
              registeredEntities={filteredEntities}
              selectedLogicalName={selectedLogicalName}
              selectedLabel={selectedLabel}
              onEntitySelect={handleEntitySelect}
            />
          </div>
          <Tooltip
            content="Opens an entity-relationship diagram for the selected Dataverse table, visualising its fields, data types, primary key, and relationships to other tables (one-to-many, many-to-one, many-to-many). Useful for understanding the table schema before writing OData queries or designing custom APIs."
            relationship="description"
            positioning="below"
            withArrow
          >
            <Button
              appearance="subtle"
              icon={<DiagramRegular />}
              aria-label="ERD Diagram"
              onClick={() => navigate(`${ROUTES.ERD_DIAGRAM}${selectedLogicalName ? `?entity=${selectedLogicalName}` : ''}`)}
            >
              ERD Diagram
            </Button>
          </Tooltip>
          <Menu positioning="below-start">
            <MenuTrigger disableButtonEnhancement>
              <Tooltip
                content="Entity options — view details for the selected table, including its fields, data types, and metadata properties."
                relationship="label"
                positioning="below"
                withArrow
              >
                <MenuButton
                  appearance="subtle"
                  icon={<MoreHorizontal20Regular />}
                  aria-label="Entity options"
                />
              </Tooltip>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  disabled={!selectedLogicalName}
                
                  onClick={() => navigate(`${ROUTES.ENTITY_DETAILS}?entity=${selectedLogicalName}`)}
                >
                  <span className={styles.menuItemText}>
                    {selectedDisplayName ? `View "${selectedDisplayName}" details` : 'View selected entity details'}
                  </span>
                </MenuItem>
                <MenuDivider />
              
               
                {filteredEntities
                  .filter(({ meta }) => meta?.logicalname !== selectedLogicalName)
                  .map(({ meta }) => (
                  <MenuItem
                    key={meta?.logicalname ?? meta?.entityid}
                  
                    onClick={() => navigate(`${ROUTES.ENTITY_DETAILS}?entity=${meta?.logicalname}`)}
                  >
                    <span className={styles.menuItemText}>
                      {`View "${meta?.name ?? meta?.logicalname}" details`}
                    </span>
                  </MenuItem>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      <div className={styles.tableCard}>
        {renderTable()}
      </div>
    </div>
  )
}



