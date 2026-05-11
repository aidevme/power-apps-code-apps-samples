import { useState } from 'react'
import {
  Caption2,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
} from '@fluentui/react-components'

import { ViewSelector } from '../selectors/ViewSelector'
import { DataverseTableToolbar } from '../toolbars/DataverseTableToolbars'
import type {
  AccountsModel, Aidevme_appeventlogsModel, Aidevme_codeappssamplesconfigurationsettingsModel,
  ContactsModel, SystemusersModel, BusinessunitsModel, AppointmentsModel,
  EmailsModel, LeadsModel, OpportunitiesModel, TasksModel, TeamsModel,
  TransactioncurrenciesModel, SystemformsModel, AadusersModel,
} from '../../generated'
import type { IColumn } from '../../tools/dataverseTable.consts'
import {
  accountColumns, appEventLogColumns, configurationSettingColumns, contactColumns, systemUserColumns, businessUnitColumns,
  appointmentColumns, emailColumns, leadColumns, opportunityColumns,
  taskColumns, teamColumns, transactionCurrencyColumns, systemFormColumns, aadUserColumns,
} from '../../tools/dataverseTable.consts'
import { useDataverseTableStyles } from '../../styles/dataversetable.styles'

/** Shared props for all {@link DataverseTable} variants. */
interface IDataverseTableBaseProps {
  /** Whether data is still loading. */
  loading: boolean
  /**
   * Whether to show table rows. When `false` an empty table body is rendered.
   * @defaultValue `false`
   */
  populated?: boolean
  /**
   * Map of systemuser GUID → display name, provided by {@link useLookupResolver}.
   * Used to populate the "Created By" column.
   * @defaultValue `{}`
   */
  createdByNames?: Record<string, string>
  /**
   * Map of account GUID → display name, provided by {@link useLookupResolver}.
   * Used to populate the "Company Name" column in contact mode.
   * @defaultValue `{}`
   */
  companyNames?: Record<string, string>
  /**
   * Dataverse object type code for the entity (e.g. `1` for account, `2` for contact).
   * Sourced from `objecttypecode` on the {@link Entities} metadata record.
   */
  entityTypeCode?: number
  /** Currently selected record IDs. */
  selectedIds?: Set<string>
  /** Called when the selection changes. */
  onSelectionChange?: (ids: Set<string>) => void
  /** Called when the New toolbar button is clicked. */
  onNew?: () => void
  /** Called when the Edit toolbar button is clicked. Enabled only when exactly one row is selected. */
  onEdit?: (id: string) => void
  /** Called when the Delete toolbar button is clicked with all selected record IDs. */
  onDelete?: (ids: string[]) => void
  /** Called when the Refresh toolbar button is clicked. */
  onRefresh?: () => void
}

/** Props for an account-mode {@link DataverseTable}. */
interface IDataverseTableAccountProps extends IDataverseTableBaseProps {
  /** Selects the account column set. */
  entityType: 'account'
  /** Account records to display. */
  records: AccountsModel.Accounts[]
}

/** Props for a contact-mode {@link DataverseTable}. */
interface IDataverseTableContactProps extends IDataverseTableBaseProps {
  /** Selects the contact column set. */
  entityType: 'contact'
  /** Contact records to display. */
  records: ContactsModel.Contacts[]
}

/** Props for a systemuser-mode {@link DataverseTable}. */
interface IDataverseTableSystemUserProps extends IDataverseTableBaseProps {
  /** Selects the system user column set. */
  entityType: 'systemuser'
  /** System user records to display. */
  records: SystemusersModel.Systemusers[]
  /**
   * Map of business unit GUID → display name, provided by {@link useLookupResolver}.
   * Used to populate the "Business Unit" column.
   * @defaultValue `{}`
   */
  businessUnitNames?: Record<string, string>
}

/** Props for a businessunit-mode {@link DataverseTable}. */
interface IDataverseTableBusinessUnitProps extends IDataverseTableBaseProps {
  /** Selects the business unit column set. */
  entityType: 'businessunit'
  /** Business unit records to display. */
  records: BusinessunitsModel.Businessunits[]
  /**
   * Map of business unit GUID → display name, provided by {@link useLookupResolver}.
   * Used to populate the "Parent Business" column.
   * @defaultValue `{}`
   */
  businessUnitNames?: Record<string, string>
}

