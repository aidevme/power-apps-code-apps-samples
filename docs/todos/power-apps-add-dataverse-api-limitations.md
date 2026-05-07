# Limitations of `power-apps add-dataverse-api`

> **Status**: Open  
> **Affects**: `src/dataverse-actions-functions-power-automate-flows-samples`  
> **Discovered**: 2026-05-04

---

## Overview

The `power-apps add-dataverse-api` command is part of the `@microsoft/power-apps` local dev toolchain. It inspects a Dataverse Custom API or SDK message by name, fetches its metadata from the target environment, and generates:

- A typed service class under `src/generated/services/`
- A data source entry in `.power/schemas/appschemas/dataSourcesInfo.ts`
- A barrel export in `src/generated/index.ts`

This works reliably for simple APIs whose parameters map to Dataverse entity (table) types. It breaks down in several documented scenarios below.

---

## Limitation 1 — `npx` Only Works from Inside the Sample Folder

### Problem

Running `npx power-apps` from the **repository root** fails because there is no `@microsoft/power-apps` installed there:

```powershell
# ❌ Fails — run from repo root where the package is not installed
npx power-apps add-dataverse-api --api-name WhoAmI
# Error: package not found
```

### Root Cause

The `power-apps` CLI is **not published to the public npm registry**. It ships as a local `devDependency` inside `@microsoft/power-apps` and only exists in the sample's own `node_modules/.bin/`. `npx` resolves `node_modules/.bin` relative to the current directory, so it only works when run from inside the sample folder.

### Workaround

Always run from inside the sample folder:

```powershell
# ✅ Works — cwd is the sample folder
cd src\dataverse-actions-functions-power-automate-flows-samples
npx power-apps add-dataverse-api --api-name <ApiName>
```

Or use the explicit binary path from any directory:

```powershell
& "C:\<repo-root>\src\<sample-name>\node_modules\.bin\power-apps.cmd" add-dataverse-api --api-name <ApiName>
```

> **Note**: `npm run` scripts (e.g., adding a `"add-api"` script to `package.json`) also resolve `node_modules/.bin` correctly and are a cleaner alternative.

---

## Limitation 2 — Fails for APIs with Enum or Complex Non-Table Parameter Types

### Problem

Running the command for `RetrieveAllEntities` fails with a 404:

```powershell
.\node_modules\.bin\power-apps.cmd add-dataverse-api --api-name RetrieveAllEntities
# Failed to get entity definition for table 'EntityFilters' from organization
# 'https://<env>.api.crm.dynamics.com':
# HTTP error status: 404 for GET .../EntityDefinitions(LogicalName='EntityFilters')...
```

### Root Cause

The code generator resolves each parameter type by querying the Dataverse `EntityDefinitions` endpoint — it assumes every parameter type is a Dataverse table (entity). `RetrieveAllEntities` takes an `EntityFilters` parameter which is an **OData enum** (`Microsoft.Dynamics.CRM.EntityFilters`), not a table. The `EntityDefinitions` lookup returns 404, and the generator aborts.

### Affected API Categories

Any SDK message or Custom API whose parameters include:

| Category | Examples |
|---|---|
| OData enums | `EntityFilters`, `EntityRole`, `CascadeType` |
| Primitive scalars typed as named types | `BooleanManagedProperty`, `Label` |
| Complex types with no backing table | `AttributeMetadata`, `RelationshipMetadata` |
| Messages with no parameters at all that the generator still interrogates | Some metadata messages |

### Workaround A — Raw `fetch` (Recommended for Metadata APIs)

For read-only metadata functions like `RetrieveAllEntities`, use a plain authenticated `fetch` against the Web API endpoint. Authentication is handled transparently by the Power Apps connector:

```typescript
const DATAVERSE_API = '/api/data/v9.2';

export async function retrieveAllEntities(entityFilters = 'Entity') {
  const url = `${DATAVERSE_API}/RetrieveAllEntities(EntityFilters=@p1,RetrieveAsIfPublished=@p2)?@p1=Microsoft.Dynamics.CRM.EntityFilters'${entityFilters}'&@p2=false`;
  const response = await fetch(url, {
    headers: {
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<{ EntityMetadata: Record<string, unknown>[] }>;
}
```

### Workaround B — Manual Service File

For POST actions that benefit from a typed interface, manually create the service following the same pattern as auto-generated files. Required steps:

1. **Add a data source entry** to `.power/schemas/appschemas/dataSourcesInfo.ts`:

```typescript
"retrieveallentities": {
  "tableId": "", "version": "", "primaryKey": "",
  "dataSourceType": "Dataverse",
  "apis": {
    "RetrieveAllEntities": {
      "path": "/api/data/v9.2/RetrieveAllEntities",
      "method": "GET",
      "parameters": [
        { "name": "EntityFilters", "in": "query", "required": false, "type": "string" },
        { "name": "RetrieveAsIfPublished", "in": "query", "required": false, "type": "boolean" }
      ],
      "responseInfo": { "200": { "type": "object" } }
    }
  }
}
```

