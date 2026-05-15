// AI-CONTEXT: Home-page shell component — renders the top-level section-card navigation grid.
// AI-FILE-RELATIONS:
//   - styles:   src/styles/mainapp.styles.ts          (layout tokens)
//   - consumer: src/components/routes/AppRoutes.tsx   (mounted at the root route)
//   - child:    src/components/cards/SectionCardsList.tsx (grid of navigation cards)
// AI-PATTERN: Pure layout shell — add new home-page sections to SectionCardsList, not here.
import type { ReactElement } from 'react'
import { useMainAppStyles } from '../../styles/mainapp.styles'
import { SectionCardsList } from '../cards/SectionCardsList'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for {@link MainApp}.
 *
 * @remarks
 * Currently empty — reserved for future configuration props such as a feature-flag
 * map or a selected-section override for deep-linking scenarios.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMainAppProps {
  // reserved for future configuration props
}

// ---------------------------------------------------------------------------
// MainApp
// ---------------------------------------------------------------------------

/**
 * Home-page root component — renders the full-width section-card navigation grid.
 *
 * @remarks
 * Pure layout shell. All navigation card data and routing is owned by
 * {@link SectionCardsList}. This component only provides the outer container
 * with the correct spacing and width constraints from `useMainAppStyles`.
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
