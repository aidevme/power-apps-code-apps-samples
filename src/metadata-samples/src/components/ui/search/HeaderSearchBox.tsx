// AI-CONTEXT: Ghost search input component styled for the Header hero banner — semi-transparent appearance on the purple gradient.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/search/HeaderSearchBox.styles.ts  (useHeaderSearchBoxStyles — private)
//   - consumer: src/components/ui/header/Header.tsx                 (rendered inside the header when onSearchChange is provided)
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import { SearchBox } from '@fluentui/react-components'
import { useHeaderSearchBoxStyles } from './HeaderSearchBox.styles'

/** Props for the {@link HeaderSearchBox} component. */
export interface IHeaderSearchBoxProps {
  /** Current controlled value of the search input. */
  value: string
  /** Called on every keystroke with the new search string. */
  onChange: (value: string) => void
  /**
   * Placeholder text shown when the input is empty.
   *
   * @defaultValue `'Search...'`
   */
  placeholder?: string
}

/**
 * Ghost search input styled for the Header hero banner.
 *
 * @remarks
 * Renders a Fluent UI {@link SearchBox} with semi-transparent white styling that blends
 * with the purple gradient background. Width is capped at `320px`.
 *
 * This component is stateless — the current value and change handler must be provided
 * by the caller (controlled pattern).
 *
 * @param props - See {@link IHeaderSearchBoxProps}.
 * @returns A `<div>` row wrapper containing the styled `SearchBox`.
 *
 * @example
 * ```tsx
 * <HeaderSearchBox
 *   value={search}
 *   onChange={setSearch}
 * />
 * ```
 */
export function HeaderSearchBox({ value, onChange, placeholder = 'Search...' }: IHeaderSearchBoxProps) {
  const styles = useHeaderSearchBoxStyles()
  return (
    <div className={styles.searchRow}>
      <SearchBox
        className={styles.searchBox}
        placeholder={placeholder}
        value={value}
        onChange={(_e, data) => onChange(data.value)}
        aria-label="Search"
      />
    </div>
  )
}