/** Props for an appointment-mode {@link DataverseTable}. */
interface IDataverseTableAppointmentProps extends IDataverseTableBaseProps {
  /** Selects the appointment column set. */
  entityType: 'appointment'
  /** Appointment records to display. */
  records: AppointmentsModel.Appointments[]
}

/** Props for an email-mode {@link DataverseTable}. */
interface IDataverseTableEmailProps extends IDataverseTableBaseProps {
  /** Selects the email column set. */
  entityType: 'email'
  /** Email activity records to display. */
  records: EmailsModel.Emails[]
}

/** Props for a lead-mode {@link DataverseTable}. */
interface IDataverseTableLeadProps extends IDataverseTableBaseProps {
  /** Selects the lead column set. */
  entityType: 'lead'
  /** Lead records to display. */
  records: LeadsModel.Leads[]
}

/** Props for an opportunity-mode {@link DataverseTable}. */
interface IDataverseTableOpportunityProps extends IDataverseTableBaseProps {
  /** Selects the opportunity column set. */
  entityType: 'opportunity'
  /** Opportunity records to display. */
  records: OpportunitiesModel.Opportunities[]
}

/** Props for a task-mode {@link DataverseTable}. */
interface IDataverseTableTaskProps extends IDataverseTableBaseProps {
  /** Selects the task column set. */
  entityType: 'task'
  /** Task records to display. */
  records: TasksModel.Tasks[]
}

/** Props for a team-mode {@link DataverseTable}. */
interface IDataverseTableTeamProps extends IDataverseTableBaseProps {
  /** Selects the team column set. */
  entityType: 'team'
  /** Team records to display. */
  records: TeamsModel.Teams[]
}

/** Props for a transaction currency-mode {@link DataverseTable}. */
interface IDataverseTableTransactionCurrencyProps extends IDataverseTableBaseProps {
  /** Selects the transaction currency column set. */
  entityType: 'transactioncurrency'
  /** Transaction currency records to display. */
  records: TransactioncurrenciesModel.Transactioncurrencies[]
}

/** Props for an App Event Log (Elastic table)-mode {@link DataverseTable}. */
interface IDataverseTableAppEventLogProps extends IDataverseTableBaseProps {
  /** Selects the App Event Log Elastic table column set. */
  entityType: 'aidevme_appeventlog'
  /** App Event Log records to display. */
  records: Aidevme_appeventlogsModel.Aidevme_appeventlogs[]
}

/** Props for a Code Apps sample configuration setting-mode {@link DataverseTable}. */
interface IDataverseTableConfigurationSettingProps extends IDataverseTableBaseProps {
  /** Selects the configuration setting column set. */
  entityType: 'aidevme_codeappssamplesconfigurationsetting'
  /** Configuration setting records to display. */
  records: Aidevme_codeappssamplesconfigurationsettingsModel.Aidevme_codeappssamplesconfigurationsettings[]
}

/** Props for a system form-mode {@link DataverseTable}. */
interface IDataverseTableSystemFormProps extends IDataverseTableBaseProps {
  /** Selects the system form column set. */
  entityType: 'systemform'
  /** System form records to display. */
  records: SystemformsModel.Systemforms[]
}

/** Props for an AAD User virtual table-mode {@link DataverseTable}. */
interface IDataverseTableAadUserProps extends IDataverseTableBaseProps {
  /** Selects the AAD User column set. */
  entityType: 'aaduser'
  /** AAD User records to display. */
  records: AadusersModel.Aadusers[]
}

/** Props for {@link DataverseTable} — discriminated by `entityType`. */
export type IDataverseTableProps = IDataverseTableAccountProps | IDataverseTableContactProps | IDataverseTableSystemUserProps | IDataverseTableBusinessUnitProps | IDataverseTableAppointmentProps | IDataverseTableEmailProps | IDataverseTableLeadProps | IDataverseTableOpportunityProps | IDataverseTableTaskProps | IDataverseTableTeamProps | IDataverseTableTransactionCurrencyProps | IDataverseTableAppEventLogProps | IDataverseTableConfigurationSettingProps | IDataverseTableSystemFormProps | IDataverseTableAadUserProps

