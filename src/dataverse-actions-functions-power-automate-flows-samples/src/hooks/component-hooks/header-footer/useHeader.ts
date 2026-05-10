import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../../tools'

/** Return value of {@link useHeader}. */
export interface IUseHeaderResult {
  /** Whether the search box should be enabled on the current route. */
  isSearchEnabled: boolean
}

/**
 * Provides route-derived display state for the {@link Header} component.
 *
 * @returns `isSearchEnabled` — `true` only when the current route is the documentation page.
 * @example
 * ```ts
 * const { isSearchEnabled } = useHeader()
 * ```
 */
export function useHeader(): IUseHeaderResult {
  const { pathname } = useLocation()
  return {
    isSearchEnabled: pathname === ROUTES.DOCS,
  }
}
