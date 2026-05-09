import type { ReactElement } from 'react'
import type { SearchBoxProps } from '@fluentui/react-components'
import { SearchBox as FluentSearchBox } from '@fluentui/react-components'
import { useSearchBoxStyles } from '../../styles/searchbox.styles'

/** Props for {@link AppSearchBox}. */
export interface IAppSearchBoxProps {
  /** Current value of the search input. */
  value?: string;
  /** Called when the input value changes. */
  onChange?: (value: string) => void;
  /**
   * Placeholder text shown when the input is empty.
   * @defaultValue `'Search…'`
   */
  placeholder?: string;
  /**
   * When `true`, the search input is disabled and non-interactive.
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Visual appearance of the search input.
   * @defaultValue `'outline'`
   */
  appearance?: SearchBoxProps['appearance'];
}

/**
 * Themed search input rendered inside the app header banner.
 *
 * Wraps Fluent UI `SearchBox` with default appearance to match other controls.
 *
 * @example
 * ```tsx
 * <AppSearchBox value={search} onChange={setSearch} />
 * ```
 */
export function AppSearchBox({ value, onChange, placeholder = 'Search…', isDisabled = false, appearance = 'outline' }: IAppSearchBoxProps): ReactElement {
  const styles = useSearchBoxStyles()

  const disabledTokenOverrides = isDisabled ? {
    '--colorCompoundBrandStroke':         'var(--colorNeutralStroke1)',
    '--colorCompoundBrandStrokeHover':    'var(--colorNeutralStroke1Hover)',
    '--colorCompoundBrandStrokePressed':  'var(--colorNeutralStroke1Pressed)',
    '--colorCompoundBrandStrokeSelected': 'var(--colorNeutralStroke1Selected)',
  } as React.CSSProperties : undefined

  return (
    <div style={disabledTokenOverrides}>
      <FluentSearchBox
        className={styles.fieldWrapper}
        placeholder={placeholder}
        value={value ?? ''}
        disabled={isDisabled}
        appearance={appearance}
        onChange={(_, data) => onChange?.(data.value)}
      />
    </div>
  )
}
