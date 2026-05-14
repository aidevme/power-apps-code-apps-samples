import type { ReactElement } from 'react'
import { useMainAppStyles } from '../../styles/mainapp.styles'
import { SectionCardsList } from '../cards/SectionCardsList'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for {@link MainApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMainAppProps {
  // reserved for future configuration props
}

// ---------------------------------------------------------------------------
// MainApp
// ---------------------------------------------------------------------------

/**
 * Home page root — renders the section-card grid via {@link SectionCardsList}.
 *
 * @example
 * ```tsx
 * <MainApp />
 * ```
 */
export function MainApp(): ReactElement {
  const styles = useMainAppStyles()

  return (
    <div className={styles.root}>
      <SectionCardsList />
    </div>
  )
}
