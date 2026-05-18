// AI-CONTEXT: Full-width hero banner — gradient background, icon, title, description, badges, search box, and top-right controls.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/header/Header.styles.ts  (useHeaderStyles)
//   - types:    src/components/ui/header/Header.types.ts   (IHeaderProps)
//   - consumer: src/App.tsx                                (renders Header at the top of every route)
// AI-CONSTRAINT: Pure presentational component — never own state or call service hooks directly.
// AI-PATTERN: Add new header controls inside the controls div; wrap every interactive element in a Tooltip.

import { Title1, Body1, Caption1, Badge, Button, Tooltip, ToggleButton } from '@fluentui/react-components'
import { DatabasePlugConnectedRegular, SettingsRegular, WeatherSunnyRegular, WeatherMoonRegular } from '@fluentui/react-icons'
import { useHeaderStyles } from './Header.styles'
import { HeaderSearchBox } from '../search/HeaderSearchBox'
import type { IHeaderProps } from './Header.types'

/**
 * Full-width hero banner displayed at the top of the application.
 *
 * @remarks
 * **Layout sections (top → bottom):**
 *
 * 1. **Top row** — `DatabasePlugConnectedRegular` icon + eyebrow label + `Title1` heading.
 * 2. **Description** — `Body1` paragraph from the `description` prop.
 * 3. **Tags row** — outlined `Badge` elements, rendered only when `tags` is non-empty.
 * 4. **Search box** — rendered only when `onSearchChange` is provided.
 * 5. **Controls row** — theme toggle and settings button anchored top-right, each wrapped in a `Tooltip`.
 *
 * All state (dark mode, search value) is owned by the caller; Header is fully stateless.
 *
 * @param props - See {@link IHeaderProps} for the full prop reference.
 * @returns A `<header>` element containing the full hero banner layout.
 *
 * @example Minimal
 * ```tsx
 * <Header
 *   title="Metadata Samples"
 *   description="Explore Dataverse metadata patterns."
 *   isDark={false}
 *   onThemeToggle={() => setIsDark(d => !d)}
 *   onSettings={() => setSettingsOpen(true)}
 * />
 * ```
 *
 * @example With tags and search
 * ```tsx
 * <Header
 *   title="Metadata Samples"
 *   description="Explore Dataverse metadata patterns."
 *   tags={['Power Platform', 'Dataverse', 'React']}
 *   isDark={isDark}
 *   onThemeToggle={() => setIsDark(d => !d)}
 *   onSettings={() => setSettingsOpen(true)}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 * />
 * ```
 */
export function Header({ title, description, subtitle, tags, isDark, onThemeToggle, onSettings, searchValue, onSearchChange }: IHeaderProps) {
  const styles = useHeaderStyles()
  return (
    <header className={styles.header}>
      {/* Top row: icon + eyebrow + title */}
      <div className={styles.top}>
        <div className={styles.iconWrapper}>
          <DatabasePlugConnectedRegular />
        </div>
        <div className={styles.titleBlock}>
          <Caption1 className={styles.eyebrow}>Power Apps Code App</Caption1>
          <Title1 as="h1" className={styles.title}>{title}</Title1>
        </div>
      </div>

      {/* Description paragraph */}
      <Body1 as="p" className={styles.description}>{description}</Body1>

      {/* AI-CONTEXT: Subtitle is suppressed when undefined — shown only after a strategy is selected. */}
      {subtitle && <Caption1 as="p" className={styles.subtitle}>{subtitle}</Caption1>}

      {/* AI-CONTEXT: Tags row is suppressed entirely when tags is undefined or empty — no empty div rendered. */}
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <Badge key={tag} appearance="outline" shape="rounded" className={styles.tag}>{tag}</Badge>
          ))}
        </div>
      )}

      {/* AI-CONTEXT: Search box only renders when a change handler is provided — keeps the banner clean for non-searchable views. */}
      {onSearchChange && (
        <HeaderSearchBox
          value={searchValue ?? ''}
          onChange={onSearchChange}
        />
      )}

      {/* Controls: theme toggle + settings — anchored top-right */}
      <div className={styles.controls}>
        {/* AI-CONTEXT: aria-label mirrors Tooltip content so screen readers announce the action correctly. */}
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
      </div>
    </header>
  )
}
