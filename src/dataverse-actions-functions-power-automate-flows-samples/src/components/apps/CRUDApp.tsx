import {
  Dropdown,
  Field,
  Option,
} from '@fluentui/react-components'
import type { Entities } from '../../generated/models/EntitiesModel'
import { useState } from 'react'
  import { useAccounts, useAppEventLogs, useAppointments, useBusinessUnits, useContacts, useEmails, useLeads, useLookupResolver, useOpportunities, useSystemUsers, useTasks, useTeams, useTransactionCurrencies, REGISTERED_TABLE_COLLECTIONS } from '../../hooks'
import { DataverseTable } from '../tables/DataverseTable'
import { useCRUDAppStyles } from '../../styles/crudapp.styles'

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
export function CRUDApp({ entities, entitiesLoading: _entitiesLoading }: ICRUDAppProps) {
  const styles = useCRUDAppStyles()
  const [selectedLogicalName, setSelectedLogicalName] = useState<string | null>('account')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleEntitySelect = (logicalName: string | null) => {
    setSelectedLogicalName(logicalName)
    setSelectedIds(new Set())
  }
  const { accounts, loading: accountsLoading, loadAccounts } = useAccounts()
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

  // Index entity metadata by logicalcollectionname for display label lookup.
  const entitiesByCollection = new Map(entities.map(e => [e.logicalcollectionname, e]))

  // Drive list from REGISTERED_TABLE_COLLECTIONS (ground truth); fall back to collection name if metadata missing.
  const registeredEntities = [...REGISTERED_TABLE_COLLECTIONS]
    .map(collectionName => ({
      collectionName,
      meta: entitiesByCollection.get(collectionName),
    }))

  const selectedEntity = registeredEntities.find(e => (e.meta?.logicalname ?? e.collectionName) === selectedLogicalName)
  const selectedLabel = selectedEntity
    ? (selectedEntity.meta ? getEntityLabel(selectedEntity.meta) : selectedEntity.collectionName)
    : ''

  const openRecord = (etn: string, id?: string) => {
    const path = id
      ? `/main.aspx?pagetype=entityrecord&etn=${etn}&id=${id}`
      : `/main.aspx?pagetype=entityrecord&etn=${etn}`
    window.open(path, '_blank')
  }

  const renderTable = () => {
    const commonProps = {
      selectedIds,
      onSelectionChange: (ids: Set<string>) => setSelectedIds(ids),
    }
    if (selectedLogicalName === 'account') {
      return <DataverseTable entityType="account" records={accounts} loading={accountsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('account')}
        onEdit={(id) => openRecord('account', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('account', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadAccounts() }}
      />
    }
    if (selectedLogicalName === 'contact') {
      return <DataverseTable entityType="contact" records={contacts} loading={contactsLoading} populated createdByNames={createdByNames} companyNames={companyNames}
        {...commonProps}
        onNew={() => openRecord('contact')}
        onEdit={(id) => openRecord('contact', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('contact', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadContacts() }}
      />
    }
    if (selectedLogicalName === 'systemuser') {
      return <DataverseTable entityType="systemuser" records={systemUsers} loading={systemUsersLoading} populated businessUnitNames={businessUnitNames}
        {...commonProps}
        onNew={() => openRecord('systemuser')}
        onEdit={(id) => openRecord('systemuser', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('systemuser', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadSystemUsers() }}
      />
    }
    if (selectedLogicalName === 'appointment') {
      return <DataverseTable entityType="appointment" records={appointments} loading={appointmentsLoading} populated
        {...commonProps}
        onNew={() => openRecord('appointment')}
        onEdit={(id) => openRecord('appointment', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('appointment', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadAppointments() }}
      />
    }
    if (selectedLogicalName === 'email') {
      return <DataverseTable entityType="email" records={emails} loading={emailsLoading} populated
        {...commonProps}
        onNew={() => openRecord('email')}
        onEdit={(id) => openRecord('email', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('email', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadEmails() }}
      />
    }
    if (selectedLogicalName === 'lead') {
      return <DataverseTable entityType="lead" records={leads} loading={leadsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('lead')}
        onEdit={(id) => openRecord('lead', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('lead', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadLeads() }}
      />
    }
    if (selectedLogicalName === 'opportunity') {
      return <DataverseTable entityType="opportunity" records={opportunities} loading={opportunitiesLoading} populated
        {...commonProps}
        onNew={() => openRecord('opportunity')}
        onEdit={(id) => openRecord('opportunity', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('opportunity', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadOpportunities() }}
      />
    }
    if (selectedLogicalName === 'task') {
      return <DataverseTable entityType="task" records={tasks} loading={tasksLoading} populated
        {...commonProps}
        onNew={() => openRecord('task')}
        onEdit={(id) => openRecord('task', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('task', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadTasks() }}
      />
    }
    if (selectedLogicalName === 'team') {
      return <DataverseTable entityType="team" records={teams} loading={teamsLoading} populated
        {...commonProps}
        onNew={() => openRecord('team')}
        onEdit={(id) => openRecord('team', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('team', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadTeams() }}
      />
    }
    if (selectedLogicalName === 'transactioncurrency') {
      return <DataverseTable entityType="transactioncurrency" records={transactionCurrencies} loading={transactionCurrenciesLoading} populated
        {...commonProps}
        onNew={() => openRecord('transactioncurrency')}
        onEdit={(id) => openRecord('transactioncurrency', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('transactioncurrency', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadTransactionCurrencies() }}
      />
    }
    if (selectedLogicalName === 'businessunit') {
      return <DataverseTable entityType="businessunit" records={businessUnits} loading={businessUnitsLoading} populated businessUnitNames={businessUnitNames}
        {...commonProps}
        onNew={() => openRecord('businessunit')}
        onEdit={(id) => openRecord('businessunit', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('businessunit', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadBusinessUnits() }}
      />
    }
    if (selectedLogicalName === 'aidevme_appeventlog' || selectedLogicalName === 'aidevme_appeventlogs') {
      return <DataverseTable entityType="aidevme_appeventlog" records={appEventLogs} loading={appEventLogsLoading} populated
        {...commonProps}
        onNew={() => openRecord('aidevme_appeventlog')}
        onEdit={(id) => openRecord('aidevme_appeventlog', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('aidevme_appeventlog', id))}
        onRefresh={() => { setSelectedIds(new Set()); loadAppEventLogs() }}
      />
    }
    return null
  }

  return (
    <div className={styles.root}>
      <div className={styles.fieldWrapper}>
        <Field label="Select an Entity" required>
          <Dropdown
            placeholder="Choose an entity"
            value={selectedLabel}
            selectedOptions={selectedLogicalName ? [selectedLogicalName] : []}
            onOptionSelect={(_, data) => handleEntitySelect(data.optionValue ?? null)}
          >
            {registeredEntities.map(({ collectionName, meta }) => (
              <Option key={collectionName} value={meta?.logicalname ?? collectionName}>
                {meta ? getEntityLabel(meta) : collectionName}
              </Option>
            ))}
          </Dropdown>
        </Field>
      </div>

      {renderTable()}
    </div>
  )
}


