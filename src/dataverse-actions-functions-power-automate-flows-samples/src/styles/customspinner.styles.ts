// AI-CONTEXT: Fluent UI v9 makeStyles definitions for CustomSpinner.
// AI-FILE-RELATIONS:
//   - consumer: src/components/common/spinner/CustomSpinner.tsx
//     (the `directionClass` map in CustomSpinner reads these class names)
// AI-CONSTRAINT: Do NOT add layout sizing (width, height, padding) here.
//   react-spinners components are self-sizing; wrapper sizing belongs in
//   the consuming screen/component, not in this shared style hook.
// AI-PATTERN: One `makeStyles` call per component – do not split into
//   multiple hooks or merge with other component style files.
 
import { makeStyles, tokens } from '@fluentui/react-components'
 
/**
 * Fluent UI v9 style hook for {@link CustomSpinner}.
 *
 * @remarks
 * Returns a stable object of Griffel atomic CSS class names. Call this hook
 * once at the top of the component and destructure the classes you need.
 * Griffel deduplicates the generated `<style>` rules across renders, so
 * calling this hook in many mounted instances has no performance penalty.
 *
 * ### Class responsibilities
 * | Class | Purpose |
 * |---|---|
 * | `wrapper` | Flex container shared by all react-spinners variants |
 * | `directionBelow` | Spinner above, label below (default) |
 * | `directionAbove` | Label above, spinner below |
 * | `directionAfter` | Spinner left, label right (inline) |
 * | `directionBefore` | Label left, spinner right (inline) |
 *
 * ### Usage in CustomSpinner
 * ```tsx
 * const styles = useCustomSpinnerStyles()
 *
 * const directionClass = {
 *   below:  styles.directionBelow,
 *   above:  styles.directionAbove,
 *   after:  styles.directionAfter,
 *   before: styles.directionBefore,
 * }[labelPosition]
 *
 * return (
 *   <div className={mergeClasses(styles.wrapper, directionClass)}>
 *     …
 *   </div>
 * )
 * ```
 *
 * @returns Griffel class name map – pass values to `mergeClasses()`, never
 *   use them as plain strings or concatenate them manually.
 *
 * @see {@link https://react.fluentui.dev/?path=/docs/concepts-developer-making-styles | makeStyles docs}
 * @see {@link https://griffel.js.org | Griffel CSS-in-JS engine}
 */
export const useCustomSpinnerStyles = makeStyles({
  /**
   * Base flex container applied to every react-spinners variant.
   *
   * @remarks
   * Always combined with one of the `direction*` classes via `mergeClasses`.
   * `flexDirection` is intentionally omitted here – it is provided by the
   * direction class so Griffel can override it atomically without specificity
   * conflicts.
   *
   * - `gap` uses `tokens.spacingVerticalS` (4 px in the default Fluent theme)
   *   to maintain consistent spacing between the indicator and the label
   *   regardless of which direction class is active.
   *
   * AI-CONSTRAINT: Do not set `flexDirection` on this class.
   *   Direction is always controlled by a separate `direction*` class.
   */
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
  },
 
  /**
   * Stacks the spinner indicator above the label.
   *
   * @remarks
   * Maps to `labelPosition="below"` in {@link ICustomSpinnerProps} –
   * the most common orientation, matching Fluent UI's own Spinner default.
   *
   * Visual result:
   * ```
   * [indicator]
   *   label
   * ```
   */
  directionBelow: { flexDirection: 'column' },
 
  /**
   * Stacks the label above the spinner indicator.
   *
   * @remarks
   * Maps to `labelPosition="above"` in {@link ICustomSpinnerProps}.
   * Uses `column-reverse` so the DOM order (indicator first, label second)
   * stays consistent with the other variants – only the visual order flips.
   *
   * Visual result:
   * ```
   *   label
   * [indicator]
   * ```
   */
  directionAbove: { flexDirection: 'column-reverse' },
 
  /**
   * Places the spinner indicator to the left of the label (inline layout).
   *
   * @remarks
   * Maps to `labelPosition="after"` in {@link ICustomSpinnerProps}.
   * "After" follows the logical reading direction (LTR: left → right),
   * meaning the label comes *after* the indicator in both DOM and visual order.
   *
   * Visual result:
   * ```
   * [indicator]  label
   * ```
   */
  directionAfter: { flexDirection: 'row' },
 
  /**
   * Places the label to the left of the spinner indicator (inline layout).
   *
   * @remarks
   * Maps to `labelPosition="before"` in {@link ICustomSpinnerProps}.
   * Uses `row-reverse` so the DOM order stays consistent (indicator first)
   * while the label appears visually before the indicator.
   *
   * Visual result:
   * ```
   * label  [indicator]
   * ```
   */
  directionBefore: { flexDirection: 'row-reverse' },
})