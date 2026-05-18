// AI-CONTEXT: Prop contract for the Footer component.
// AI-CONSTRAINT: No language-selector or theme props — Footer is display-only.

/**
 * Props for the {@link Footer} component.
 *
 * @remarks
 * All three props are required — pass empty strings to suppress text visually,
 * but prefer providing real values for accessibility.
 */
export interface IFooterProps {
  /** Short description of the sample app displayed below the brand label. */
  description: string
  /**
   * Human-readable label for the source link on the right side of the footer,
   * e.g. `"aidevme/power-apps-code-apps-samples"`.
   */
  sourceLabel: string
  /**
   * URL that `sourceLabel` links to. Opens in a new tab with `rel="noopener noreferrer"`.
   *
   * @remarks
   * Never hardcode environment-specific URLs — pass the value from a prop or config.
   */
  sourceUrl: string
}
