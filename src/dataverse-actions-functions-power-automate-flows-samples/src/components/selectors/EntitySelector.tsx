import { Dropdown, Field, InfoLabel, Option } from '@fluentui/react-components'
import type { LabelProps } from '@fluentui/react-components'
import type { Entities } from '../../generated/models/EntitiesModel'


/** A single entry in the entity selector list. */
export interface IRegisteredEntity {
  /** OData collection name used as the stable key. */
  collectionName: string
  /** Dataverse entity metadata record, or `undefined` when not yet loaded. */
  meta: Entities | undefined
  /**
   * Derived table type: `'Standard'`, `'Activity'`, `'Virtual'`, or `'Elastic'`.
   * Computed once in {@link useCRUDApp} from the entity metadata fields.
   */
  tableType: string
}

/**
 * Cached metadata summary for a single Dataverse table, derived from the
 * corresponding `useXxxMetadata` hook and passed in at app startup.
 *
 * @remarks
 * Keyed by entity logical name (e.g. `"account"`) in the `metadataCache` prop
 * of {@link EntitySelector}. Used to enrich dropdown option labels with schema
 * names, object type codes, and accurate localised display names.
 */
export interface IEntityMetadataCacheEntry {
  /** Logical name of the entity, e.g. `"account"`. */
  logicalName: string
  /** User-localised singular display name, e.g. `"Account"`. */
  displayName: string
  /** Schema (PascalCase) name of the table, e.g. `"Account"`. */
  schemaName: string
  /** Integer object type code for the entity, e.g. `1` for Account. */
  entityTypeCode: number | null
  /** Dataverse table type: `"Standard"`, `"Activity"`, `"Virtual"`, or `"Elastic"`. */
  tableType: string
  /** Human-readable ownership type, e.g. `"UserOwned"` or `"OrganizationOwned"`. `null` when not set. */
  ownershipType: string | null
  /** Logical name of the primary ID attribute, e.g. `"accountid"`. `null` when not set. */
  primaryIdAttribute: string | null
  /** User-localised description of the table from Dataverse metadata. `null` when not set. */
  description: string | null
  /** Whether the entity is an activity type. `null` when not yet loaded. */
  isActivity: boolean | null
}

/** Props for {@link EntitySelector}. */
export interface IEntitySelectorProps {
  /** Ordered list of registered entities to display as dropdown options. */
  registeredEntities: IRegisteredEntity[]
  /** Logical name of the currently selected entity, or `null` when none is selected. */
  selectedLogicalName: string | null
  /** Display label shown in the dropdown trigger when an entity is selected. */
  selectedLabel: string
  /**
   * Called when the user picks an entity.
   *
   * @param logicalName - The logical name of the selected entity, or `null` when cleared.
   */
  onEntitySelect: (logicalName: string | null) => void
  /**
   * Optional map of entity logical name → cached metadata summary.
   * When present, each option is enriched with the localised display name,
   * schema name, object type code, and table type sourced from the metadata hooks
   * rather than the `Entities` table query.
   *
   * @defaultValue `undefined` — falls back to `meta.name` and derived `tableType`.
   */
  metadataCache?: Record<string, IEntityMetadataCacheEntry>
}

/**
 * Fluent UI `Dropdown` that lists all registered Dataverse entities for selection.
 *
 * Each option shows the entity display name and its table type (Activity, Elastic,
 * Virtual, or Standard) in parentheses. Falls back to the collection name when
 * metadata is unavailable.
 *
 * @example
 * ```tsx
 * <EntitySelector
 *   registeredEntities={registeredEntities}
 *   selectedLogicalName={selectedLogicalName}
 *   selectedLabel={selectedLabel}
 *   onEntitySelect={handleEntitySelect}
 * />
 * ```
 */
export function EntitySelector({
  registeredEntities,
  selectedLogicalName,
  selectedLabel,
  onEntitySelect,
  metadataCache,
}: IEntitySelectorProps) {
  return (
    <Field
      label={{
        children: (_: unknown, slotProps: LabelProps) => (
          <InfoLabel {...slotProps} info="Choose a Dataverse table to load its records. Each option shows the entity display name and its table type — Standard, Activity, Virtual, or Elastic — in parentheses.">
            Select an Entity
          </InfoLabel>
        ),
      }}
      required
    >
      <Dropdown
        placeholder="Choose an entity"
        value={selectedLabel}
        selectedOptions={selectedLogicalName ? [selectedLogicalName] : []}
        onOptionSelect={(_, data) => {
          onEntitySelect(data.optionValue ?? null)
        }}
      >
        {registeredEntities.map(({ collectionName, meta }) => {
            const logicalName = meta?.logicalname ?? collectionName
            const cacheEntry = metadataCache?.[logicalName]
            const label = cacheEntry?.displayName
              ?? meta?.name ?? meta?.originallocalizedname ?? meta?.logicalname ?? meta?.entityid
              ?? collectionName
            return (
              <Option key={collectionName} value={logicalName}>
                {label}
              </Option>
            )
          })}
      </Dropdown>
    </Field>
  )
}
