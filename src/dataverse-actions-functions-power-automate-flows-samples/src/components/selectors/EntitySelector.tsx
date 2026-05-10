import { Dropdown, Field, InfoLabel, Option } from '@fluentui/react-components'
import type { LabelProps } from '@fluentui/react-components'
import type { Entities } from '../../generated/models/EntitiesModel'


/** A single entry in the entity selector list. */
interface IRegisteredEntity {
  /** OData collection name used as the stable key. */
  collectionName: string
  /** Dataverse entity metadata record, or `undefined` when not yet loaded. */
  meta: Entities | undefined
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
        {registeredEntities.map(({ collectionName, meta }) => (
          <Option key={collectionName} value={meta?.logicalname ?? collectionName}>
            {meta
              ? `${meta.name ?? meta.originallocalizedname ?? meta.logicalname ?? meta.entityid} (${meta.isactivity ? 'Activity' : meta.physicalname?.toLowerCase().endsWith('_elastic') ? 'Elastic' : meta.externalname ? 'Virtual' : 'Standard'})`
              : collectionName}
          </Option>
        ))}
      </Dropdown>
    </Field>
  )
}
