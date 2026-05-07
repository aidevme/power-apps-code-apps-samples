import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Tooltip,
  makeStyles,
} from '@fluentui/react-components'

const useBreadcrumbStyles = makeStyles({
  crumb: {
    ':hover': { color: '#5A1A99' },
  },
})

/** Props for {@link AppBreadcrumb}. */
export interface IBreadcrumbProps {
  /**
   * Label for the root "Home" crumb.
   * @defaultValue `'Home'`
   */
  homeLabel?: string
  /**
   * Label for the active (second-level) crumb.
   * Pass `null` to show only the Home crumb in its current/active state.
   */
  currentLabel: string | null
  /** Called when the user clicks the Home crumb. */
  onHome: () => void
}

/**
 * Application-level breadcrumb navigation.
 *
 * Renders a single Home crumb when `currentLabel` is `null`, and adds a
 * second crumb when the user has navigated into a sub-view.
 *
 * @example
 * ```tsx
 * <AppBreadcrumb currentLabel={view !== null ? viewLabels[view] : null} onHome={() => setView(null)} />
 * ```
 */
export function AppBreadcrumb({ homeLabel = 'Home', currentLabel, onHome }: IBreadcrumbProps) {
  const styles = useBreadcrumbStyles()
  return (
    <Breadcrumb aria-label="Navigation">
      <BreadcrumbItem>
        <Tooltip
          content={currentLabel !== null ? `Go back to ${homeLabel}` : `You are on the ${homeLabel} page`}
          relationship="description"
          positioning="below"
          withArrow
        >
          <BreadcrumbButton current={currentLabel === null} onClick={onHome} className={styles.crumb}>
            {homeLabel}
          </BreadcrumbButton>
        </Tooltip>
      </BreadcrumbItem>
      {currentLabel !== null && (
        <>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <Tooltip
              content={`You are currently viewing: ${currentLabel}`}
              relationship="description"
              positioning="below"
              withArrow
            >
              <BreadcrumbButton current className={styles.crumb}>{currentLabel}</BreadcrumbButton>
            </Tooltip>
          </BreadcrumbItem>
        </>
      )}
    </Breadcrumb>
  )
}
