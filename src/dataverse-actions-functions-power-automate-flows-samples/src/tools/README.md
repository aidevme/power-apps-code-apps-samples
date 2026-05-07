# `src/tools`

Static utilities and constants shared across the application. This folder contains no React components — only pure data definitions and re-export barrels consumed by `DataverseTable` and any future table-like UI.

---

## Files

| File | Purpose |
|---|---|
| [`dataverseTable.consts.ts`](#dataversetableconststs) | Column definitions for every Dataverse entity table |
| [`index.ts`](#indexts) | Public barrel re-export for the module |

---

## `dataverseTable.consts.ts`

Defines the `IColumn<T>` interface and one column array per supported Dataverse entity. These arrays drive the table headers and per-cell render logic inside the `DataverseTable` component.

### Design rules

- **Read-only at runtime** — never mutate these arrays; treat them as frozen configuration.
- **`key === 'createdBy'`** — the `DataverseTable` render branch replaces the `render()` output with a `CreatedByLink` component that resolves the raw GUID to a display name via the lookup map.
- **Link-rendered keys** — columns whose `key` matches a primary-name or lookup field (e.g. `'name'`, `'subject'`, `'fullname'`, `'currencyname'`, `'regardingobjectidname'`, `'owneridname'`, `'customeridname'`, `'businessunitidname'`) are rendered as Fluent UI `Link` elements by the `RecordLink` helper. The `render()` function is not called for those cells.
- **Fallback** — optional fields use the `?? '—'` pattern to display an em-dash when data is absent.

---

### `IColumn<T>`

```ts
export interface IColumn<T> {
  key: string
  label: string
  render: (item: T) => string
}
```

| Property | Type | Description |
|---|---|---|
| `key` | `string` | Unique column identifier. Used as the React `key` prop and matched against special render overrides in `DataverseTable`. |
| `label` | `string` | Human-readable column header shown in the table `<th>`. |
| `render` | `(item: T) => string` | Returns the plain-text display value for a row. Overridden for link and resolved-name columns at render time. |

**Example**

```ts
import type { IColumn } from '../tools'
import type { Accounts } from '../generated/models/AccountsModel'

const nameColumn: IColumn<Accounts> = {
  key: 'name',
  label: 'Account Name',
  render: (account) => account.name ?? '—',
}
```

---

### Column arrays

Each array is typed as `IColumn<EntityType>[]` and exported for direct consumption.

#### `accountColumns` — `IColumn<Accounts>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `name` | Account Name | Rendered as `RecordLink` (etn: `account`) |
| 2 | `telephone1` | Main Phone | |
| 3 | `address1_city` | Address 1: City | |
| 4 | `primarycontactidname` | Primary Contact | |
| 5 | `emailaddress1` | Email (Primary Contact) | |
| 6 | `statecode` | Status | Mapped via `Accountsstatecode` enum |
| 7 | `createdBy` | Created By | Replaced by `CreatedByLink` |
| 8 | `createdon` | Created On | Formatted with `toLocaleDateString()` |

#### `contactColumns` — `IColumn<Contacts>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `fullname` | Full Name | Rendered as `RecordLink` (etn: `contact`) |
| 2 | `emailaddress1` | Email | |
| 3 | `companyName` | Company Name | Sourced from `parentcustomeridname` |
| 4 | `telephone1` | Business Phone | |
| 5 | `statecode` | Status | Mapped via `Contactsstatecode` enum |
| 6 | `createdBy` | Created By | Replaced by `CreatedByLink` |
| 7 | `createdon` | Created On | Formatted with `toLocaleDateString()` |

#### `systemUserColumns` — `IColumn<Systemusers>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `fullname` | Full Name | Rendered as `RecordLink` (etn: `systemuser`) |
| 2 | `siteidname` | Site | |
| 3 | `businessunitidname` | Business Unit | Rendered as `RecordLink` (etn: `businessunit`) |
| 4 | `title` | Title | |
| 5 | `positionidname` | Position | |
| 6 | `address1_telephone1` | Main Phone | |

#### `businessUnitColumns` — `IColumn<Businessunits>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `name` | Name | Rendered as `RecordLink` (etn: `businessunit`) |
| 2 | `address1_telephone1` | Main Phone | |
| 3 | `websiteurl` | Website | |
| 4 | `parentbusinessunitidname` | Parent Business | Rendered as `RecordLink` (etn: `businessunit`) |

#### `appointmentColumns` — `IColumn<Appointments>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `subject` | Subject | Rendered as `RecordLink` (etn: `appointment`) |
| 2 | `regardingobjectidname` | Regarding | Rendered as `RecordLink` with dynamic etn from `regardingobjecttypecode` |
| 3 | `requiredattendees` | Required Attendees | |
| 4 | `prioritycode` | Priority | Mapped via `Appointmentsprioritycode` enum |
| 5 | `scheduledstart` | Start Time | Formatted with `toLocaleString()` |
| 6 | `scheduledend` | End Time | Formatted with `toLocaleString()` |
| 7 | `location` | Location | |
| 8 | `statecode` | Status | Mapped via `Appointmentsstatecode` enum |
| 9 | `owneridname` | Owner | Rendered as `RecordLink` with dynamic etn from `owneridtype` |

#### `emailColumns` — `IColumn<Emails>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `subject` | Subject | Rendered as `RecordLink` (etn: `email`) |
| 2 | `sender` | From | |
| 3 | `torecipients` | To | |
| 4 | `regardingobjectidname` | Regarding | Rendered as `RecordLink` with dynamic etn from `regardingobjecttypecode` |
| 5 | `prioritycode` | Priority | Mapped via `Emailsprioritycode` enum |
| 6 | `statuscode` | Status Reason | Mapped via `Emailsstatuscode` enum |
| 7 | `modifiedon` | Modified On | Formatted with `toLocaleDateString()` |

#### `leadColumns` — `IColumn<Leads>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `fullname` | Name | Rendered as `RecordLink` (etn: `lead`) |
| 2 | `subject` | Topic | |
| 3 | `owneridname` | Owner | Rendered as `RecordLink` with dynamic etn from `owneridtype` |
| 4 | `statuscode` | Status Reason | Mapped via `Leadsstatuscode` enum |
| 5 | `createdBy` | Created By | Replaced by `CreatedByLink` |
| 6 | `createdon` | Created On | Formatted with `toLocaleDateString()` |

#### `opportunityColumns` — `IColumn<Opportunities>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `name` | Topic | Rendered as `RecordLink` (etn: `opportunity`) |
| 2 | `customeridname` | Potential Customer | Rendered as `RecordLink` with dynamic etn from `customeridtype` |
| 3 | `emailaddress` | Email Address | |
| 4 | `statecode` | Status | Mapped via `Opportunitiesstatecode` enum |
| 5 | `actualclosedate` | Actual Close Date | Formatted with `toLocaleDateString()` |
| 6 | `actualvalue` | Actual Revenue | Formatted with `toLocaleString()` |
| 7 | `estimatedclosedate` | Est. Close Date | Formatted with `toLocaleDateString()` |
| 8 | `estimatedvalue` | Est. Revenue | Formatted with `toLocaleString()` |
| 9 | `opportunityratingcode` | Rating | Mapped via `Opportunitiesopportunityratingcode` enum |
| 10 | `closeprobability` | Probability | Rendered as `{value}%` |

#### `taskColumns` — `IColumn<Tasks>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `subject` | Subject | Rendered as `RecordLink` (etn: `task`) |
| 2 | `regardingobjectidname` | Regarding | Rendered as `RecordLink` with dynamic etn from `regardingobjecttypecode` |
| 3 | `owneridname` | Owner | Rendered as `RecordLink` with dynamic etn from `owneridtype` |
| 4 | `prioritycode` | Priority | Mapped via `Tasksprioritycode` enum |
| 5 | `scheduledend` | Due Date | Formatted with `toLocaleDateString()` |
| 6 | `statuscode` | Status Reason | Mapped via `Tasksstatuscode` enum |

#### `teamColumns` — `IColumn<Teams>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `name` | Team Name | Rendered as `RecordLink` (etn: `team`) |
| 2 | `businessunitidname` | Business Unit | Rendered as `RecordLink` (etn: `businessunit`) |

#### `transactionCurrencyColumns` — `IColumn<Transactioncurrencies>[]`

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | `currencyname` | Currency Name | Rendered as `RecordLink` (etn: `transactioncurrency`) |
| 2 | `isocurrencycode` | Currency Code | |
| 3 | `currencysymbol` | Currency Symbol | |
| 4 | `exchangerate` | Exchange Rate | Converted via `String()` |
| 5 | `currencyprecision` | Currency Precision | Converted via `String()` |

---

## `index.ts`

Public barrel that re-exports everything from `dataverseTable.consts.ts`. Consumers should always import from `'../tools'`, never from the internal file path directly.

```ts
import type { IColumn } from '../tools'
import {
  accountColumns,
  appointmentColumns,
  businessUnitColumns,
  contactColumns,
  emailColumns,
  leadColumns,
  opportunityColumns,
  systemUserColumns,
  taskColumns,
  teamColumns,
  transactionCurrencyColumns,
} from '../tools'
```

### Exported symbols

| Symbol | Kind | Description |
|---|---|---|
| `IColumn<T>` | `interface` | Column definition contract for a Dataverse entity table |
| `accountColumns` | `const` | Column definitions for the `account` entity |
| `appointmentColumns` | `const` | Column definitions for the `appointment` entity |
| `businessUnitColumns` | `const` | Column definitions for the `businessunit` entity |
| `contactColumns` | `const` | Column definitions for the `contact` entity |
| `emailColumns` | `const` | Column definitions for the `email` entity |
| `leadColumns` | `const` | Column definitions for the `lead` entity |
| `opportunityColumns` | `const` | Column definitions for the `opportunity` entity |
| `systemUserColumns` | `const` | Column definitions for the `systemuser` entity |
| `taskColumns` | `const` | Column definitions for the `task` entity |
| `teamColumns` | `const` | Column definitions for the `team` entity |
| `transactionCurrencyColumns` | `const` | Column definitions for the `transactioncurrency` entity |

---

## Adding a new entity

1. Add the new column array to `dataverseTable.consts.ts` following the existing pattern.
2. Add a named re-export to `index.ts` in alphabetical order.
3. Add a new render branch in `DataverseTable.tsx` that consumes the new array and applies `RecordLink` to the primary-name column.
4. Update this README with the new entity's column table.
