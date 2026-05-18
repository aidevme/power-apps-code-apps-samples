// AI-CONTEXT: Full-viewport overlay spinner — renders a centred Fluent UI Spinner over the entire page.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/spinners/CustomSpinner.styles.ts
//   - barrel:   src/components/ui/spinners/index.ts
// AI-CONSTRAINT: Pure presentation — receives label and size via props; never owns loading state.
// AI-PATTERN: Always mount conditionally from the parent; this component is always visible when mounted.

import { Spinner } from '@fluentui/react-components'
import type { SpinnerProps } from '@fluentui/react-components'
import { useCustomSpinnerStyles } from './CustomSpinner.styles'

/** Props for the {@link CustomSpinner} component. */
export interface ICustomSpinnerProps {
  /**
   * Accessible label displayed below the spinner and used as the `aria-label` on the overlay.
   *
   * @defaultValue 'Loading…'
   */
  label?: string
  /**
   * Size forwarded to the Fluent UI `Spinner`.
   *
   * @defaultValue 'large'
   */
  size?: SpinnerProps['size']
}

/**
 * Full-viewport overlay that centres a Fluent UI `Spinner`.
 *
 * @remarks
 * Renders a `position: fixed` overlay covering the entire viewport.
 * Mount this component conditionally — it is always visible when present in the tree.
 *
 * @example
 * ```tsx
 * {isLoading && <CustomSpinner label="Loading solutions…" />}
 * ```
 */
export function CustomSpinner({ label = 'Loading…', size = 'large' }: ICustomSpinnerProps) {
  const styles = useCustomSpinnerStyles()

  return (
    <div className={styles.overlay} aria-busy="true" aria-label={label}>
      <Spinner size={size} label={label} labelPosition="below" />
    </div>
  )
}