/** Renders a record name as a Fluent UI {@link Link} to the Dataverse record form. */
function RecordLink({ id, etn, label }: { id: string | undefined; etn: string; label: string | undefined }) {
  const text = label ?? '—'
  if (!id) return <>{text}</>
  return (
    <Link href={`/main.aspx?pagetype=entityrecord&etn=${etn}&id=${id}`} target="_blank">
      {text}
    </Link>
  )
}

/** Renders a resolved systemuser name as a {@link Link}. Falls back to the raw GUID or '—'. */
function CreatedByLink({ userId, nameMap }: { userId: string | undefined; nameMap: Record<string, string> }) {
  const name = userId ? (nameMap[userId] ?? userId) : '—'
  if (!userId) return <>{name}</>
  return (
    <Link href={`/main.aspx?pagetype=entityrecord&etn=systemuser&id=${userId}`} target="_blank">
      {name}
    </Link>
  )
}

/** Returns a sorted copy of `records` using the rendered string value of the active column; returns the original array when `sort` is `null`. */
function sortedRecords<T>(records: T[], sort: { key: string; direction: 'asc' | 'desc' } | null, columns: IColumn<T>[]): T[] {
  if (!sort) return records
  const col = columns.find(c => c.key === sort.key)
  if (!col) return records
  return [...records].sort((a, b) => {
    const av = col.render(a).toLowerCase()
    const bv = col.render(b).toLowerCase()
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sort.direction === 'asc' ? cmp : -cmp
  })
}

/**
 * Renders a Fluent UI `Table` for either account or contact records.
 * Column set is selected by `entityType`. Shows a spinner while loading;
 * rows are only rendered when `populated` is `true`.
 *
 * @example
 * ```tsx
 * <DataverseTable entityType="account" records={accounts} loading={loading} populated={!!selectedEntity} />
 * <DataverseTable entityType="contact" records={contacts} loading={loading} populated={!!selectedEntity} />
 * ```
 */
