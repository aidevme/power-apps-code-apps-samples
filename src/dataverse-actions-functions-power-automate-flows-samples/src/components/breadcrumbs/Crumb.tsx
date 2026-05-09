import type { ReactElement } from 'react'
import { BreadcrumbItem, BreadcrumbButton, Tooltip } from '@fluentui/react-components'

/** Props for the internal {@link Crumb} component. */
export interface ICrumbProps {
  /** Text label displayed inside the breadcrumb button. */
  label: string
  /** Tooltip content describing the crumb's navigation action. */
  tooltip: string
  /** Whether this crumb represents the currently active page. */
  current: boolean
  /** CSS class name applied to the breadcrumb button. */
  className: string
  /** Called when the breadcrumb button is clicked. */
  onClick?: () => void
}

/**
 * Single breadcrumb item composed of a Fluent UI `BreadcrumbButton` wrapped in a `Tooltip`.
 *
 * @example
 * ```tsx
 * <Crumb label="Home" tooltip="Go to Home" current={false} className={styles.crumb} onClick={() => navigate('/')} />
 * ```
 */
export function Crumb({ label, tooltip, current, className, onClick }: ICrumbProps): ReactElement {
  return (
    <BreadcrumbItem>
      <Tooltip content={tooltip} relationship="description" positioning="below" withArrow>
        <BreadcrumbButton current={current} onClick={onClick} className={className}>
          {label}
        </BreadcrumbButton>
      </Tooltip>
    </BreadcrumbItem>
  )
}
