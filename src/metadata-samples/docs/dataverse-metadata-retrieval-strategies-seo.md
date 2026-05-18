# Dataverse Metadata Retrieval Strategies for Power Apps Code Apps: The Complete Guide

> **Audience:** Power Platform developers & solution architects
> **Level:** Intermediate to advanced
> **Published:** May 2026

---

## WordPress Metadata

**Categories:**
- Power Platform
- Microsoft Dataverse
- Power Apps
- Developer Tools
- Architecture & Best Practices

**Tags:**
- Dataverse metadata
- Power Apps Code Apps
- EntityDefinitions
- RetrieveMetadataChanges
- prvReadEntity
- Static JSON bundle
- Azure Function proxy
- localStorage cache
- Dataverse API
- TypeScript Power Apps
- Power Platform performance
- Dataverse schema
- Code Apps architecture
- Dataverse Web API
- Power Platform development

**SEO Title:** Dataverse Metadata Retrieval Strategies for Power Apps Code Apps (2026)

**Slug:** dataverse-metadata-retrieval-strategies-power-apps-code-apps

**Meta Description:** Compare every Dataverse metadata retrieval strategy for Power Apps Code Apps — from direct API calls to static JSON bundles and Azure Function proxies. Covers performance, cost, prvReadEntity permissions, and when to use each approach.

**Focus Keyword:** Dataverse metadata retrieval strategies

**Secondary Keywords:** Power Apps Code Apps metadata, EntityDefinitions API, RetrieveMetadataChanges, prvReadEntity, static JSON bundle Power Apps

**Excerpt:**
Retrieving Dataverse entity metadata in Power Apps Code Apps is an architectural decision that surfaces as a Monday-morning incident when 150 users open your app simultaneously. This guide compares every realistic strategy — direct runtime calls, in-memory cache, delta sync with localStorage, static JSON bundles, Azure Function proxies, and hybrid patterns — across seven dimensions: performance, cost, code complexity, security posture, multi-user scalability, and the `prvReadEntity` permission requirement that silently breaks standard user deployments. Includes a decision tree, side-by-side comparison table, and a recommended starting point for production apps in 2026.

---

## Table of Contents

