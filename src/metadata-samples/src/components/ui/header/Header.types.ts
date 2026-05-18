// AI-CONTEXT: Prop contract for the Header hero-banner component — no language selector in this sample.
// AI-FILE-RELATIONS:
//   - consumer: src/components/ui/header/Header.tsx  (the only component that reads these props)
//   - consumer: src/App.tsx                          (passes controlled state into Header)
// AI-CONSTRAINT: Do not add language-selector props — this sample intentionally omits localisation.

/**
 * Props for the {@link Header} hero-banner component.
 *
 * @remarks
 * All callback props are lifted to the caller so Header remains fully stateless.
 * Optional props that are omitted simply suppress their associated UI region.
 */
export interface IHeaderProps {
  /** Primary heading displayed as an `<h1>` in the banner. */
  title: string
  /** Descriptive paragraph rendered below the title using `Body1`. */
  description: string
  /**
   * Optional list of technology tag strings rendered as outlined `Badge` elements.
   * When omitted or empty the tags row is hidden.
   */
  tags?: string[]
  /**
   * Whether dark mode is currently active.
   * Controls the icon and `checked` state of the theme toggle button.
   */
  isDark: boolean
  /** Called when the user clicks the theme toggle button. Should flip dark-mode state in the parent. */
  onThemeToggle: () => void
  /** Called when the user clicks the Settings icon button. Should open the settings panel in the parent. */
  onSettings: () => void
  /** Current value of the controlled search input. When omitted the search box renders empty. */
  searchValue?: string
  /** Called on every keystroke in the search input with the new value. Omit to hide the search box. */
  onSearchChange?: (value: string) => void
  /**
   * Optional subtitle rendered below the description as a secondary `Caption1` line.
   * Intended for dynamic context such as the currently active strategy.
   * When omitted the line is hidden.
   */
  subtitle?: string
}
