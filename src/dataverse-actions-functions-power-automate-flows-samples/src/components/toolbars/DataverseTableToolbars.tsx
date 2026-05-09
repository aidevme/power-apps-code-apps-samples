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

/** Props for {@link DataverseTableToolbar}. */
export interface IDataverseTableToolbarProps {
  /** Currently selected record IDs — drives enabled/disabled state of Edit and Delete. */
  selectedIds: Set<string>
  /** Called when the New button is clicked. */
  onNew?: () => void
  /**
   * Called when the Edit button is clicked.
   * Receives the single selected record ID. Enabled only when exactly one row is selected.
   */
  onEdit?: (id: string) => void
  /**
   * Called when the Delete button is clicked.
   * Receives all currently selected record IDs. Enabled only when at least one row is selected.
   */
  onDelete?: (ids: string[]) => void
  /** Called when the Refresh button is clicked. */
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
 * CRUD + Refresh toolbar for {@link DataverseTable}.
 *
 * Renders New, Edit, Delete, and Refresh toolbar buttons with Fluent UI
 * `Tooltip` descriptions. Edit is disabled unless exactly one row is selected;
 * Delete is disabled when no rows are selected.
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
