// AI-CONTEXT: Generic selectable table cards list — header with live checked count and All/None controls, rows with checkbox, colour square, display/logical name, and link action.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/cards/tablecardslist/TableCardsList.styles.ts
//   - barrel:   src/components/ui/cards/tablecardslist/index.ts
//   - consumer: src/components/apps/metadata/erddiagram/ERDDiagramApp.tsx
// AI-CONSTRAINT: Pure presentation — no Dataverse service calls; receive items via props.
// AI-PATTERN: Component owns checked state internally; caller passes a static item list.

import { Title3, Checkbox, Text, Button, Tooltip } from '@fluentui/react-components'
import { LinkMultiple20Regular } from '@fluentui/react-icons'
import { useState } from 'react'
import { useTableCardsListStyles } from './TableCardsList.styles'

/**
 * A single item displayed in the {@link TableCardsList}.
 */
export interface ITableCardsListItem {
  /** Display name of the Dataverse table (e.g. `'Account'`). */
  displayName: string
  /** Logical name of the Dataverse table (e.g. `'account'`). */
  logicalName: string
}

/**
 * Props for the {@link TableCardsList} component.
 */
export interface ITableCardsListProps {
  /** The list of table items to render. */
  items: ITableCardsListItem[]
}

/**
 * Renders a selectable list of Dataverse table cards.
 *
 * @remarks
 * Owns its own checked-item state, defaulting to all items selected.
 * The header row shows a live `checked/total` count and **All** / **None** selection controls.
 * Each row shows a checkbox, a colour indicator square, the display name and logical name,
 * and a transparent link action button.
 *
 * @example
 * ```tsx
 * <TableCardsList items={[{ displayName: 'Account', logicalName: 'account' }]} />
 * ```
 */
export function TableCardsList({ items }: ITableCardsListProps) {
  const styles = useTableCardsListStyles()

  // AI-CONTEXT: Tracks checked logical names; defaults to all items selected.
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(items.map(t => t.logicalName))
  )

  function toggleItem(logicalName: string) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(logicalName)) next.delete(logicalName)
      else next.add(logicalName)
      return next
    })
  }

  function selectAll() { setCheckedItems(new Set(items.map(t => t.logicalName))) }
  function clearAll() { setCheckedItems(new Set()) }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title3 as="h3">Tables ({checkedItems.size}/{items.length})</Title3>
        <div>
          <Tooltip content="Select all tables" relationship="label" withArrow>
            <Button appearance="transparent" size="small" onClick={selectAll}>All</Button>
          </Tooltip>
          <Tooltip content="Deselect all tables" relationship="label" withArrow>
            <Button appearance="transparent" size="small" onClick={clearAll}>None</Button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.list}>
        {items.map(t => (
          <div key={t.logicalName} className={styles.item}>
            <Checkbox
              checked={checkedItems.has(t.logicalName)}
              onChange={() => toggleItem(t.logicalName)}
            />
            <div className={styles.colorSquare} />
            <div className={styles.meta}>
              <Text className={styles.displayName}>{t.displayName}</Text>
              <Text className={styles.logicalName}>{t.logicalName}</Text>
            </div>
            <Button
              appearance="transparent"
              icon={<LinkMultiple20Regular />}
              className={styles.action}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