export function DataverseTable(props: IDataverseTableProps) {
  const styles = useDataverseTableStyles()
  const {
    loading,
    populated = false,
    createdByNames = {},
    companyNames = {},
    entityTypeCode,
    selectedIds = new Set<string>(),
    onSelectionChange,
    onNew,
    onEdit,
    onDelete,
    onRefresh,
  } = props
  const businessUnitNames = (props.entityType === 'systemuser' || props.entityType === 'businessunit') ? (props.businessUnitNames ?? {}) : {}

  const [sortState, setSortState] = useState<{ entityType: string; key: string; direction: 'asc' | 'desc' } | null>(null)
  const sort = sortState?.entityType === props.entityType ? sortState : null
  const handleHeaderClick = (key: string) => {
    setSortState(prev => {
      const same = prev?.entityType === props.entityType && prev?.key === key
      if (same) return prev!.direction === 'asc' ? { entityType: props.entityType, key, direction: 'desc' } : null
      return { entityType: props.entityType, key, direction: 'asc' }
    })
  }

  const entityTypeCodeLabel = entityTypeCode !== undefined ? (
    <ViewSelector key={props.entityType} entityType={props.entityType} />
  ) : null

  const toolbar = (
    <>
      {entityTypeCodeLabel}
      <DataverseTableToolbar selectedIds={selectedIds} onNew={onNew} onEdit={onEdit} onDelete={onDelete} onRefresh={onRefresh} />
    </>
  )

  const handleRowClick = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange?.(next)
  }

  const rowCount = populated ? props.records.length : 0
  const statusBar = (
    <div className={styles.statusBar}>
      <Caption2 className={styles.statusLabel}>Rows</Caption2>
      <Caption2 className={styles.statusValue}>{rowCount}</Caption2>
      <div className={styles.statusDivider} />
      <Caption2 className={styles.statusLabel}>Selected</Caption2>
      <Caption2 className={styles.statusValue}>{selectedIds.size}</Caption2>
    </div>
  )

  if (loading) {
    return <Spinner label={`Loading ${props.entityType}s…`} size="small" />
  }

  if (props.entityType === 'systemuser') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(u => selectedIds.has(u.systemuserid)) ? true : props.records.some(u => selectedIds.has(u.systemuserid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(u => u.systemuserid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {systemUserColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, systemUserColumns).map((user) => (
              <TableRow
                key={user.systemuserid}
                className={selectedIds.has(user.systemuserid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(user.systemuserid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(user.systemuserid)} onChange={() => {}} />
                {systemUserColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'fullname'
                      ? <RecordLink id={user.systemuserid} etn="systemuser" label={user.fullname} />
                      : col.key === 'businessunitidname'
                      ? <RecordLink
                          id={user._businessunitid_value}
                          etn="businessunit"
                          label={businessUnitNames[user._businessunitid_value ?? ''] || user.businessunitidname || undefined}
                        />
                      : col.render(user)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'appointment') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(a => selectedIds.has(a.activityid)) ? true : props.records.some(a => selectedIds.has(a.activityid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(a => a.activityid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {appointmentColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, appointmentColumns).map((appt) => (
              <TableRow
                key={appt.activityid}
                className={selectedIds.has(appt.activityid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(appt.activityid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(appt.activityid)} onChange={() => {}} />
                {appointmentColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'subject'
                      ? <RecordLink id={appt.activityid} etn="appointment" label={appt.subject} />
                      : col.key === 'regardingobjectidname'
                      ? <RecordLink
                          id={appt._regardingobjectid_value}
                          etn={appt.regardingobjecttypecode ?? 'none'}
                          label={appt.regardingobjectidname || undefined}
                        />
                      : col.key === 'owneridname'
                      ? <RecordLink id={appt.ownerid} etn={appt.owneridtype} label={appt.owneridname} />
                      : col.render(appt)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'businessunit') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(b => selectedIds.has(b.businessunitid)) ? true : props.records.some(b => selectedIds.has(b.businessunitid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(b => b.businessunitid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {businessUnitColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, businessUnitColumns).map((bu) => (
              <TableRow
                key={bu.businessunitid}
                className={selectedIds.has(bu.businessunitid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(bu.businessunitid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(bu.businessunitid)} onChange={() => {}} />
                {businessUnitColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'name'
                      ? <RecordLink id={bu.businessunitid} etn="businessunit" label={bu.name} />
                      : col.key === 'websiteurl'
                      ? (bu.websiteurl ? <Link href={bu.websiteurl} target="_blank">{bu.websiteurl}</Link> : <>—</>)
                      : col.key === 'parentbusinessunitidname'
                      ? <RecordLink
                          id={bu._parentbusinessunitid_value}
                          etn="businessunit"
                          label={businessUnitNames[bu._parentbusinessunitid_value ?? ''] || bu.parentbusinessunitidname || undefined}
                        />
                      : col.render(bu)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'contact') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(c => selectedIds.has(c.contactid)) ? true : props.records.some(c => selectedIds.has(c.contactid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(c => c.contactid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {contactColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, contactColumns).map((contact) => (
              <TableRow
                key={contact.contactid}
                className={selectedIds.has(contact.contactid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(contact.contactid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(contact.contactid)} onChange={() => {}} />
                {contactColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'fullname'
                      ? <RecordLink id={contact.contactid} etn="contact" label={contact.fullname} />
                      : col.key === 'companyName'
                      ? <RecordLink
                          id={contact._accountid_value}
                          etn="account"
                          label={contact.accountidname || companyNames[contact._accountid_value ?? ''] || undefined}
                        />
                      : col.key === 'createdBy'
                      ? <CreatedByLink userId={contact._createdby_value} nameMap={createdByNames} />
                      : col.render(contact)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'email') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(e => selectedIds.has(e.activityid)) ? true : props.records.some(e => selectedIds.has(e.activityid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(e => e.activityid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {emailColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, emailColumns).map((email) => (
              <TableRow
                key={email.activityid}
                className={selectedIds.has(email.activityid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(email.activityid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(email.activityid)} onChange={() => {}} />
                {emailColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'subject'
                      ? <RecordLink id={email.activityid} etn="email" label={email.subject} />
                      : col.key === 'regardingobjectidname'
                      ? <RecordLink id={email._regardingobjectid_value} etn={email.regardingobjecttypecode ?? 'none'} label={email.regardingobjectidname || undefined} />
                      : col.render(email)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'lead') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(l => selectedIds.has(l.leadid)) ? true : props.records.some(l => selectedIds.has(l.leadid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(l => l.leadid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {leadColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, leadColumns).map((lead) => (
              <TableRow
                key={lead.leadid}
                className={selectedIds.has(lead.leadid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(lead.leadid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(lead.leadid)} onChange={() => {}} />
                {leadColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'fullname'
                      ? <RecordLink id={lead.leadid} etn="lead" label={lead.fullname} />
                      : col.key === 'owneridname'
                      ? <RecordLink id={lead.ownerid} etn={lead.owneridtype} label={lead.owneridname} />
                      : col.key === 'createdBy'
                      ? <CreatedByLink userId={lead._createdby_value} nameMap={createdByNames} />
                      : col.render(lead)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'opportunity') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(o => selectedIds.has(o.opportunityid)) ? true : props.records.some(o => selectedIds.has(o.opportunityid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(o => o.opportunityid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {opportunityColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, opportunityColumns).map((opp) => (
              <TableRow
                key={opp.opportunityid}
                className={selectedIds.has(opp.opportunityid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(opp.opportunityid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(opp.opportunityid)} onChange={() => {}} />
                {opportunityColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'name'
                      ? <RecordLink id={opp.opportunityid} etn="opportunity" label={opp.name} />
                      : col.key === 'customeridname'
                      ? <RecordLink id={opp.customerid} etn={opp.customeridtype} label={opp.customeridname} />
                      : col.render(opp)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'task') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(t => selectedIds.has(t.activityid)) ? true : props.records.some(t => selectedIds.has(t.activityid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(t => t.activityid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {taskColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, taskColumns).map((task) => (
              <TableRow
                key={task.activityid}
                className={selectedIds.has(task.activityid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(task.activityid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(task.activityid)} onChange={() => {}} />
                {taskColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'subject'
                      ? <RecordLink id={task.activityid} etn="task" label={task.subject} />
                      : col.key === 'regardingobjectidname'
                      ? <RecordLink id={task._regardingobjectid_value} etn={task.regardingobjecttypecode ?? 'none'} label={task.regardingobjectidname || undefined} />
                      : col.key === 'owneridname'
                      ? <RecordLink id={task.ownerid} etn={task.owneridtype} label={task.owneridname} />
                      : col.render(task)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'team') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(t => selectedIds.has(t.teamid)) ? true : props.records.some(t => selectedIds.has(t.teamid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(t => t.teamid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {teamColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, teamColumns).map((team) => (
              <TableRow
                key={team.teamid}
                className={selectedIds.has(team.teamid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(team.teamid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(team.teamid)} onChange={() => {}} />
                {teamColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'name'
                      ? <RecordLink id={team.teamid} etn="team" label={team.name} />
                      : col.key === 'businessunitidname'
                      ? <RecordLink id={team._businessunitid_value} etn="businessunit" label={team.businessunitidname} />
                      : col.render(team)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'transactioncurrency') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(c => selectedIds.has(c.transactioncurrencyid)) ? true : props.records.some(c => selectedIds.has(c.transactioncurrencyid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(c => c.transactioncurrencyid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {transactionCurrencyColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, transactionCurrencyColumns).map((currency) => (
              <TableRow
                key={currency.transactioncurrencyid}
                className={selectedIds.has(currency.transactioncurrencyid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(currency.transactioncurrencyid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(currency.transactioncurrencyid)} onChange={() => {}} />
                {transactionCurrencyColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'currencyname'
                      ? <RecordLink id={currency.transactioncurrencyid} etn="transactioncurrency" label={currency.currencyname} />
                      : col.render(currency)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'aidevme_appeventlog') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(r => selectedIds.has(r.aidevme_appeventlogid)) ? true : props.records.some(r => selectedIds.has(r.aidevme_appeventlogid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(r => r.aidevme_appeventlogid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {appEventLogColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, appEventLogColumns).map((log) => (
              <TableRow
                key={log.aidevme_appeventlogid}
                className={selectedIds.has(log.aidevme_appeventlogid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(log.aidevme_appeventlogid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(log.aidevme_appeventlogid)} onChange={() => {}} />
                {appEventLogColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'aidevme_name'
                      ? <RecordLink id={log.aidevme_appeventlogid} etn="aidevme_appeventlog" label={log.aidevme_name} />
                      : col.render(log)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'aidevme_codeappssamplesconfigurationsetting') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(r => selectedIds.has(r.aidevme_codeappssamplesconfigurationsettingid)) ? true : props.records.some(r => selectedIds.has(r.aidevme_codeappssamplesconfigurationsettingid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(r => r.aidevme_codeappssamplesconfigurationsettingid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {configurationSettingColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, configurationSettingColumns).map((setting) => (
              <TableRow
                key={setting.aidevme_codeappssamplesconfigurationsettingid}
                className={selectedIds.has(setting.aidevme_codeappssamplesconfigurationsettingid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(setting.aidevme_codeappssamplesconfigurationsettingid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(setting.aidevme_codeappssamplesconfigurationsettingid)} onChange={() => {}} />
                {configurationSettingColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'aidevme_key'
                      ? <RecordLink id={setting.aidevme_codeappssamplesconfigurationsettingid} etn="aidevme_codeappssamplesconfigurationsetting" label={setting.aidevme_key} />
                      : col.render(setting)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'systemform') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(f => selectedIds.has(f.formid)) ? true : props.records.some(f => selectedIds.has(f.formid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(f => f.formid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {systemFormColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, systemFormColumns).map((form) => (
              <TableRow
                key={form.formid}
                className={selectedIds.has(form.formid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(form.formid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(form.formid)} onChange={() => {}} />
                {systemFormColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'name'
                      ? <RecordLink id={form.formid} etn="systemform" label={form.name} />
                      : col.render(form)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  if (props.entityType === 'aaduser') {
    return (
      <>
        {toolbar}
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                type="checkbox"
                checked={props.records.length > 0 && props.records.every(u => selectedIds.has(u.aaduserid)) ? true : props.records.some(u => selectedIds.has(u.aaduserid)) ? 'mixed' : false}
                onChange={() => {
                  const allIds = props.records.map(u => u.aaduserid)
                  onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
                }}
              />
              {aadUserColumns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={styles.headerCell}
                  sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {populated && sortedRecords(props.records, sort, aadUserColumns).map((user) => (
              <TableRow
                key={user.aaduserid}
                className={selectedIds.has(user.aaduserid) ? styles.selectedRow : undefined}
                onClick={() => handleRowClick(user.aaduserid)}
              >
                <TableSelectionCell type="checkbox" checked={selectedIds.has(user.aaduserid)} onChange={() => {}} />
                {aadUserColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === 'displayname'
                      ? <RecordLink id={user.aaduserid} etn="aaduser" label={user.displayname} />
                      : col.render(user)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {statusBar}
      </>
    )
  }

  return (
    <>
      {toolbar}
      <Table>
        <TableHeader>
          <TableRow>
            <TableSelectionCell
              type="checkbox"
              checked={props.records.length > 0 && props.records.every(a => selectedIds.has(a.accountid)) ? true : props.records.some(a => selectedIds.has(a.accountid)) ? 'mixed' : false}
              onChange={() => {
                const allIds = props.records.map(a => a.accountid)
                onSelectionChange?.(allIds.every(id => selectedIds.has(id)) ? new Set() : new Set(allIds))
              }}
            />
            {accountColumns.map((col) => (
              <TableHeaderCell
                key={col.key}
                className={styles.headerCell}
                sortDirection={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={() => handleHeaderClick(col.key)}
              >
                {col.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {populated && sortedRecords(props.records, sort, accountColumns).map((account) => (
            <TableRow
              key={account.accountid}
              className={selectedIds.has(account.accountid) ? styles.selectedRow : undefined}
              onClick={() => handleRowClick(account.accountid)}
            >
              <TableSelectionCell type="checkbox" checked={selectedIds.has(account.accountid)} onChange={() => {}} />
              {accountColumns.map((col) => (
                <TableCell key={col.key}>
                  {col.key === 'name'
                    ? <RecordLink id={account.accountid} etn="account" label={account.name} />
                    : col.key === 'createdBy'
                    ? <CreatedByLink userId={account._createdby_value} nameMap={createdByNames} />
                    : col.render(account)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {statusBar}
    </>
  )
}
