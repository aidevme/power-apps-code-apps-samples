/**
 * Static column definitions for every Dataverse entity table rendered by
 * `DataverseTable`. Each array maps directly to the columns shown in the UI
 * and drives both the table header and the per-cell render logic.
 *
 * @remarks
 * - Cells with `key === 'createdBy'` are overridden at render time by the
 *   `CreatedByLink` component, which resolves the raw GUID via the lookup map.
 * - Cells whose `key` matches a primary-name or lookup field are rendered as
 *   Fluent UI `Link` elements by the `RecordLink` helper in `DataverseTable`.
 * - These arrays are intentionally read-only; never mutate them at runtime.
 */
import { Aidevme_appeventlogseventtype, Aidevme_appeventlogsstatus } from '../generated/models/Aidevme_appeventlogsModel'
import type { Aidevme_appeventlogs } from '../generated/models/Aidevme_appeventlogsModel'
import { Accountsstatecode } from '../generated/models/AccountsModel'
import type { Accounts } from '../generated/models/AccountsModel'
import { Contactsstatecode } from '../generated/models/ContactsModel'
import type { Contacts } from '../generated/models/ContactsModel'
import type { Systemusers } from '../generated/models/SystemusersModel'
import type { Businessunits } from '../generated/models/BusinessunitsModel'
import { Appointmentsprioritycode, Appointmentsstatecode } from '../generated/models/AppointmentsModel'
import type { Appointments } from '../generated/models/AppointmentsModel'
import { Emailsprioritycode, Emailsstatuscode } from '../generated/models/EmailsModel'
import type { Emails } from '../generated/models/EmailsModel'
import { Leadsstatuscode } from '../generated/models/LeadsModel'
import type { Leads } from '../generated/models/LeadsModel'
import { Opportunitiesopportunityratingcode, Opportunitiesstatecode } from '../generated/models/OpportunitiesModel'
import type { Opportunities } from '../generated/models/OpportunitiesModel'
import { Tasksprioritycode, Tasksstatuscode } from '../generated/models/TasksModel'
import type { Tasks } from '../generated/models/TasksModel'
import type { Teams } from '../generated/models/TeamsModel'
import type { Transactioncurrencies } from '../generated/models/TransactioncurrenciesModel'
import { formatDate } from './formating'

/**
 * Column definition for a Dataverse entity table of record type `T`.
 *
 * @typeParam T - The Dataverse entity type whose records populate the table rows.
 *
 * @example
 * ```ts
 * const nameColumn: IColumn<Accounts> = {
 *   key: 'name',
 *   label: 'Account Name',
 *   render: (account) => account.name ?? '—',
 * }
 * ```
 */
export interface IColumn<T> {
  /**
   * Unique column identifier used as the React `key` and to match special
   * render overrides (e.g. `'createdBy'`, `'name'`, `'subject'`).
   */
  key: string
  /** Human-readable column header displayed in the table. */
  label: string
  /**
   * Derives the plain-text display value for a single table row.
   *
   * @param item - The Dataverse entity record for the current row.
   * @returns A formatted string ready for display; falls back to `'—'` when
   *   the underlying field is absent. Columns whose `key` is recognised by
   *   `DataverseTable` (e.g. `'createdBy'`) have their output replaced by a
   *   dedicated React element at render time.
   */
  render: (item: T) => string
}

/**
 * Column definitions for the account (`account`) table view.
 *
 * @remarks
 * Columns: Account Name (link), Main Phone, Address 1: City, Primary Contact,
 * Email (Primary Contact), Status, Created By (resolved link), Created On.
 */
export const accountColumns: IColumn<Accounts>[] = [
  { key: 'name',                  label: 'Account Name',            render: (i) => i.name ?? '\u2014' },
  { key: 'telephone1',            label: 'Main Phone',              render: (i) => i.telephone1 ?? '\u2014' },
  { key: 'address1_city',         label: 'Address 1: City',         render: (i) => i.address1_city ?? '\u2014' },
  { key: 'primarycontactidname',  label: 'Primary Contact',         render: (i) => i.primarycontactidname ?? '\u2014' },
  { key: 'emailaddress1',         label: 'Email (Primary Contact)', render: (i) => i.emailaddress1 ?? '\u2014' },
  { key: 'statecode',             label: 'Status',                  render: (i) => Accountsstatecode[i.statecode] },
  { key: 'createdBy',             label: 'Created By',              render: (i) => i._createdby_value ?? '\u2014' },
  { key: 'createdon',             label: 'Created On',              render: (i) => formatDate(i.createdon) },
]

