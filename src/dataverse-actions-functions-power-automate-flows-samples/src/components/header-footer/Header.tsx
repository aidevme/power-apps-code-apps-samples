import { Title1, Body1, Caption1, Badge, Button, Tooltip, ToggleButton } from '@fluentui/react-components'
import { DatabasePlugConnectedRegular, SettingsRegular, WeatherSunnyRegular, WeatherMoonRegular } from '@fluentui/react-icons'
import { useHeaderStyles } from '../../styles/header.styles'
import { useHeader } from '../../hooks'
import { AppSearchBox } from '../search/SearchBox'
import { LanguageSelector } from '../selectors/LanguageSelector'

/** Props for {@link Header}. */
interface IHeaderProps {
  /** Primary heading displayed in the banner. */
  title: string;
  /** Descriptive paragraph rendered below the title. */
  description: string;
  /** Optional list of technology tags rendered as outlined badges. */
  tags?: string[];
  /** Whether dark mode is currently active. Controls the theme toggle button state. */
  isDark: boolean;
  /** Called when the user clicks the theme toggle button. */
  onThemeToggle: () => void;
  /** Called when the user clicks the Settings button. */
  onSettings: () => void;
  /** Current value of the search input. */
  searchValue?: string;
  /** Called when the search input value changes. */
  onSearchChange?: (value: string) => void;
  /** Currently selected language LCID. @defaultValue `1033` */
  selectedLanguage?: number;
  /** Called when the user selects a different language. */
  onLanguageChange?: (lcid: number) => void;
}

/**
 * Full-width hero banner displayed at the top of the application.
 *
 * Renders a gradient header containing an icon, title, description, optional
 * technology badges, and an icon-only Settings button positioned in the
 * top-right corner.
 *
 * @example
 * ```tsx
 * <Header
 *   title="My App"
 *   description="A short description of the app."
 *   tags={['Power Platform', 'React']}
 *   onSettings={() => setSettingsOpen(true)}
 * />
 * ```
 */

export function Header({ title, description, tags, isDark, onThemeToggle, onSettings, searchValue, onSearchChange, selectedLanguage, onLanguageChange }: IHeaderProps) {
  const styles = useHeaderStyles()
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
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <Badge key={tag} appearance="outline" shape="rounded" className={styles.tag}>{tag}</Badge>
          ))}
        </div>
      )}
      <AppSearchBox value={searchValue} onChange={onSearchChange} isDisabled={!isSearchEnabled} />
      <div className={styles.controls}>
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
        <Tooltip content="Select display language" relationship="description" positioning="below" withArrow>
          <span>
            <LanguageSelector value={selectedLanguage} onChange={onLanguageChange} />
          </span>
        </Tooltip>
      </div>
    </header>
  )
}

