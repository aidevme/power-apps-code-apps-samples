// AI-CONTEXT: App-level React context for the active Fluent UI theme variant (light / dark).
// AI-FILE-RELATIONS:
//   - provider: src/App.tsx                          (creates the state and wraps the tree with ThemeContext.Provider)
//   - consumer: src/styles/*.styles.ts               (reads isDark to select the correct token set)
// AI-PATTERN: Every component that needs the theme reads it via useAppTheme() — never via direct useContext(ThemeContext).

import { createContext, useContext } from 'react'

/**
 * Shape of the app-level theme context value.
 *
 * @remarks
 * The context is initialised with `{ isDark: false }` (light theme) so consumers
 * that render outside a {@link ThemeContext} provider receive a safe default.
 */
export interface IThemeContext {
  /**
   * Whether the dark Fluent UI theme is currently active.
   *
   * `true` → `webDarkTheme` is applied to the `FluentProvider`.
   * `false` → `webLightTheme` is applied to the `FluentProvider`.
   *
   * @defaultValue `false`
   */
  isDark: boolean
}

/**
 * React context that carries the active Fluent UI theme variant for the application.
 *
 * @remarks
 * Created with a default value of `{ isDark: false }` so tree-shaken or test renders
 * that omit the provider still receive a sensible light-theme default.
 * The context value is managed in `App.tsx` via `useState` and passed to
 * `<ThemeContext.Provider value={{ isDark }}>`.
 *
 * Consume this context through {@link useAppTheme} rather than calling
 * `useContext(ThemeContext)` directly.
 *
 * @defaultValue `{ isDark: false }`
 */
export const ThemeContext = createContext<IThemeContext>({ isDark: false })

/**
 * Returns the active Fluent UI theme variant from the nearest {@link ThemeContext} provider.
 *
 * @remarks
 * Wraps `useContext(ThemeContext)` to provide a stable, named hook for consumers,
 * keeping the context object itself an implementation detail.
 * Must be called from inside a React function component or custom hook.
 *
 * @returns The current {@link IThemeContext} value — `{ isDark }` where `isDark` is
 * `true` when the dark theme is active, `false` for the light theme.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isDark } = useAppTheme()
 *   return <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
 * }
 * ```
 */
export function useAppTheme(): IThemeContext {
  return useContext(ThemeContext)
}