/**
 * Column definitions for the contact (`contact`) table view.
 *
 * @remarks
 * Columns: Full Name (link), Email, Company Name, Business Phone, Status,
 * Created By (resolved link), Created On.
 */
export const contactColumns: IColumn<Contacts>[] = [
  { key: 'fullname',             label: 'Full Name',      render: (i) => i.fullname ?? '\u2014' },
  { key: 'emailaddress1',        label: 'Email',          render: (i) => i.emailaddress1 ?? '\u2014' },
  { key: 'companyName',          label: 'Company Name',   render: (i) => i.parentcustomeridname ?? '\u2014' },
  { key: 'telephone1',           label: 'Business Phone', render: (i) => i.telephone1 ?? '\u2014' },
  { key: 'statecode',            label: 'Status',         render: (i) => Contactsstatecode[i.statecode] },
  { key: 'createdBy',            label: 'Created By',     render: (i) => i._createdby_value ?? '\u2014' },
  { key: 'createdon',            label: 'Created On',     render: (i) => formatDate(i.createdon) },
]

/**
 * Column definitions for the system user (`systemuser`) table view.
 *
 * @remarks
 * Columns: Full Name (link), Site, Business Unit (link), Title, Position,
 * Main Phone.
 */
export const systemUserColumns: IColumn<Systemusers>[] = [
  { key: 'fullname',           label: 'Full Name',     render: (i) => i.fullname ?? '\u2014' },
  { key: 'siteidname',         label: 'Site',          render: (i) => i.siteidname ?? '\u2014' },
  { key: 'businessunitidname', label: 'Business Unit', render: (i) => i.businessunitidname },
  { key: 'title',              label: 'Title',         render: (i) => i.title ?? '\u2014' },
  { key: 'positionidname',     label: 'Position',      render: (i) => i.positionidname ?? '\u2014' },
  { key: 'address1_telephone1',label: 'Main Phone',    render: (i) => i.address1_telephone1 ?? '\u2014' },
]

/**
 * Column definitions for the business unit (`businessunit`) table view.
 *
 * @remarks
 * Columns: Name (link), Main Phone, Website, Parent Business (link).
 */
export const businessUnitColumns: IColumn<Businessunits>[] = [
  { key: 'name',                    label: 'Name',            render: (i) => i.name },
  { key: 'address1_telephone1',     label: 'Main Phone',      render: (i) => i.address1_telephone1 ?? '\u2014' },
  { key: 'websiteurl',              label: 'Website',         render: (i) => i.websiteurl ?? '\u2014' },
  { key: 'parentbusinessunitidname',label: 'Parent Business', render: (i) => i.parentbusinessunitidname },
]

/**
 * Column definitions for the appointment (`appointment`) table view.
 *
 * @remarks
 * Columns: Subject (link), Regarding (dynamic-etn link), Required Attendees,
 * Priority, Start Time, End Time, Location, Status, Owner (link).
 */
export const appointmentColumns: IColumn<Appointments>[] = [
  { key: 'subject',                label: 'Subject',             render: (i) => i.subject },
  { key: 'regardingobjectidname',  label: 'Regarding',           render: (i) => i.regardingobjectidname ?? '\u2014' },
  { key: 'requiredattendees',      label: 'Required Attendees',  render: (i) => i.requiredattendees ?? '\u2014' },
  { key: 'prioritycode',           label: 'Priority',            render: (i) => i.prioritycode != null ? Appointmentsprioritycode[i.prioritycode] : '\u2014' },
  { key: 'scheduledstart',         label: 'Start Time',          render: (i) => formatDate(i.scheduledstart) },
  { key: 'scheduledend',           label: 'End Time',            render: (i) => formatDate(i.scheduledend) },
  { key: 'location',               label: 'Location',            render: (i) => i.location ?? '\u2014' },
  { key: 'statecode',              label: 'Status',              render: (i) => Appointmentsstatecode[i.statecode] },
  { key: 'owneridname',            label: 'Owner',               render: (i) => i.owneridname },
]

