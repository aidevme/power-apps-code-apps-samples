// AI-CONTEXT: Fluent UI v9 + react-spinners unified spinner abstraction.
// AI-PATTERN: All spinner variants share a single component surface (CustomSpinner).
//   Do NOT import individual react-spinners loaders elsewhere in the codebase.
// AI-FILE-RELATIONS:
//   - styles: src/styles/customspinner.styles.ts  (Fluent UI makeStyles)
//   - consumer: any Code App screen that needs a loading indicator
// AI-CONSTRAINT: The `color` prop must be either a raw CSS color string
//   (e.g. '#0078d4', 'rgb(0,120,212)') OR a Fluent UI token expression
//   ('var(--colorBrandBackground)'). Never pass a bare token name without var().

import { Spinner, mergeClasses, tokens, Text } from '@fluentui/react-components'
import type { SpinnerProps } from '@fluentui/react-components'
import {
  BarLoader, BeatLoader, BounceLoader, CircleLoader, ClimbingBoxLoader, ClipLoader,
  ClockLoader, DotLoader, FadeLoader, GridLoader, HashLoader, MoonLoader,
  PacmanLoader, PropagateLoader, PuffLoader, PulseLoader, RingLoader,
  RiseLoader, RotateLoader, ScaleLoader, SkewLoader, SquareLoader, SyncLoader,
} from 'react-spinners'
import { useCustomSpinnerStyles } from '../../../styles/customspinner.styles'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Visual style of the spinner indicator.
 *
 * @remarks
 * - `'Default'` renders the native Fluent UI {@link Spinner} component.
 * - All other values delegate to the matching `react-spinners` loader.
 *
 * Changing this value at runtime is safe – the component re-renders the
 * correct loader branch without unmounting the wrapper.
 *
 * @see {@link https://www.davidhu.io/react-spinners/ | react-spinners storybook}
 * @see {@link https://react.fluentui.dev/?path=/docs/components-spinner | Fluent UI Spinner}
 */
export type SpinnerType =
  | 'Default'
  | 'BarLoader'
  | 'BeatLoader'
  | 'BounceLoader'
  | 'CircleLoader'
  | 'ClimbingBoxLoader'
  | 'ClipLoader'
  | 'ClockLoader'
  | 'DotLoader'
  | 'FadeLoader'
  | 'GridLoader'
  | 'HashLoader'
  | 'MoonLoader'
  | 'PacmanLoader'
  | 'PropagateLoader'
  | 'PuffLoader'
  | 'PulseLoader'
  | 'RingLoader'
  | 'RiseLoader'
  | 'RotateLoader'
  | 'ScaleLoader'
  | 'SkewLoader'
  | 'SquareLoader'
  | 'SyncLoader'

/**
 * Props for the {@link CustomSpinner} component.
 *
 * @remarks
 * Props marked as "only applies when `spinnerType` is `'Default'`" are forwarded
 * to the Fluent UI {@link Spinner} and have no effect on react-spinners variants.
 * The only cross-variant props are `label`, `labelPosition`, and `color`.
 *
 * @example
 * // Minimal usage – Fluent UI default spinner with label:
 * <CustomSpinner label="Loading…" />
 *
 * @example
 * // react-spinners variant with a custom brand colour:
 * <CustomSpinner
 *   spinnerType="MoonLoader"
 *   label="Fetching records…"
 *   color={tokens.colorBrandBackground}
 * />
 */
export interface ICustomSpinnerProps {
  /**
   * Accessible label displayed adjacent to the spinner indicator.
   *
   * @remarks
   * Always provide a meaningful label – it doubles as the accessible name
   * for screen readers. Avoid generic strings like "Loading" when more
   * context is available (e.g. "Loading account list…").
   */
  label: string

  /**
   * Size of the Fluent UI spinner indicator.
   *
   * @remarks
   * **Only applies when `spinnerType` is `'Default'`.**
   * react-spinners variants are sized via their own internal defaults and
   * cannot be controlled through this prop.
   *
   * @defaultValue 'medium'
   */
  size?: SpinnerProps['size']

  /**
   * Visual variant of the spinner indicator.
   *
   * @remarks
   * - `'Default'` → Fluent UI {@link Spinner} (recommended for most scenarios).
   * - Any other value → the matching `react-spinners` component.
   *
   * If an unrecognised value is somehow passed (e.g. via a dynamic string),
   * the component silently falls back to the Fluent UI {@link Spinner}.
   *
   * @defaultValue 'Default'
   */
  spinnerType?: SpinnerType

  /**
   * Position of the label relative to the spinner indicator.
   *
   * @remarks
   * Mapped to `directionBelow | directionAbove | directionAfter | directionBefore`
   * CSS classes (defined in `customspinner.styles.ts`) for react-spinners variants.
   * For `'Default'`, forwarded directly to Fluent UI {@link Spinner}.
   *
   * @defaultValue 'below'
   */
  labelPosition?: SpinnerProps['labelPosition']

  /**
   * Colour of the spinner indicator.
   *
   * @remarks
   * Accepts:
   * - A raw CSS colour string: `'#0078d4'`, `'rgb(0,120,212)'`
   * - A Fluent UI token CSS variable expression: `'var(--colorBrandBackground)'`
   *   — resolved at render time via {@link resolveFluentToken}.
   *
   * When omitted, defaults to `tokens.colorBrandBackground` (the Fluent UI
   * brand blue), which is also resolved through {@link resolveFluentToken}.
   *
   * **Note:** This prop has no effect when `spinnerType` is `'Default'`,
   * because the Fluent UI Spinner derives its colour from the theme.
   */
  color?: string
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Resolves a Fluent UI CSS token expression to its computed colour value.
 *
 * @param token - Either a raw CSS colour string (returned as-is) or a
 *   `var(--tokenName)` expression produced by Fluent UI token helpers.
 * @returns The computed hex/rgb colour string, or the original `token`
 *   string if resolution fails (e.g. when called in an SSR environment
 *   where `document` is unavailable).
 *
 * @remarks
 * react-spinners sets SVG/CSS `fill` and `background` directly via the
 * `color` prop and cannot consume CSS variable expressions. This function
 * bridges that gap by calling `getComputedStyle` on `document.documentElement`.
 *
 * **AI-CONSTRAINT:** Only call this function in a browser context.
 *   It will silently return the raw token string in non-browser environments
 *   instead of throwing, making it safe to use in isomorphic render paths.
 *
 * @example
 * resolveFluentToken('var(--colorBrandBackground)')
 * // → '#0078d4'  (actual value depends on the active Fluent UI theme)
 *
 * resolveFluentToken('#ff0000')
 * // → '#ff0000'  (raw colour, returned unchanged)
 */
function resolveFluentToken(token: string): string {
  // AI-CONTEXT: Regex extracts the CSS custom property name from a var() expression.
  // Example: 'var(--colorBrandBackground)' → '--colorBrandBackground'
  const match = /^var\(([^)]+)\)$/.exec(token.trim())
  if (!match) return token
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || token
}

// ---------------------------------------------------------------------------
// Spinner registry
// ---------------------------------------------------------------------------

/**
 * Lookup map from {@link SpinnerType} string keys to their react-spinners
 * component constructors.
 *
 * @remarks
 * `'Default'` is intentionally omitted – it is handled by the early-return
 * branch in {@link CustomSpinner} before this map is consulted.
 *
 * AI-CONTEXT: Adding a new react-spinners variant requires:
 *   1. Import the new loader from 'react-spinners'.
 *   2. Add the string literal to the {@link SpinnerType} union.
 *   3. Add the entry here.
 *   No other files need to change.
 */
const REACT_SPINNERS: Partial<Record<SpinnerType, React.ComponentType<{ color?: string }>>> = {
  BarLoader, BeatLoader, BounceLoader, CircleLoader, ClimbingBoxLoader, ClipLoader,
  ClockLoader, DotLoader, FadeLoader, GridLoader, HashLoader, MoonLoader,
  PacmanLoader, PropagateLoader, PuffLoader, PulseLoader, RingLoader,
  RiseLoader, RotateLoader, ScaleLoader, SkewLoader, SquareLoader, SyncLoader,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Unified spinner component that wraps both Fluent UI {@link Spinner} and
 * all `react-spinners` loader variants behind a single consistent API.
 *
 * @remarks
 * ### Rendering logic
 * 1. If `spinnerType === 'Default'` → renders `<Spinner>` from Fluent UI.
 * 2. If `spinnerType` matches a key in {@link REACT_SPINNERS} → renders the
 *    corresponding react-spinners component inside a flex wrapper div, with
 *    a `<Text size={200}>` label positioned via a direction CSS class.
 * 3. If `spinnerType` is unrecognised (e.g. dynamic/invalid value) →
 *    **falls back silently** to the Fluent UI `<Spinner>` (same as case 1).
 *
 * ### Colour resolution
 * The `color` prop (or the default `tokens.colorBrandBackground`) is passed
 * through {@link resolveFluentToken} before being forwarded to react-spinners,
 * because those components require a concrete CSS colour value, not a
 * `var(--token)` expression.
 *
 * ### Accessibility
 * - For `'Default'`, Fluent UI handles ARIA roles internally.
 * - For react-spinners variants, consider wrapping the rendered output in an
 *   `aria-live="polite"` region at the page level for screen reader support.
 *
 * @param props - {@link ICustomSpinnerProps}
 *
 * @example
 * // Fluent UI default – recommended for standard loading states:
 * <CustomSpinner label="Loading context…" />
 *
 * @example
 * // Large Fluent UI spinner with label above:
 * <CustomSpinner size="large" label="Please wait…" labelPosition="above" />
 *
 * @example
 * // react-spinners variant with default brand colour:
 * <CustomSpinner spinnerType="BarLoader" label="Fetching data…" />
 *
 * @example
 * // react-spinners variant with explicit colour and label to the right:
 * <CustomSpinner
 *   spinnerType="MoonLoader"
 *   label="Loading…"
 *   labelPosition="after"
 *   color="#0078d4"
 * />
 *
 * @example
 * // react-spinners variant with a Fluent UI token colour (resolved automatically):
 * <CustomSpinner
 *   spinnerType="RingLoader"
 *   label="Syncing…"
 *   color={tokens.colorPaletteBlueBorderActive}
 * />
 */
export function CustomSpinner({
  label,
  size = 'medium',
  spinnerType = 'Default',
  labelPosition = 'below',
  color,
}: ICustomSpinnerProps) {
  const styles = useCustomSpinnerStyles()

  // AI-CONTEXT: resolveFluentToken converts 'var(--colorBrandBackground)' → '#0078d4'.
  // This is necessary because react-spinners cannot consume CSS var() expressions.
  const resolvedColor = resolveFluentToken(color ?? tokens.colorBrandBackground)

  // Branch 1: Native Fluent UI spinner – colour is theme-driven, not prop-driven.
  if (spinnerType === 'Default') {
    return <Spinner size={size} label={label} labelPosition={labelPosition} />
  }

  const ReactSpinner = REACT_SPINNERS[spinnerType]

  // Branch 2: Known react-spinners variant.
  if (ReactSpinner) {
    // AI-CONTEXT: Direction classes control flex-direction in customspinner.styles.ts.
    // 'below'  → column        (spinner on top, label below)
    // 'above'  → column-reverse (label above, spinner below)
    // 'after'  → row           (spinner left, label right)
    // 'before' → row-reverse   (label left, spinner right)
    const directionClass = {
      below: styles.directionBelow,
      above: styles.directionAbove,
      after: styles.directionAfter,
      before: styles.directionBefore,
    }[labelPosition]

    return (
      <div className={mergeClasses(styles.wrapper, directionClass)}>
        <ReactSpinner color={resolvedColor} />
        <Text size={200}>{label}</Text>
      </div>
    )
  }

  // Branch 3: Unrecognised spinnerType – silent fallback to Fluent UI Spinner.
  // AI-CONTEXT: This branch is a safety net for dynamic/invalid spinnerType values.
  // It should never be reached in normal usage if SpinnerType union is respected.
  return <Spinner size={size} label={label} labelPosition={labelPosition} />
}
