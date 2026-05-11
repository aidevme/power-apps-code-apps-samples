// AI-CONTEXT: Fluent UI v9 makeStyles definitions for the top-level App component.
// AI-FILE-RELATIONS:
//   - consumer: src/App.tsx  (useAppStyles drives the startup overlay and loading overlays)
// AI-CONSTRAINT: Do not add component-specific styles here — only App-level layout classes belong in this file.
// AI-PATTERN: One makeStyles call per component style file; do not merge with other component style files.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI v9 style hook for the top-level {@link App} component.
 *
 * @remarks
 * Returns Griffel atomic CSS class names consumed exclusively by `App.tsx`.
 * Griffel deduplicates generated `<style>` rules across renders, so calling
 * this hook in multiple mounted instances has no performance cost.
 *
 * ### Class responsibilities
 * | Class | Purpose |
 * |---|---|
 * | `loadingOverlay` | Semi-transparent fixed overlay shown during in-page loading states |
 * | `startupOverlay` | Full-viewport blocking overlay shown on initial context/entities load; renders above all other content (`z-index: 2000`) |
 *
 * @example
 * ```tsx
 * const styles = useAppStyles()
 * {isLoading && <div className={styles.loadingOverlay}><Spinner /></div>}
 * {contextLoading && <div className={styles.startupOverlay}><CustomSpinner spinnerType="ClockLoader" label="Loading…" /></div>}
 * ```
 */
export const useAppStyles = makeStyles({
  loadingOverlay: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 242, 241, 0.65)',
    zIndex: 1000,
  },
  startupOverlay: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 2000,
  },
})