/**
 * Column definitions for the email (`email`) table view.
 *
 * @remarks
 * Columns: Subject (link), From, To, Regarding (dynamic-etn link), Priority,
 * Status Reason, Modified On.
 */
export const emailColumns: IColumn<Emails>[] = [
  { key: 'subject',               label: 'Subject',       render: (i) => i.subject ?? '\u2014' },
  { key: 'sender',                label: 'From',          render: (i) => i.sender ?? '\u2014' },
  { key: 'torecipients',          label: 'To',            render: (i) => i.torecipients ?? '\u2014' },
  { key: 'regardingobjectidname', label: 'Regarding',     render: (i) => i.regardingobjectidname ?? '\u2014' },
  { key: 'prioritycode',          label: 'Priority',      render: (i) => i.prioritycode != null ? Emailsprioritycode[i.prioritycode] : '\u2014' },
  { key: 'statuscode',            label: 'Status Reason', render: (i) => i.statuscode != null ? Emailsstatuscode[i.statuscode] : '\u2014' },
  { key: 'modifiedon',            label: 'Modified On',   render: (i) => formatDate(i.modifiedon) },
]

/**
 * Column definitions for the lead (`lead`) table view.
 *
 * @remarks
 * Columns: Name (link), Topic, Owner (dynamic-etn link), Status Reason,
 * Created By (resolved link), Created On.
 */
export const leadColumns: IColumn<Leads>[] = [
  { key: 'fullname',    label: 'Name',          render: (i) => i.fullname ?? '\u2014' },
  { key: 'subject',     label: 'Topic',         render: (i) => i.subject },
  { key: 'owneridname', label: 'Owner',         render: (i) => i.owneridname },
  { key: 'statuscode',  label: 'Status Reason', render: (i) => i.statuscode != null ? Leadsstatuscode[i.statuscode] : '\u2014' },
  { key: 'createdBy',   label: 'Created By',    render: (i) => i._createdby_value ?? '\u2014' },
  { key: 'createdon',   label: 'Created On',    render: (i) => formatDate(i.createdon) },
]

/**
 * Column definitions for the opportunity (`opportunity`) table view.
 *
 * @remarks
 * Columns: Topic (link), Potential Customer (dynamic-etn link), Email Address,
 * Status, Actual Close Date, Actual Revenue, Est. Close Date, Est. Revenue,
 * Rating, Probability.
 */
export const opportunityColumns: IColumn<Opportunities>[] = [
  { key: 'name',                  label: 'Topic',               render: (i) => i.name },
  { key: 'customeridname',        label: 'Potential Customer',  render: (i) => i.customeridname },
  { key: 'emailaddress',          label: 'Email Address',       render: (i) => i.emailaddress ?? '\u2014' },
  { key: 'statecode',             label: 'Status',              render: (i) => Opportunitiesstatecode[i.statecode] },
  { key: 'actualclosedate',       label: 'Actual Close Date',   render: (i) => formatDate(i.actualclosedate) },
  { key: 'actualvalue',           label: 'Actual Revenue',      render: (i) => i.actualvalue != null ? i.actualvalue.toLocaleString() : '\u2014' },
  { key: 'estimatedclosedate',    label: 'Est. Close Date',     render: (i) => formatDate(i.estimatedclosedate) },
  { key: 'estimatedvalue',        label: 'Est. Revenue',        render: (i) => i.estimatedvalue != null ? i.estimatedvalue.toLocaleString() : '\u2014' },
  { key: 'opportunityratingcode', label: 'Rating',              render: (i) => i.opportunityratingcode != null ? Opportunitiesopportunityratingcode[i.opportunityratingcode] : '\u2014' },
  { key: 'closeprobability',      label: 'Probability',         render: (i) => i.closeprobability != null ? `${i.closeprobability}%` : '\u2014' },
]

