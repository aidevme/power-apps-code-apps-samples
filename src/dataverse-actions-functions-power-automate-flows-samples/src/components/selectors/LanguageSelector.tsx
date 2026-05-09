import type { ReactElement } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components'
import { LANGUAGES } from '../../tools'
import { useLanguageSelectorStyles } from '../../styles/languageselector.styles'

const _flagAssets = import.meta.glob<string>('/src/assets/flags/*.png', { eager: true, query: '?url', import: 'default' })

/** Lookup map from ISO country code to Vite-processed flag image URL. */
const FLAG_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(_flagAssets).map(([path, url]) => [path.split('/').pop()!.replace('.png', ''), url])
)

function FlagImg({ code, label }: { code: string; label: string }): ReactElement {
  const styles = useLanguageSelectorStyles()
  return <img src={FLAG_URLS[code] ?? ''} alt={label} className={styles.flag} />
}

/** Props for {@link LanguageSelector}. */
export interface ILanguageSelectorProps {
  /** Currently selected LCID. @defaultValue `1033` */
  value?: number
  /** Called when the user picks a different language, passing the new LCID. */
  onChange?: (lcid: number) => void
  /** When `true`, the menu button is disabled. @defaultValue `false` */
  disabled?: boolean
}

/**
 * Fluent UI `MenuButton` listing all supported Dataverse UI languages by LCID.
 *
 * Displays the flag and name of the currently selected language on the button;
 * clicking opens a dropdown menu of all available locales.
 *
 * @example
 * ```tsx
 * const [lcid, setLcid] = useState(1033)
 * <LanguageSelector value={lcid} onChange={setLcid} />
 * ```
 */
export function LanguageSelector({ value = 1033, onChange, disabled = false }: ILanguageSelectorProps): ReactElement {
  const selected = LANGUAGES.find(l => l.lcid === value) ?? LANGUAGES[0]

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton appearance="subtle" disabled={disabled}>
          <FlagImg code={selected.flagCode} label={selected.englishName} />
          {selected.englishName}
        </MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {LANGUAGES.map(({ lcid, flagCode, englishName, nativeName }) => (
            <MenuItem key={lcid} onClick={() => onChange?.(lcid)}>
              <FlagImg code={flagCode} label={englishName} />
              {englishName} — {nativeName}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
