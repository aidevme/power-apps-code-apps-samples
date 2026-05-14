// AI-CONTEXT: CRUD + Refresh toolbar component for Dataverse table views.
// AI-FILE-RELATIONS:
//   - consumer: src/components/tables/DataverseTable.tsx  (primary host; passes selectedIds and CRUD callbacks)
// AI-CONSTRAINT: Pure presentation — no service calls, no state. All behaviour is driven by callback props.
// AI-PATTERN: Add new toolbar actions as ToolbarButton + Tooltip pairs; place them before the ToolbarDivider for data-mutation actions, after for utility actions.

import type { ReactElement } from 'react'
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  EditRegular,
} from '@fluentui/react-icons'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for {@link DataverseTableToolbar}.
 *
 * @remarks
 * All action callbacks are optional — omitting a callback does not hide the button,
 * but the button becomes a no-op when clicked.
 * Enable/disable state is computed from `selectedIds.size` regardless of whether
 * the corresponding callback is provided.
 */
export interface IDataverseTableToolbarProps {
  /**
   * Set of currently selected record IDs.
   * Controls the enabled/disabled state of the Edit and Delete buttons:
   * - Edit is enabled only when `selectedIds.size === 1`.
   * - Delete is enabled when `selectedIds.size >= 1`.
   */
  selectedIds: Set<string>
  /** Invoked when the **New** button is clicked. */
  onNew?: () => void
  /**
   * Invoked when the **Edit** button is clicked.
   *
   * @param id - The single selected record ID. The button is disabled unless exactly one row is selected,
   * so `id` is always a valid GUID when this callback fires.
   */
  onEdit?: (id: string) => void
  /**
   * Invoked when the **Delete** button is clicked.
   *
   * @param ids - All currently selected record IDs as an array. Always non-empty when this callback fires.
   */
  onDelete?: (ids: string[]) => void
  /** Invoked when the **Refresh** button is clicked. */
  onRefresh?: () => void
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useDataverseTableToolbarStyles = makeStyles({
  toolbar: {
    paddingBottom: tokens.spacingVerticalS,
  },
})

// ---------------------------------------------------------------------------
// DataverseTableToolbar
// ---------------------------------------------------------------------------

/**
 * CRUD + Refresh action toolbar for Dataverse table views.
 *
 * @remarks
 * Renders four Fluent UI {@link ToolbarButton} controls — **New**, **Edit**, **Delete**, and **Refresh** —
 * each wrapped in a {@link Tooltip} with context-aware descriptions:
 *
 * - **New** — always enabled; calls `onNew`.
 * - **Edit** — enabled only when exactly one row is selected; tooltip explains the requirement otherwise; calls `onEdit` with the selected ID.
 * - **Delete** — enabled when one or more rows are selected; tooltip shows the count; calls `onDelete` with all selected IDs.
 * - **Refresh** — always enabled; separated from the mutation actions by a {@link ToolbarDivider}; calls `onRefresh`.
 *
 * This component is stateless — all selection state and action handlers are provided via props.
 *
 * @param props - See {@link IDataverseTableToolbarProps}.
 * @returns A Fluent UI `Toolbar` element.
 *
 * @example
 * ```tsx
 * <DataverseTableToolbar
 *   selectedIds={selectedIds}
 *   onNew={handleNew}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export function DataverseTableToolbar({
  selectedIds,
  onNew,
  onEdit,
  onDelete,
  onRefresh,
}: IDataverseTableToolbarProps): ReactElement {
  const styles = useDataverseTableToolbarStyles()

  return (
    <Toolbar className={styles.toolbar}>
      <Tooltip content="Create a new record" relationship="description" positioning="below" withArrow>
        <ToolbarButton icon={<AddRegular />} onClick={onNew}>New</ToolbarButton>
      </Tooltip>
      <Tooltip
        content={selectedIds.size !== 1 ? 'Select exactly one record to edit' : 'Edit the selected record'}
        relationship="description"
        positioning="below"
        withArrow
      >
        <ToolbarButton
          icon={<EditRegular />}
          disabled={selectedIds.size !== 1}
          onClick={() => { const id = [...selectedIds][0]; if (id) onEdit?.(id) }}
        >
          Edit
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={selectedIds.size === 0 ? 'Select one or more records to delete' : `Delete ${selectedIds.size} selected record${selectedIds.size > 1 ? 's' : ''}`}
        relationship="description"
        positioning="below"
        withArrow
      >
        <ToolbarButton
          icon={<DeleteRegular />}
          disabled={selectedIds.size === 0}
          onClick={() => onDelete?.([...selectedIds])}
        >
          Delete
        </ToolbarButton>
      </Tooltip>
      <ToolbarDivider />
      <Tooltip content="Reload data from Dataverse" relationship="description" positioning="below" withArrow>
        <ToolbarButton icon={<ArrowClockwiseRegular />} onClick={onRefresh}>Refresh</ToolbarButton>
      </Tooltip>
    </Toolbar>
  )
}
