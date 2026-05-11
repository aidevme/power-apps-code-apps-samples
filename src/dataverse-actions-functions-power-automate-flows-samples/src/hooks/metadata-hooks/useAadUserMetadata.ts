import { useState, useEffect } from 'react'
import type { EntityMetadata } from '@microsoft/power-apps/data/metadata/dataverse'
import { AadusersService } from '../../generated/services/AadusersService'
import { type IEntityTableInfo, ALL_ENTITY_METADATA_FIELDS, deriveTableInfo } from './entityMetadata.types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Describes a single attribute on the AAD User table as returned by Dataverse metadata. */
export interface IAadUserAttributeMetadata {
  /** Logical column name, e.g. `"aaduserid"` or `"displayname"`. */
  logicalName: string
  /** User-localised display label for the column. */
  displayName: string
  /** Dataverse attribute type, e.g. `"StringType"`, `"UniqueidentifierType"`. */
  attributeType: string
  /** Whether the column is marked as required on forms. */
  isRequiredForForm: boolean
}

/** Return value of the {@link useAadUserMetadata} hook. */
export interface IUseAadUserMetadataResult {
  /** The raw entity metadata returned by Dataverse, or `null` while loading or on error. */
  metadata: Partial<EntityMetadata> | null
  /** Whether the metadata fetch is in progress. */
  loading: boolean
  /** Error message if the fetch failed, or `null` on success. */
  error: string | null
  /**
   * Map of column logical name → user-localised display label derived from `metadata.Attributes`.
   * Empty object while loading or on error.
   *
   * @example `{ "aaduserid": "AAD User", "displayname": "Display Name" }`
   */
  columnDisplayNames: Record<string, string>
  /**
   * Metadata for every attribute on the AAD User table, derived from `metadata.Attributes`.
   * Empty array while loading or on error.
   */
  attributes: IAadUserAttributeMetadata[]
  /**
   * Attributes that are marked as required on forms (`IsRequiredForForm === true`).
   * Useful for driving client-side validation without hard-coding field names.
   */
  requiredAttributes: IAadUserAttributeMetadata[]
  /**
   * Dataverse table type for the AAD User table, e.g. `"Standard"`, `"Elastic"`, `"Virtual"`, or `"Activity"`.
   * `null` while loading or on error.
   */
  tableType: string | null
  /**
   * Whether the AAD User table is an activity table.
   * `null` while loading or on error.
   */
  isActivity: boolean | null  /**
   * Comprehensive table-level properties derived from the raw entity metadata.
   * All properties are `null` while loading or on error.
   * See {@link IEntityTableInfo} for the full list of available fields.
   */
  tableInfo: IEntityTableInfo  /** Re-triggers the metadata fetch. Useful for retry-on-error UI patterns. */
  retry: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetches entity and column metadata for the AAD User table via {@link AadusersService.getMetadata}.
 *
 * Retrieves all attribute metadata at mount and derives convenience collections:
 * `columnDisplayNames`, `attributes`, and `requiredAttributes`.
 * Results are cached for the lifetime of the component tree that mounts this hook.
 *
 * @returns Metadata state, loading flag, error message, and derived attribute collections.
 *
 * @example
 * ```tsx
 * const { columnDisplayNames, requiredAttributes, loading } = useAadUserMetadata()
 * if (!loading) console.log(columnDisplayNames['displayname']) // "Display Name"
 * ```
 */
export function useAadUserMetadata(): IUseAadUserMetadataResult {
  const [metadata, setMetadata] = useState<Partial<EntityMetadata> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const doFetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await AadusersService.getMetadata({ metadata: ALL_ENTITY_METADATA_FIELDS, schema: { columns: 'all' } })
        if (cancelled) return
        if (!result.success) {
          const message = result.error?.message ?? 'getMetadata returned a failure result'
          console.error('useAadUserMetadata:', message, result.error)
          setError(message)
          return
        }
        setMetadata(result.data)
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('useAadUserMetadata: failed to load metadata', message)
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    doFetch()
    return () => { cancelled = true }
  }, [attempt])

  const attributes: IAadUserAttributeMetadata[] = metadata?.Attributes
    ? metadata.Attributes.map(attr => ({
        logicalName: attr.LogicalName ?? '',
        displayName: attr.DisplayName?.UserLocalizedLabel?.Label ?? attr.LogicalName ?? '',
        attributeType: attr.AttributeTypeName?.Value ?? '',
        isRequiredForForm: attr.IsRequiredForForm ?? false,
      }))
    : []

  const columnDisplayNames: Record<string, string> = {}
  for (const attr of attributes) {
    if (attr.logicalName) columnDisplayNames[attr.logicalName] = attr.displayName
  }

  const requiredAttributes = attributes.filter(a => a.isRequiredForForm)
  const tableType = metadata?.TableType ?? null
  const isActivity = metadata?.IsActivity ?? null
  const tableInfo = deriveTableInfo(metadata)

  return { metadata, loading, error, columnDisplayNames, attributes, requiredAttributes, tableType, isActivity, tableInfo, retry: () => setAttempt(n => n + 1) }
}
