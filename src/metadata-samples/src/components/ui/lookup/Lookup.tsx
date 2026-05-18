// AI-CONTEXT: Generic reusable Lookup component — a labelled Dropdown backed by a flat key/text item list.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/lookup/Lookup.styles.ts
//   - barrel:   src/components/ui/lookup/index.ts
//   - consumer: src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.tsx
//   - consumer: src/components/apps/metadata/erddiagram/ERDDiagramApp.tsx
// AI-CONSTRAINT: Pure presentation — no service calls or hooks; all data and callbacks come through props.
// AI-PATTERN: Wrap Field + Dropdown + Option — never render a raw Fluent UI Dropdown without a Field label.

import { Field, Dropdown, Option, Text } from '@fluentui/react-components'
import type { OptionOnSelectData, SelectionEvents } from '@fluentui/react-components'
import { useLookupStyles } from './Lookup.styles'

/** A single selectable item for {@link Lookup}. */
export interface ILookupItem {
  /** Unique identifier used as the Dropdown `value`. */
  key: string
  /** Human-readable label rendered inside each `Option`. */
  text: string
}

/** Props for the {@link Lookup} component. */
export interface ILookupProps {
  /** Accessible label rendered above the Dropdown via a Fluent UI `Field`. */
  label: string
  /** Placeholder text shown when no item is selected. */
  placeholder?: string
  /** Selectable items to render as `Option` elements. */
  items: ILookupItem[]
  /**
   * Error to display below the label instead of the Dropdown.
   * When set, the Dropdown is hidden and the message is shown in red.
   */
  error?: Error | null
  /** Optional CSS class forwarded to the wrapping `Field` element. */
  className?: string
  /**
   * When `true`, the Dropdown is rendered in a disabled state and cannot be interacted with.
   *
   * @defaultValue false
   */
  isDisabled?: boolean
  /**
   * Called when the user selects an item.
   * Receives the `key` of the selected {@link ILookupItem}.
   *
   * @param key - The `key` of the selected item.
   */
  onOptionSelect?: (key: string) => void
}

/**
 * A labelled dropdown selector backed by a flat list of {@link ILookupItem} entries.
 *
 * @remarks
 * Wraps Fluent UI `Field` + `Dropdown` + `Option` into a single accessible unit.
 * When `error` is set the Dropdown is replaced by a red error message.
 * Loading state is handled by the parent — this component is pure presentation.
 *
 * @example
 * ```tsx
 * <Lookup
 *   label="Solution"
 *   placeholder="Select a solution"
 *   items={solutions.map(s => ({ key: s.solutionid, text: s.friendlyname }))}
 *   onOptionSelect={key => console.log('selected', key)}
 * />
 * ```
 */
export function Lookup({ label, placeholder, items, error, className, isDisabled = false, onOptionSelect }: ILookupProps) {
  const styles = useLookupStyles()

  function handleOptionSelect(_ev: SelectionEvents, data: OptionOnSelectData) {
    if (data.optionValue !== undefined) {
      onOptionSelect?.(data.optionValue)
    }
  }

  return (
    <Field label={label} className={className}>
      {error
        ? <Text className={styles.errorText}>{error.message}</Text>
        : (
          <Dropdown className={styles.dropdown} placeholder={placeholder} disabled={isDisabled} onOptionSelect={handleOptionSelect}>
            {items.map(item => (
              <Option key={item.key} value={item.key}>
                {item.text}
              </Option>
            ))}
          </Dropdown>
        )
      }
    </Field>
  )
}
