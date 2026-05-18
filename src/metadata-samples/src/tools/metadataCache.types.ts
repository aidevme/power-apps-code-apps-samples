// AI-CONTEXT: Shared type for a single entry in the startup entity metadata cache.
// AI-FILE-RELATIONS:
//   - consumer: src/hooks/component-hooks/useMetadataCache.ts  (builds the cache)
//   - consumer: src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.tsx  (may read the cache)
// AI-CONSTRAINT: No React imports — this file is framework-agnostic (lives under tools/).
// AI-PATTERN: Extend with new fields only when a cache consumer needs them; do not mirror all of IEntityTableInfo.

/**
 * Cached metadata summary for a single Dataverse table, derived from the
 * corresponding `useXxxMetadata` hook and keyed by entity logical name.
 *
 * @remarks
 * Built inside {@link useMetadataCache} from all startup `tableInfo` values via `useMemo`.
 * Used by route components for display-name resolution and entity-property lookups
 * without re-fetching metadata per route.
 */
export interface IEntityMetadataCacheEntry {
  /** Logical name of the entity, e.g. `"account"`. */
  logicalName: string
  /** User-localised singular display name, e.g. `"Account"`. `null` while metadata is loading. */
  displayName: string
  /** Schema (PascalCase) name of the table, e.g. `"Account"`. */
  schemaName: string
  /** Integer object type code for the entity, e.g. `1` for Account. `null` when not yet loaded. */
  entityTypeCode: number | null
  /** Dataverse table type: `"Standard"`, `"Activity"`, `"Virtual"`, or `"Elastic"`. */
  tableType: string
  /** Human-readable ownership type, e.g. `"UserOwned"` or `"OrganizationOwned"`. `null` when not set. */
  ownershipType: string | null
  /** Logical name of the primary ID attribute, e.g. `"accountid"`. `null` when not set. */
  primaryIdAttribute: string | null
  /** User-localised description of the table from Dataverse metadata. `null` when not set. */
  description: string | null
  /** Whether the entity is an activity type. `null` while metadata is loading. */
  isActivity: boolean | null
}
