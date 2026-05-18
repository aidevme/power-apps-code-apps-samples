// AI-CONTEXT: Pagination footer for the entity metadata table — Previous/Next controls and row range label.
// AI-FILE-RELATIONS:
//   - consumer: src/components/apps/metadata/metadatabrowser/components/MetadataEntitesTable.tsx
// AI-CONSTRAINT: Pure presentation — no state; all pagination values and callbacks come from props.

import { Button, Caption1, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalS,
  },
  rowCount: {
    display: 'block',
    color: tokens.colorNeutralForeground3,
  },
  paging: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
})

/** Props for {@link MetadataEntitesTableFooter}. */
export interface IMetadataEntitesTableFooterProps {
  /** Zero-based index of the currently visible page. */
  currentPage: number
  /** Total number of pages. */
  totalPages: number
  /** 1-based index of the first visible row. */
  firstRow: number
  /** 1-based index of the last visible row. */
  lastRow: number
  /** Total number of rows across all pages. */
  totalRows: number
  /** Called when the user clicks Previous. */
  onPreviousPage: () => void
  /** Called when the user clicks Next. */
  onNextPage: () => void
}

/**
 * Pagination footer for the entity metadata table.
 *
 * @remarks
 * Renders Previous and Next {@link Button}s with a row-range {@link Caption1} in between.
 * Both buttons are automatically disabled at the first and last page respectively.
 *
 * @example
 * ```tsx
 * <MetadataEntitesTableFooter
 *   currentPage={0} totalPages={3}
 *   firstRow={1} lastRow={10} totalRows={27}
 *   onPreviousPage={() => setPage(p => p - 1)}
 *   onNextPage={() => setPage(p => p + 1)}
 * />
 * ```
 */
export function MetadataEntitesTableFooter({
  currentPage, totalPages, firstRow, lastRow, totalRows, onPreviousPage, onNextPage,
}: IMetadataEntitesTableFooterProps) {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Caption1 className={styles.rowCount}>{firstRow}–{lastRow} of {totalRows}</Caption1>
      <div className={styles.paging}>
        <Button appearance="subtle" size="small" disabled={currentPage === 0} onClick={onPreviousPage}>Previous</Button>
        <Button appearance="subtle" size="small" disabled={currentPage >= totalPages - 1} onClick={onNextPage}>Next</Button>
      </div>
    </div>
  )
}