- [Why Metadata Retrieval Deserves a Strategy](#why-metadata-retrieval-deserves-a-strategy)
- [What Microsoft Recommends](#what-microsoft-recommends)
- [The Six Strategies](#the-six-strategies)
  - [Strategy 1: Direct Runtime Retrieval (No Cache)](#strategy-1--direct-runtime-retrieval-no-cache)
  - [Strategy 2: Runtime Retrieval with In-Memory Cache](#strategy-2--runtime-retrieval-with-in-memory-cache)
  - [Strategy 3: RetrieveMetadataChanges + localStorage (Delta Sync)](#strategy-3--retrievemetadatachanges--localstorage-delta-sync)
  - [Strategy 4: Static JSON Bundle (Build-Time Snapshot)](#strategy-4--static-json-bundle-build-time-snapshot)
  - [Strategy 5: Azure Function as Metadata Proxy](#strategy-5--azure-function-as-metadata-proxy-shared-server-side-cache)
  - [Strategy 6: Hybrid (Static JSON + Selective Live Refresh)](#strategy-6--hybrid-static-json--selective-live-refresh)
- [Side-by-Side Comparison](#side-by-side-comparison)
- [Decision Tree](#decision-tree)
- [Key Platform Constraints to Remember](#key-platform-constraints-to-remember)
- [Recommended Starting Point](#recommended-starting-point)
- [Frequently Asked Questions](#frequently-asked-questions)
- [References](#references)

---

## Why Metadata Retrieval Deserves a Strategy

Power Apps Code Apps are different from Canvas Apps. You write TypeScript, you control the lifecycle, and you own the performance characteristics of your application. When your app needs entity metadata — attribute types, display names, option set values, required fields — you have a genuine architectural decision to make.

The wrong choice isn't always obvious at development time. It surfaces at 9 AM on a Monday when 150 users open the app simultaneously, or when a standard user gets a silent 403, or when your Azure bill arrives and you realize your metadata proxy is running around the clock.

This article walks through every realistic retrieval strategy, comparing them across seven dimensions: how they work, their performance profile, code complexity, cost, security posture, multi-user scalability, and when to actually use them.

---

## What Microsoft Recommends

Before comparing approaches, it is worth anchoring to what Microsoft's own documentation recommends.

The [Power Apps Code Apps documentation](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/get-table-metadata) (March 2026) states plainly: *"Cache at app start or per session. Request only what you need."*

The [Cache Schema Data article](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/cache-schema-data) (February 2026) goes further, recommending `RetrieveMetadataChanges` as the preferred mechanism for maintaining a metadata cache — not raw `EntityDefinitions` polling. The function returns a `ServerVersionStamp` that enables delta sync: on subsequent calls, only changed schema data is returned instead of the full payload, keeping subsequent requests to 0.1–0.2 seconds even for large schemas.

This is the foundation every strategy in this article builds on.

---

## The Six Strategies

### Strategy 1 — Direct Runtime Retrieval (No Cache)

The simplest possible approach: call `EntityDefinitions` or `getMetadata` every time metadata is needed.

```typescript
// Direct call on every need — no caching
export async function getEntityMetadata(
  entityName: string
): Promise<EntityMetadata> {
  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  });
  return data;
}
```

**How it works:** Every component mount or metadata-dependent operation triggers a fresh Web API call directly to Dataverse from the browser.

**Performance:** 500ms–2s per call depending on entity size, network conditions, and whether the Dataverse instance is warm. For 10 entities fetched sequentially, this is 5–20 seconds of blocking load time.

**Code complexity:** Minimal. No infrastructure, no build steps, no cache management.

**Cost:** Zero infrastructure cost. However, each call consumes Dataverse API quota — 6,000 requests per user per 5-minute window, and daily entitlement limits tied to license type (6,000/day for per-app licenses, 40,000/day for per-user).

**Security:** No additional requirements beyond standard app user credentials — as long as the user holds `prvReadEntity` on the Customization tab of their security role. Standard business user roles do not include this privilege by default, making this approach likely to silently fail in production.

**Multi-user scalability:** Poor. Every user session triggers independent fetches. 100 users opening the app simultaneously generates 100 × N entity requests in seconds, with no sharing possible at the browser level.

**Verdict:** Acceptable only for internal developer tooling or proof-of-concept scenarios where the authenticated user is always a System Customizer.

---

### Strategy 2 — Runtime Retrieval with In-Memory Cache

The standard first improvement: cache the fetched metadata in a module-level Map for the duration of the session.

```typescript
const _cache = new Map<string, EntityMetadata>();

export async function getEntityMetadata(
  entityName: string
): Promise<EntityMetadata> {
  if (_cache.has(entityName)) return _cache.get(entityName)!;

  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  });
  _cache.set(entityName, data);
  return data;
}

// Parallel preload at app startup
export async function preloadMetadata(entityNames: string[]): Promise<void> {
  await Promise.all(entityNames.map(getEntityMetadata));
}
```

**How it works:** First access triggers a live fetch; subsequent accesses within the same browser tab return the cached value instantly.

**Performance:** First call: 500ms–2s per entity (parallel with `Promise.all`). Subsequent calls within the session: sub-millisecond. The cache is lost on page refresh, tab close, or component unmount.

**Code complexity:** Low. Roughly 15 lines of utility code.

**Cost:** Same Dataverse API quota consumption as Strategy 1 for the first load. Zero additional infrastructure.

**Security:** Same `prvReadEntity` requirement. Same failure mode for standard users.

**Multi-user scalability:** Still poor. In-memory cache is per-browser-tab — it is not shared across users or even across tabs of the same user. Every session cold start triggers full API consumption.

**Verdict:** A reasonable improvement over Strategy 1 for low-user-count internal tools, but the permission requirement and per-session fetch still limit its applicability.

---

### Strategy 3 — Runtime Retrieval with `RetrieveMetadataChanges` + `localStorage`

This is the most sophisticated pure-runtime approach, using Microsoft's officially recommended function combined with browser persistence to survive page refreshes.

```typescript
const CACHE_KEY = 'aidevme_metadata_cache';

interface LocalCache {
  serverVersionStamp: string;
  entities: Record<string, EntityMetadata>;
}

export async function getMetadataWithDeltaSync(
  entityNames: string[]
): Promise<Record<string, EntityMetadata>> {
  const stored = getFromLocalStorage();

  const query = buildEntityQueryExpression(entityNames);

  // If we have a cached version, ask only for changes since then
  const url = stored
    ? buildDeltaUrl(query, stored.serverVersionStamp)
    : buildInitialUrl(query);

  const response = await fetch(url, { headers: dataverseHeaders() });
  const result = await response.json();

  // Merge changes into existing cache
  const merged = mergeMetadataChanges(stored?.entities ?? {}, result);

  saveToLocalStorage({
    serverVersionStamp: result.ServerVersionStamp,
    entities: merged
  });

  return merged;
}
```

**How it works:** On first load, a full metadata fetch is performed and stored in `localStorage` with the `ServerVersionStamp`. On subsequent loads — including page refreshes — only changes since the last stamp are fetched, which in practice returns nothing most of the time, completing in 0.1–0.2 seconds.

**Performance:** First load: 500ms–2s. Every subsequent load (even after refresh): 100–200ms. This is the closest a runtime approach gets to static JSON load times.

**Code complexity:** High. You must build the `EntityQueryExpression` query object, handle the multipart delta response, manage `localStorage` writes, handle the `ExpiredVersionStamp` error (thrown when the stamp is older than the 90-day change retention window), and implement LZ-string compression to stay within the 5MB `localStorage` limit (which Dynamics 365 already partially uses).

**Cost:** After the first load, Dataverse API consumption drops to near zero — the delta check counts as one request regardless of how many entities are tracked. No infrastructure cost.

**Security:** Still requires `prvReadEntity`. Still fails silently for standard users without the privilege.

**Multi-user scalability:** Better than Strategy 2 — the `localStorage` cache survives refreshes, so repeat visits within the same browser do not re-consume quota. But each user still performs their own first-load fetch, and there is no sharing across users.

**Verdict:** The best runtime-only approach for applications where schema changes need to be reflected immediately. Suitable when your user population has the required security role. Not suitable for wide enterprise deployment where users hold standard business roles.

---

### Strategy 4 — Static JSON Bundle (Build-Time Snapshot)

A fundamentally different model: metadata is captured at build time and shipped as a static JSON asset inside the app bundle.

```typescript
// assets/metadata/metadata.json — generated by CI/CD, never edited manually
import staticMetadata from '../assets/metadata/metadata.json';

interface MetadataBundle {
  version: string;
  generatedAt: string;
  environment: string;
  entities: Record<string, EntityMetadata>;
}

const bundle: MetadataBundle = staticMetadata;

export function getEntityMetadata(entityName: string): EntityMetadata {
  const meta = bundle.entities[entityName];
  if (!meta) throw new Error(`Metadata not found for entity: ${entityName}`);
  return meta;
}
```

```typescript
// scripts/generateMetadata.ts — runs in CI/CD, not at runtime
const ENTITIES = ['account', 'contact', 'opportunity', 'systemuser'];

async function generate() {
  const entities: Record<string, unknown> = {};
  for (const name of ENTITIES) {
    entities[name] = await fetchMetadataFromDataverse(name);
  }

  writeFileSync('./src/assets/metadata/metadata.json', JSON.stringify({
    version: pkg.version,
    generatedAt: new Date().toISOString(),
    environment: process.env.SOURCE_ENVIRONMENT,
    entities
  }, null, 2));
}
```

**How it works:** A generator script runs during development or in a CI/CD pipeline against a reference environment (typically dev or staging), writes the metadata to a JSON file, and that file is bundled into the app artifact. At runtime, the app imports it as a static module — no network calls required.

**Performance:** Effectively zero. The JSON is loaded as part of the JavaScript module graph, available before the first React render. Sub-millisecond access for every entity lookup throughout the app lifetime.

**Code complexity:** Low at runtime (a simple import and typed accessor). Medium at build time — you need a generator script and a CI/CD step to keep the snapshot fresh.

**Cost:** Zero runtime infrastructure. Zero API quota at runtime. The generator script runs under a service account in CI/CD — not under end user entitlements.

**Security:** No `prvReadEntity` required at runtime. End users need only standard data access permissions. The security surface is effectively zero.

**Multi-user scalability:** Perfect. The metadata is a static file served from the CDN with the app. 1 user and 10,000 users have identical load characteristics.

**Limitations:** Schema changes require a redeployment. The snapshot reflects the state of the reference environment at build time — if your dev, test, and production schemas diverge, the snapshot may not be accurate for all environments. Cannot access choice column option values through the Code Apps `getMetadata` function regardless of approach (this is a platform limitation for derived attribute types).

**Verdict:** The recommended baseline for most production Code Apps. Zero runtime cost, zero permission complexity, zero scalability concerns.

---

### Strategy 5 — Azure Function as Metadata Proxy (Shared Server-Side Cache)

For scenarios requiring runtime freshness without per-user API calls, an Azure Function acts as a shared proxy between the Code App and Dataverse.

```
Code App (all users) → Azure Function → [shared cache] → Dataverse
                                                ↑
                              (Dataverse called once per TTL,
                               regardless of concurrent users)
```

```typescript
// Azure Function — TypeScript, Flex Consumption plan
import { app } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

const blobClient = BlobServiceClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING!
);
const container = blobClient.getContainerClient('metadata-cache');
const TTL_MS = 60 * 60 * 1000; // 1 hour

app.http('getMetadata', {
  methods: ['GET'],
  authLevel: 'function',
  handler: async (req, ctx) => {
    const entityName = req.query.get('entity');
    if (!entityName) return { status: 400, body: 'entity parameter required' };

    // L1: Blob Storage cache (shared across all Function instances)
    const blob = container.getBlockBlobClient(`${entityName}.json`);
    try {
      const download = await blob.downloadToBuffer();
      const entry = JSON.parse(download.toString());
      if (Date.now() - entry.cachedAt < TTL_MS) {
        return { status: 200, jsonBody: entry.data };
      }
    } catch { /* cache miss */ }

    // L2: Live Dataverse fetch (runs under Managed Identity)
    const metadata = await fetchFromDataverse(entityName);
    await blob.upload(
      JSON.stringify({ cachedAt: Date.now(), data: metadata }),
      Buffer.byteLength(JSON.stringify({ cachedAt: Date.now(), data: metadata }))
    );

    return { status: 200, jsonBody: metadata };
  }
});
```

**How it works:** The Function holds the metadata in Blob Storage (or Redis for sub-millisecond latency requirements). All users share the same cached response. The Dataverse fetch happens at most once per TTL window — typically once per hour — regardless of concurrent user count.

**Performance:** Cache hit: 50–100ms (Blob Storage round trip) or <5ms (Redis). Cache miss: 500ms–1s (Dataverse fetch + write). Cold start on Consumption plan: 200–800ms additional latency on first invocation after idle period.

**Code complexity:** High. Requires authoring and deploying an Azure Function, configuring Managed Identity, setting up Blob Storage or Redis, handling cache invalidation, and managing CORS for browser-originated requests from the Code App.

**Cost (Flex Consumption plan):**
- Free grant: 250,000 executions/month and 100,000 GB-seconds/month
- After free grant: $0.000026 per GB-second execution time, $0.40 per million executions
- For a metadata proxy serving 1,000 users/day with 1-hour TTL: roughly 30 Dataverse fetches/day (one per entity per TTL window) plus user-facing cache hits. For typical metadata payload sizes and execution durations, monthly cost after free grant is effectively **$0 for small-to-medium deployments**
- Blob Storage: fractions of a cent per GB per month — negligible for metadata JSON files
- Redis (if used): Basic C0 tier ~$16/month, Standard C1 ~$40/month. Note that Azure Cache for Redis Basic/Standard/Premium tiers are retiring September 30, 2028 — Azure Managed Redis is the replacement. For metadata caching, Blob Storage is almost always sufficient and far cheaper.

**Security:** The Function authenticates to Dataverse using Managed Identity — no credentials in code or configuration. End users call the Function endpoint with a function key or Entra ID token, never touching Dataverse directly. The `prvReadEntity` requirement is moved from the end user to the Function's Managed Identity service account. This is the cleanest permission model of all runtime approaches.

**Multi-user scalability:** Excellent. Dataverse API consumption is decoupled from user count. 1,000 simultaneous users generate the same number of Dataverse calls as 1 user.

**Verdict:** The right choice when runtime freshness is a hard requirement, users hold standard security roles without `prvReadEntity`, and the team has Azure infrastructure experience. Adds meaningful operational complexity — only justified when the simpler approaches are genuinely insufficient.

---

### Strategy 6 — Hybrid (Static JSON + Selective Live Refresh)

The recommended production pattern for most real-world Code Apps: static JSON as the primary source, with a controlled live refresh path for administrators or after schema deployments.

```typescript
import staticMetadata from '../assets/metadata/metadata.json';

const _runtimeOverrides = new Map<string, EntityMetadata>();
const STORAGE_KEY = 'aidevme_meta_override';
const TTL_MS = 60 * 60 * 1000;

export async function getEntityMetadata(
  entityName: string,
  forceRefresh = false
): Promise<EntityMetadata> {
  // L1: Runtime override (refreshed this session by an admin action)
  if (!forceRefresh && _runtimeOverrides.has(entityName)) {
    return _runtimeOverrides.get(entityName)!;
  }

  // L2: sessionStorage (survives component remounts, not tab close)
  if (!forceRefresh) {
    const stored = tryGetFromSession(entityName);
    if (stored) return stored;
  }

  // L3: Static bundle — always available, zero network
  if (!forceRefresh && staticMetadata.entities[entityName]) {
    return staticMetadata.entities[entityName] as EntityMetadata;
  }

  // L4: Live fetch — only on explicit forceRefresh or unknown entity
  // Requires prvReadEntity — document this clearly
  const { data } = await AccountsService.getMetadata({
    schema: { columns: 'all' }
  });
  _runtimeOverrides.set(entityName, data);
  saveToSession(entityName, data);
  return data;
}
```

**How it works:** The static bundle handles 99% of requests. An explicit `forceRefresh` flag — typically surfaced as an admin-only "Reload schema" button — triggers a live fetch for the current session. This covers the scenario where a schema change has been deployed and an administrator needs the updated metadata immediately without a full redeployment.

**Performance:** L1/L2/L3: sub-millisecond. L4: 500ms–2s, triggered only by explicit admin action.

**Code complexity:** Medium. Slightly more than pure static JSON, but far less than the Azure Function approach. The generator script adds a CI/CD step.

**Cost:** Zero runtime infrastructure. API quota consumed only on explicit `forceRefresh` invocations by administrators who hold `prvReadEntity`.

**Security:** Standard users use L1–L3 exclusively — no `prvReadEntity` required. The L4 path is an opt-in action documented as requiring elevated privileges.

**Multi-user scalability:** Same as static JSON — perfect.

**Verdict:** The recommended default for most Code Apps. The static bundle handles normal operations; the live refresh path covers the edge case of immediate schema update propagation without redeployment.

---

## Side-by-Side Comparison

| | **Direct (No Cache)** | **In-Memory Cache** | **Delta Sync + localStorage** | **Static JSON** | **Azure Function Proxy** | **Hybrid** |
|---|---|---|---|---|---|---|
| **Cold start latency** | 500ms–2s per entity | 500ms–2s (first only) | 500ms–2s (first), 100–200ms after | ~0ms | 50–100ms (cache hit) | ~0ms |
| **Repeat request latency** | 500ms–2s every time | <1ms | <1ms (in-session) | <1ms | 50–100ms | <1ms |
| **Survives page refresh** | No | No | ✅ Yes | ✅ Yes (bundle) | ✅ Yes | ✅ Yes |
| **Dataverse API calls (100 users)** | 100 × N | 100 × N (cold) | 100 (first load only) | 0 | ~1 per TTL window | 0 (standard path) |
| **`prvReadEntity` required** | ✅ All users | ✅ All users | ✅ All users | ❌ None | ❌ Users (Function only) | ❌ Standard users |
| **Schema drift risk** | None | None | None | On redeployment | On TTL expiry | On redeployment |
| **Reflects schema changes** | Immediately | Immediately | On next delta check | On redeployment | Within TTL | Admin `forceRefresh` |
| **Code complexity** | Very low | Low | High | Medium (generator) | Very high | Medium |
| **Infrastructure required** | None | None | None | None | Azure Function + Blob/Redis | None |
| **Monthly cost (typical)** | $0 | $0 | $0 | $0 | ~$0–$16 | $0 |
| **Multi-user at scale** | ❌ Poor | ❌ Poor | ⚠️ Moderate | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **Offline capable** | ❌ | ❌ | ⚠️ Partial | ✅ | ❌ | ✅ |
| **Best for** | Dev/PoC | Internal tools | Admin tools, low user count | Production apps | Admin tools, real-time needs | Most production scenarios |

---

## Decision Tree

Use this decision tree to select the right strategy for your Power Apps Code App deployment:

```
Does the app run for standard business users
without System Customizer role?
│
├─ YES → Can you tolerate redeployment to reflect schema changes?
│         │
│         ├─ YES → Static JSON or Hybrid ✅ (recommended)
│         │
│         └─ NO → Do you have Azure infrastructure available?
│                   │
│                   ├─ YES → Azure Function Proxy
│                   └─ NO  → Delta Sync + localStorage
│                             (document prvReadEntity for first-run setup)
│
└─ NO (all users are admins / System Customizers)
          │
          └─ Is schema freshness critical without redeployment?
                    │
                    ├─ YES → Delta Sync + localStorage or In-Memory Cache
                    └─ NO  → Static JSON (simplest, fastest)
```

---

## Key Platform Constraints to Remember

**The `prvReadEntity` gap.** Any runtime call to `EntityDefinitions` or `RetrieveMetadataChanges` from the browser requires the `prvReadEntity` privilege on the Customization tab of the user's security role. Standard business users do not have it. This is the single most common cause of silent metadata fetch failures in production Power Apps Code Apps.

**Choice columns are not accessible through Code Apps `getMetadata`.** Option set values are defined on derived attribute types (`PicklistAttributeMetadata`, `MultiSelectPicklistAttributeMetadata`) which the Code Apps `getMetadata` function does not expose. To retrieve option set values, you must call `EntityDefinitions` directly via the Web API with explicit casting, or include them in your static JSON generator.

**The 90-day `ServerVersionStamp` retention window.** If you use the delta sync approach and the stamp is older than 90 days (configurable via `Organization.ExpireSubscriptionsInDays`), Dataverse returns an `ExpiredVersionStamp` error. Your implementation must handle this by reinitializing the cache from scratch.

**`localStorage` size constraint.** Browser `localStorage` is limited to approximately 5MB per domain. Dynamics 365 and Power Platform already consume a portion of this. For schemas with many entities or multilingual labels, LZ-string compression is necessary before writing to storage. Use the `LabelLanguages=1033` query parameter to limit returned labels to a single language when multilingual support is not required.

**Azure Cache for Redis retirement.** If you are building an Azure Function proxy today, do not build on Azure Cache for Redis Basic/Standard/Premium — these tiers retire September 30, 2028. Use Azure Blob Storage for metadata caching (sufficient for nearly all scenarios) or Azure Managed Redis if sub-millisecond latency is genuinely required.

---

## Recommended Starting Point

For a new production Power Apps Code App targeting business users across a standard enterprise environment:

1. **Start with Static JSON + a CI/CD generator script.** This covers the vast majority of scenarios with zero runtime cost, zero permission complexity, and the best possible performance.
2. **Add a `forceRefresh` admin path** (the Hybrid pattern) if your deployment pipeline is slow and administrators occasionally need immediate schema reflection without a full redeploy.
3. **Escalate to an Azure Function proxy** only if you have a hard requirement for runtime schema freshness across a large user population where redeployment is not operationally feasible.

Never start with the Azure Function approach to "keep things flexible." The operational overhead is real, the cost savings of the simpler approach are significant, and the permission model of static JSON is strictly easier to govern.

---

## Frequently Asked Questions

### What is the best way to retrieve Dataverse metadata in Power Apps Code Apps?

For most production scenarios, the best approach is a **static JSON bundle generated at build time**. It delivers sub-millisecond access, requires no `prvReadEntity` privilege for end users, imposes zero Dataverse API quota consumption at runtime, and scales to any number of concurrent users without degradation. Pair it with a `forceRefresh` admin path (the Hybrid pattern) if immediate schema propagation is occasionally needed without a full redeployment.

### Does retrieving Dataverse metadata require special permissions?

Yes. Any direct runtime call to `EntityDefinitions` or `RetrieveMetadataChanges` from the browser requires the `prvReadEntity` privilege on the Customization tab of the user's security role. Standard Dataverse business user roles (e.g., Basic User, Sales Person) do not include this privilege by default. This is the most common cause of silent 403 errors in production Code Apps. The static JSON and Azure Function proxy strategies eliminate this requirement for end users entirely.

### What is `RetrieveMetadataChanges` and when should I use it?

`RetrieveMetadataChanges` is Microsoft's recommended Dataverse function for maintaining a metadata cache. It returns a `ServerVersionStamp` that enables delta synchronization: on subsequent calls, only schema changes since the last stamp are returned rather than the full payload. This reduces repeat request latency from 500ms–2s to 0.1–0.2 seconds. Use it when you need runtime freshness and your users hold the `prvReadEntity` privilege — typically for internal admin tooling or low user-count scenarios.

### Can I retrieve Dataverse choice column option set values in Power Apps Code Apps?

Not directly through the Code Apps `getMetadata` function. Option set values are defined on derived attribute types (`PicklistAttributeMetadata`, `MultiSelectPicklistAttributeMetadata`) which the Code Apps metadata API does not expose. To retrieve them, call `EntityDefinitions` directly via the Dataverse Web API with explicit type casting, or include option set values in your static JSON generator script at build time.

### How much does an Azure Function metadata proxy cost?

For most deployments, effectively nothing. The Flex Consumption plan includes 250,000 free executions and 100,000 GB-seconds per month. A proxy serving 1,000 users/day with a 1-hour cache TTL generates roughly 30 Dataverse fetches/day plus user-facing cache hits — well within the free tier. If you add Redis for sub-millisecond latency, expect $16–$40/month for Basic/Standard tier. Note that Azure Cache for Redis Basic/Standard/Premium retires September 30, 2028 — use Azure Managed Redis for new projects.

### What happens when the `ServerVersionStamp` expires in the delta sync approach?

When the `ServerVersionStamp` stored in `localStorage` is older than 90 days (configurable via `Organization.ExpireSubscriptionsInDays`), Dataverse returns an `ExpiredVersionStamp` error. Your implementation must catch this error and reinitialize the cache from scratch — perform a full `RetrieveMetadataChanges` request without a stamp, then store the new stamp. If you do not handle this error, the app will fail silently for returning users after 90 days of inactivity.

### Should I use `localStorage` or `sessionStorage` for caching Dataverse metadata?

Use `localStorage` for the `RetrieveMetadataChanges` delta sync approach — it survives page refreshes, browser restarts, and tab closes, which is what makes the delta sync optimization effective. Use `sessionStorage` for the override layer in the Hybrid pattern — it survives component remounts within the tab but clears on tab close, ensuring each new session picks up the static bundle baseline. Note that `localStorage` is limited to ~5MB per domain; use LZ-string compression for large schemas.

---

## References

- [How to: Get metadata for Dataverse tables (Code Apps)](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/get-table-metadata) — March 2026
- [Cache schema data (Microsoft Dataverse)](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/cache-schema-data) — February 2026
- [Query schema definitions](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/metadata-retrieve-detect-changes)
- [Query table definitions using the Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-metadata-web-api) — March 2026
- [RetrieveMetadataChanges Function Reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/retrievemetadatachanges)
- [Azure Functions pricing](https://azure.microsoft.com/en-us/pricing/details/functions/)
- [Faster Web API Metadata Access — Mark Carrington](https://markcarrington.dev/2021/07/23/faster-web-api-metadata-access/)
- [Best practices and guidance when coding for Microsoft Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/best-practices/)
