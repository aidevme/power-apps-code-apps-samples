import { createContext, useContext } from 'react'

/** Shape of the app-level theme context. */
export interface IThemeContext {
  /** `true` when {@link webDarkTheme} is active, `false` for {@link webLightTheme}. */
  isDark: boolean
}

/** React context that carries the active Fluent UI theme variant. */
export const ThemeContext = createContext<IThemeContext>({ isDark: false })

/**
 * Returns the active Fluent UI theme variant from the nearest {@link ThemeContext} provider.
 *
 * @returns `isDark` — `true` when the dark theme is active.
 */
export function useAppTheme(): IThemeContext {
  return useContext(ThemeContext)
}