/**
 * Column definitions for the task (`task`) table view.
 *
 * @remarks
 * Columns: Subject (link), Regarding (dynamic-etn link), Owner (dynamic-etn link),
 * Priority, Due Date, Status Reason.
 */
export const taskColumns: IColumn<Tasks>[] = [
  { key: 'subject',               label: 'Subject',       render: (i) => i.subject },
  { key: 'regardingobjectidname', label: 'Regarding',     render: (i) => i.regardingobjectidname ?? '\u2014' },
  { key: 'owneridname',           label: 'Owner',         render: (i) => i.owneridname },
  { key: 'prioritycode',          label: 'Priority',      render: (i) => i.prioritycode != null ? Tasksprioritycode[i.prioritycode] : '\u2014' },
  { key: 'scheduledend',          label: 'Due Date',      render: (i) => formatDate(i.scheduledend) },
  { key: 'statuscode',            label: 'Status Reason', render: (i) => i.statuscode != null ? Tasksstatuscode[i.statuscode] : '\u2014' },
]

/**
 * Column definitions for the team (`team`) table view.
 *
 * @remarks
 * Columns: Team Name (link), Business Unit (link).
 */
export const teamColumns: IColumn<Teams>[] = [
  { key: 'name',               label: 'Team Name',     render: (i) => i.name },
  { key: 'businessunitidname', label: 'Business Unit', render: (i) => i.businessunitidname },
]

/**
 * Column definitions for the transaction currency (`transactioncurrency`) table view.
 *
 * @remarks
 * Columns: Currency Name (link), Currency Code, Currency Symbol, Exchange Rate,
 * Currency Precision.
 */
export const transactionCurrencyColumns: IColumn<Transactioncurrencies>[] = [
  { key: 'currencyname',      label: 'Currency Name',      render: (i) => i.currencyname },
  { key: 'isocurrencycode',   label: 'Currency Code',      render: (i) => i.isocurrencycode },
  { key: 'currencysymbol',    label: 'Currency Symbol',    render: (i) => i.currencysymbol },
  { key: 'exchangerate',      label: 'Exchange Rate',      render: (i) => String(i.exchangerate) },
  { key: 'currencyprecision', label: 'Currency Precision', render: (i) => String(i.currencyprecision) },
]

/**
 * Column definitions for the App Event Log (`aidevme_appeventlog`) Elastic table view.
 *
 * @remarks
 * Columns: Name (link), Event Type, Status, Entity, Duration (ms),
 * Session ID, Created On, TTL (s).
 */
export const appEventLogColumns: IColumn<Aidevme_appeventlogs>[] = [
  { key: 'aidevme_name',              label: 'Name',           render: (i) => i.aidevme_name ?? '\u2014' },
  { key: 'aidevme_eventtype',         label: 'Event Type',     render: (i) => i.aidevme_eventtype != null ? Aidevme_appeventlogseventtype[i.aidevme_eventtype] : '\u2014' },
  { key: 'aidevme_status',            label: 'Status',         render: (i) => i.aidevme_status != null ? Aidevme_appeventlogsstatus[i.aidevme_status] : '\u2014' },
  { key: 'aidevme_entitylogicalname', label: 'Entity',         render: (i) => i.aidevme_entitylogicalname ?? '\u2014' },
  { key: 'aidevme_duration',          label: 'Duration (ms)',  render: (i) => { const d = (i as unknown as { aidevme_duration?: number }).aidevme_duration; return d != null ? String(d) : '\u2014' } },
  { key: 'aidevme_sessionid',         label: 'Session ID',     render: (i) => i.aidevme_sessionid ?? '\u2014' },
  { key: 'createdon',                 label: 'Created On',     render: (i) => formatDate(i.createdon) },
  { key: 'ttlinseconds',              label: 'TTL (s)',         render: (i) => i.ttlinseconds != null ? String(i.ttlinseconds) : '\u2014' },
]
