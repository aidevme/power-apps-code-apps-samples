# Metadata Implementation Guide

> Source: [How to: Get metadata for Dataverse tables](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/get-table-metadata)

## Overview

Table metadata contains customisations applied to tables in Dataverse, including localized labels when multiple languages are supported. Using metadata at runtime means the app adapts to customisation or localisation changes without code changes.

Use `getMetadata` on any generated service class to retrieve entity definitions, attributes, and relationships. It wraps the [Web API query metadata](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-metadata-web-api) capability with strong TypeScript types.

---

## API Signature

```ts
AccountsService.getMetadata(
  options?: GetEntityMetadataOptions<Account>
): Promise<IOperationResult<Partial<EntityMetadata>>>
```

**Prerequisite**: the app must be initialised via `pac code init` / `getClient(dataSourcesInfo)` and the generated service file imported before calling `getMetadata`.

---

## `GetEntityMetadataOptions` Parameter

```ts
interface GetEntityMetadataOptions {
  metadata?: Array<string>           // entity-level properties e.g. ["DisplayName","Privileges"]
  schema?: {
    columns?: 'all' | Array<string>  // column logical names e.g. ["name","telephone1"]
    oneToMany?: boolean
    manyToOne?: boolean
    manyToMany?: boolean
  }
}
```

| Field | Description |
|---|---|
| `metadata` | Entity-level properties — see [EntityMetadata properties](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/entitymetadata) |
| `schema.columns` | `"all"` or a list of column logical names — see [AttributeMetadata properties](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/attributemetadata). Note: derived-type properties (e.g. choice options) are **not** available |
| `schema.oneToMany` | Include `OneToManyRelationships` array ([OneToManyRelationshipMetadata](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/onetomanyrelationshipmetadata)) |
| `schema.manyToOne` | Include `ManyToOneRelationships` array |
| `schema.manyToMany` | Include `ManyToManyRelationships` array ([ManyToManyRelationshipMetadata](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/manytomanyrelationshipmetadata)) |

---

## Examples

### 1. Get user-localised labels for all columns

Retrieve display names in the user's language — use these to drive form labels, table headers, and accessibility text.

```ts
async function getColumnDisplayNames() {
  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  })

  const columnDisplayNames: Record<string, string> = {}
  if (data.Attributes) {
    for (const attr of data.Attributes) {
      const label = attr.DisplayName?.UserLocalizedLabel?.Label
      if (label) columnDisplayNames[attr.LogicalName] = label
    }
  }

  // Output: { "accountid": "Account", "name": "Account Name", ... }
  return columnDisplayNames
}
```

---

### 2. Identify required fields for form validation

Find attributes required on forms to build client-side validation rules from metadata instead of hard-coding.

```ts
async function getRequiredFields() {
  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  })
  if (!data.Attributes) return []

  return data.Attributes
    .filter(attr => attr.IsRequiredForForm)
    .map(attr => ({
      logicalName: attr.LogicalName,
      displayName: attr.DisplayName?.UserLocalizedLabel?.Label,
      attributeType: attr.AttributeTypeName?.Value,
    }))
  // Output: [
  //   { logicalName: "name", displayName: "Account Name", attributeType: "StringType" },
  //   { logicalName: "ownerid", displayName: "Owner", attributeType: "OwnerType" }
  // ]
}
```

---

### 3. Map column types for client-side validation

Get attribute types to inform UI control selection (date picker, money, choice) and consistent validation.

```ts
async function getColumnTypes() {
  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  })
  if (!data.Attributes) return []

  return data.Attributes.map(attr => ({
    logicalName: attr.LogicalName,
    attributeType: attr.AttributeTypeName?.Value,
  }))
  // Output: [
  //   { logicalName: "accountid", attributeType: "UniqueidentifierType" },
  //   { logicalName: "name",      attributeType: "StringType" },
  //   { logicalName: "revenue",   attributeType: "MoneyType" },
  //   { logicalName: "createdon", attributeType: "DateTimeType" }
  // ]
}
```

---

### 4. Discover lookup relationships (many-to-one)

Find which lookup fields point to other tables to dynamically build lookup UI and navigation.

```ts
async function getLookupRelationships() {
  const { data } = await AccountsService.getMetadata({
    metadata: ['LogicalName', 'DisplayName'],
    schema: { manyToOne: true }
  })
  if (!data.ManyToOneRelationships) return []

  return data.ManyToOneRelationships.map(rel => ({
    lookupField: rel.ReferencingAttribute,
    relatedTable: rel.ReferencedEntity,
    relatedTableAttribute: rel.ReferencedAttribute,
    relationshipName: rel.SchemaName,
  }))
  // Output: [
  //   { lookupField: "primarycontactid", relatedTable: "contact", ... },
  //   { lookupField: "ownerid",          relatedTable: "systemuser", ... }
  // ]
}
```

---

## Best Practices

| Practice | Reason |
|---|---|
| **Cache metadata** | Metadata calls can be heavy — cache at app start or per session |
| **Request only what you need** | Prefer a column list over `"all"` for performance |
| **Defensive access** | Check for property existence before accessing nested values: `DisplayName?.UserLocalizedLabel?.Label` |
| **Use TypeScript types** | Rely on generated types from the Dataverse Web API for safer, refactor-friendly code |

---

## TODO — Sample Implementation

- [ ] Create a `useTableMetadata` hook in `src/hooks/` that calls `getMetadata` and caches the result
- [ ] Add a `TableMetadataApp` component under `src/components/apps/` that renders column names, types, and required flags in a Fluent UI table
- [ ] Wire into `MainApp` as a new section card
- [ ] Expose via a new route `/metadata`