2. **Create `src/generated/services/RetrieveAllEntitiesService.ts`** following the pattern of `WhoAmIService.ts` (GET, no request body) or `AddToQueueService.ts` (POST, body via `dataverseRequest.parameters.body`).

3. **Export from `src/generated/index.ts`**:

```typescript
export * from './services/RetrieveAllEntitiesService';
```

> **Important**: The `dataSourcesInfo.ts` file header says "do not modify" because it is auto-generated in normal workflows, but manual additions are safe as long as the `power-apps` CLI does not regenerate the file (it only appends, it does not overwrite existing entries).

---

## Limitation 3 — Wrong Tenant on First Run

### Problem

On the first run after `npm install`, `power-apps` may open a browser login that defaults to the wrong Microsoft 365 tenant, generating tokens for the wrong environment.

### Workaround

```powershell
.\node_modules\.bin\power-apps.cmd logout
# Re-run the command — a fresh browser login will appear
.\node_modules\.bin\power-apps.cmd add-dataverse-api --api-name <ApiName>
```

Ensure you log in with the account that has access to the target Dataverse environment.

---

## Limitation 4 — Custom API Schema Files Are Placed in the Entity Table Folder

### Problem

When `npx power-apps add-dataverse-api` generates a service for a Custom API (e.g. `WhoAmI`), it writes its schema file to `.power/schemas/dataverse/WhoAmI.Schema.json` — the same folder that `pac code add-data-source` scans when adding entity table data sources.

The result: running `pac code add-data-source` later fails with:

```
An unexpected error occurred: Error processing file
'.power/schemas/dataverse/WhoAmI.Schema.json':
The JSON does not represent a valid data source.
```

### Root Cause

Both CLIs use `.power/schemas/dataverse/` as their output folder, but for different schema formats:

| CLI | Schema type written | Format |
|---|---|---|
| `npx power-apps add-dataverse-api` | Custom API (function/action) | Custom JSON — **not** a valid table data source |
| `pac code add-data-source` | Entity table | Standard Dataverse entity schema |

`pac` reads and validates **every** `.Schema.json` file in `.power/schemas/dataverse/` and rejects any file that does not match the entity table format.

### Workaround

Temporarily move the Custom API schema files out of the `dataverse/` folder before running `pac code add-data-source`, then restore them:

```powershell
# Move custom API schemas out
Move-Item ".power\schemas\dataverse\WhoAmI.Schema.json" ".power\schemas\WhoAmI.Schema.json.bak"

# Run pac safely
pac code add-data-source -a dataverse -t <table-logical-name>

# Restore
Move-Item ".power\schemas\WhoAmI.Schema.json.bak" ".power\schemas\dataverse\WhoAmI.Schema.json"
```

### Long-Term Fix

Move all Custom API schema files into a separate folder (e.g. `.power/schemas/customapis/`) so they are never scanned by `pac`. The `npx power-apps` tooling does not enforce the output location — only the generated TypeScript service imports from `dataSourcesInfo.ts`, not from the schema file path.

---

## Limitation 5 — `IOperationResult.value` Does Not Exist

### Problem

The auto-generated services (and documentation examples online) sometimes reference `result.value`, which does not exist on `IOperationResult<T>`:

```typescript
// ❌ Compile error: Property 'value' does not exist on type 'IOperationResult<...>'
console.log(result.value.UserId);
```

### Root Cause

`IOperationResult<TResponse>` (from `@microsoft/power-apps/data`) exposes the response on the **`data`** property, not `value`:

```typescript
interface IOperationResult<TResponse> {
  success: boolean;
  data: TResponse;       // ← correct property
  error?: Error | PowerDataRuntimeHttpError;
  skipToken?: string;
  count?: number;
}
```

### Fix

```typescript
// ✅ Correct
console.log(result.data.UserId);
```

---

## Summary Table

| # | Limitation | Severity | Workaround Available |
|---|---|---|---|
| 1 | `npx` only works from inside the sample folder | Blocking from repo root | `cd` into sample folder first |
| 2 | Enum/complex parameter types cause 404 | Blocking for affected APIs | Raw `fetch` or manual service file |
| 3 | Wrong tenant on first login | Blocking until resolved | `logout` then re-authenticate |
| 4 | Custom API schemas placed in entity table folder | Breaks `pac code add-data-source` | Temporarily move files before running `pac` |
| 5 | `result.value` does not exist | Compile error | Use `result.data` |

---

## Related Files

- [src/generated/services/AddToQueueService.ts](../../src/dataverse-actions-functions-power-automate-flows-samples/src/generated/services/AddToQueueService.ts) — example of a manually created POST action service
- [src/generated/services/WhoAmIService.ts](../../src/dataverse-actions-functions-power-automate-flows-samples/src/generated/services/WhoAmIService.ts) — example of an auto-generated GET function service
- [.power/schemas/appschemas/dataSourcesInfo.ts](../../src/dataverse-actions-functions-power-automate-flows-samples/.power/schemas/appschemas/dataSourcesInfo.ts) — data source registry, manually extended for `AddToQueue`
