# SharePoint Implementation Guide

> Source: [How to: SharePoint operations](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/sharepoint-operations)

## Overview

Use the `@microsoft/power-apps` client library to connect a code app to SharePoint and use the generated models and services to perform CRUD operations on SharePoint lists.

---

## Prerequisites

- [`@microsoft/power-apps`](https://www.npmjs.com/package/@microsoft/power-apps) client library
- PAC CLI version **1.50 or later**
- Connected to your environment via `pac auth create`

---

## Supported Scenarios

- Add SharePoint lists as data sources via `pac code add-data-source`
- Perform CRUD operations on a SharePoint list
- Get possible values for choice, lookup, or person/group columns

**Not supported**: Document Processing APIs, item synchronisation, permission changes. These require a custom service file.

---

## Step 1 — Add the SharePoint Data Source

Follow [Connect to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data) to add a SharePoint list. This generates two files per list, e.g. for `ChoicesTest1`:

| File | Purpose |
|---|---|
| `src/generated/models/ChoicesTest1Model.ts` | Data model for the list |
| `src/generated/services/ChoicesTest1Service.ts` | Service methods (CRUD + referenced entities) |

---

## Step 2 — Import the Generated Service

```ts
import { ChoicesTest1Service } from './generated/services/ChoicesTest1Service'
import type { ChoicesTest1 } from './generated/models/ChoicesTest1Model'
```

---

## CRUD Operations

### Read all records

```ts
const loadRecords = async () => {
  try {
    const result = await ChoicesTest1Service.getAll()
    if (result.data) {
      setRecords(result.data) // result.data is ChoicesTest1[]
    }
  } catch (err) {
    // handle error
  }
}
```

### Read a single record

```ts
const fetchOne = async (id: string) => {
  const r = await ChoicesTest1Service.get(id)
  if (r.data) {
    // r.data is typed as ChoicesTest1
  }
}
```

### Create a record

> **Important**: Generated models may include internal properties with `#` (e.g. `Choices1#Id`). **Never include these in the payload** — they are for binding only. Instead pass expanded objects for choice, lookup, and person/group columns.

```ts
// 1. Map selected IDs to expanded objects
const choices1Obj = selectedChoices1Id
  ? choices1Options.find(c => c.Id === selectedChoices1Id)
  : undefined

const personObj = selectedPersonClaims
  ? personOptions.find(p => p.Claims === selectedPersonClaims)
  : undefined

const lookupObj = selectedLookupId
  ? lookupOptions.find(l => l.Id === selectedLookupId)
  : undefined

// 2. Build payload — omit "#" properties, include expanded objects
const contentTypeId = '0x0100...' // replace with your content type ID

const payload = {
  Title: titleValue,
  Choices1: choices1Obj,
  Choices2: choices2Obj,
  Choices3: choices3Obj,
  person: personObj,
  yesno: yesnoBoolean,
  lookup: lookupObj,
  '{ContentType}': {
    '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedContentType',
    Id: contentTypeId,
    Name: 'Item',
  },
} as Partial<Omit<ChoicesTest1, 'ID'>>

// 3. Create
const created = await ChoicesTest1Service.create(payload as Omit<ChoicesTest1, 'ID'>)
if (created.data) {
  // success
}
```

### Update a record

Use `update(id, payload)` — same rules apply (expanded objects, no `#` properties):

```ts
const updatePayload = {
  Title: updatedTitle,
  Choices1: updatedChoices1Obj,
  // ...
} as Partial<Omit<ChoicesTest1, 'ID'>>

await ChoicesTest1Service.update(recordId, updatePayload)
```

### Delete a record

`recordId` is the string item ID (often a numeric ID converted to string):

```ts
await ChoicesTest1Service.delete(recordId)
```

---

## Referenced Entities — Choices / Lookup / Person

To populate dropdowns, call `getReferencedEntity()`. The first parameter is a search term, the second is the referenced entity name.

> **Note**: Some connectors return `{ value: [] }`, others return the array directly — normalise defensively.

```ts
const res = await ChoicesTest1Service.getReferencedEntity('', 'Choices1')

// Normalise
const dataArray = (res.data as { value?: unknown[] })?.value ?? res.data
const options = Array.isArray(dataArray) ? dataArray : []

// Map to select options
const selectOpts = options.map(o => ({ id: o.Id, label: o.Value }))
```

---

## Unsupported Scenarios

The PAC CLI and client library do **not** support:

- Document Processing APIs
- Item synchronisation
- Permission changes

Add these by creating a custom service file in your project.

---

## TODO — Sample Implementation

- [ ] Add a SharePoint list as a data source via `pac code add-data-source`
- [ ] Create a `useSharePointList` hook in `src/hooks/` with `getAll`, `create`, `update`, `delete`, and `getChoiceOptions`
- [ ] Add a `SharePointApp` component under `src/components/apps/` that renders list items with a create/edit form
- [ ] Handle choice/lookup/person columns with `getReferencedEntity` in the hook
- [ ] Wire into `MainApp` as a new section card
- [ ] Expose via a new route `/sharepoint`
