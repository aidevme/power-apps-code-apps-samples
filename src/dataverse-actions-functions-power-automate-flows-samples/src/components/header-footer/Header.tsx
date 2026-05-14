// AI-CONTEXT: Full-width hero banner component — renders the app title, description, technology badges, search box, theme toggle, settings button, and language selector.
// AI-FILE-RELATIONS:
//   - styles:   src/styles/index.ts                              (useHeaderStyles — Griffel layout and gradient classes)
//   - hook:     src/hooks/component-hooks/useHeader.ts           (provides isSearchEnabled flag)
//   - child:    src/components/search/SearchBox.tsx              (AppSearchBox — controlled search input)
//   - child:    src/components/selectors/LanguageSelector.tsx    (LCID language picker)
//   - consumer: src/App.tsx                                      (renders Header at the top of every route)
// AI-CONSTRAINT: This is a pure presentational component — it must never own state or call service hooks directly.
// AI-PATTERN: Add new header controls inside the controls div; always wrap interactive elements in a Tooltip for accessibility.

import { Title1, Body1, Caption1, Badge, Button, Tooltip, ToggleButton } from '@fluentui/react-components'
import { DatabasePlugConnectedRegular, SettingsRegular, WeatherSunnyRegular, WeatherMoonRegular } from '@fluentui/react-icons'
import { useHeaderStyles } from '../../styles'
import { useHeader } from '../../hooks'
import { AppSearchBox } from '../search/SearchBox'
import { LanguageSelector } from '../selectors/LanguageSelector'

/**
 * Props for the {@link Header} component.
 *
 * @remarks
 * All callback props (`onThemeToggle`, `onSettings`, `onSearchChange`, `onLanguageChange`)
 * are lifted to the caller (`App.tsx`) so Header remains stateless.
 * Optional props that are omitted simply suppress their associated UI region.
 */
interface IHeaderProps {
  /** Primary heading displayed as an `<h1>` in the banner. */
  title: string
  /** Descriptive paragraph rendered below the title using `Body1`. */
  description: string
  /** Optional list of technology tag strings rendered as outlined `Badge` elements. When omitted or empty, the tags row is hidden. */
  tags?: string[]
  /**
   * Whether dark mode is currently active.
   * Controls the `checked` state and icon of the theme toggle button.
   */
  isDark: boolean
  /** Called when the user clicks the theme toggle button. Should flip the dark-mode state in the parent. */
  onThemeToggle: () => void
  /** Called when the user clicks the Settings icon button. Should open the settings panel in the parent. */
  onSettings: () => void
  /** Current value of the controlled search input. When omitted the search box renders empty. */
  searchValue?: string
  /** Called on every keystroke in the search input with the new value. */
  onSearchChange?: (value: string) => void
  /**
   * Currently selected display language as an LCID integer, e.g. `1033` for English (US).
   *
   * @defaultValue `1033`
   */
  selectedLanguage?: number
  /** Called when the user selects a different language from {@link LanguageSelector}. Receives the new LCID. */
  onLanguageChange?: (lcid: number) => void
}

/**
 * Full-width hero banner displayed at the top of the application.
 *
 * @remarks
 * **Layout sections (top → bottom):**
 *
 * 1. **Top row** — `DatabasePlugConnectedRegular` icon + eyebrow label + `Title1` heading.
 * 2. **Description** — `Body1` paragraph from the `description` prop.
 * 3. **Tags row** — outlined `Badge` elements, rendered only when `tags` is non-empty.
 * 4. **Search box** — `AppSearchBox` enabled/disabled by the `isSearchEnabled` flag from {@link useHeader}.
 * 5. **Controls row** — theme toggle (`ToggleButton`), settings (`Button`), and language selector,
 *    each wrapped in a `Tooltip` for keyboard/screen-reader accessibility.
 *
 * All state (dark mode, search value, selected language) is owned by the caller and
 * passed in as controlled props. Header is fully stateless.
 *
 * @param props - See {@link IHeaderProps} for the full prop reference.
 * @returns A `<header>` element containing the full hero banner layout.
 *
 * @example Minimal
 * ```tsx
 * <Header
 *   title="Dataverse Samples"
 *   description="Explore CRUD, metadata, and Custom API samples."
 *   isDark={false}
 *   onThemeToggle={() => setIsDark(d => !d)}
 *   onSettings={() => setSettingsOpen(true)}
 * />
 * ```
 *
 * @example With tags and search
 * ```tsx
 * <Header
 *   title="Dataverse Samples"
 *   description="Explore CRUD, metadata, and Custom API samples."
 *   tags={['Power Platform', 'React', 'TypeScript']}
 *   isDark={isDark}
 *   onThemeToggle={() => setIsDark(d => !d)}
 *   onSettings={() => setSettingsOpen(true)}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   selectedLanguage={language}
 *   onLanguageChange={setLanguage}
 * />
 * ```
 */
export function Header({ title, description, tags, isDark, onThemeToggle, onSettings, searchValue, onSearchChange, selectedLanguage, onLanguageChange }: IHeaderProps) {
  const styles = useHeaderStyles()
  // AI-CONTEXT: isSearchEnabled gates the search box — false when no searchable route is active.
  const { isSearchEnabled } = useHeader()
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.iconWrapper}>
          <DatabasePlugConnectedRegular />
        </div>
        <div className={styles.titleBlock}>
          <Caption1 className={styles.eyebrow}>Power Apps Code App</Caption1>
          <Title1 as="h1" className={styles.title}>{title}</Title1>
        </div>
      </div>
      <Body1 as="p" className={styles.description}>{description}</Body1>
      {/* AI-CONTEXT: Tags row is suppressed entirely when tags is undefined or empty — no empty div rendered. */}
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <Badge key={tag} appearance="outline" shape="rounded" className={styles.tag}>{tag}</Badge>
          ))}
        </div>
      )}
      <div className={styles.searchBox}>
        <AppSearchBox value={searchValue} onChange={onSearchChange} isDisabled={!isSearchEnabled} />
      </div>
      <div className={styles.controls}>
        {/* AI-CONTEXT: aria-label mirrors Tooltip content so screen readers announce the action correctly when focus is on the button. */}
        <Tooltip
          content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          relationship="description"
          positioning="below"
          withArrow
        >
          <ToggleButton
            appearance="subtle"
            icon={isDark ? <WeatherMoonRegular /> : <WeatherSunnyRegular />}
            className={styles.controlButton}
            checked={isDark}
            onClick={onThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </Tooltip>
        <Tooltip content="Open Settings" relationship="description" positioning="below" withArrow>
          <Button
            appearance="subtle"
            icon={<SettingsRegular />}
            className={styles.controlButton}
            onClick={onSettings}
            aria-label="Settings"
          />
        </Tooltip>
        {/* AI-CONTEXT: LanguageSelector is wrapped in a <span> because Tooltip requires a single focusable child element. */}
        <Tooltip content="Select display language" relationship="description" positioning="below" withArrow>
          <span>
            <LanguageSelector value={selectedLanguage} onChange={onLanguageChange} />
          </span>
        </Tooltip>
      </div>
    </header>
  )
}


