// AI-CONTEXT: Application-level breadcrumb navigation bar — derives crumbs automatically from the current React Router pathname.
// AI-FILE-RELATIONS:
//   - styles:  src/components/ui/navigation/NavigationBar.styles.ts  (useNavigationBarStyles — private)
//   - tools:   src/tools/routes.ts                                   (ROUTES, routeLabels, routeParents)
//   - consumer: src/App.tsx                                          (rendered above the <Routes> block on every view)
// AI-PATTERN: To add a new breadcrumb level, add the route to ROUTES, routeLabels, and routeParents in tools/routes.ts — no changes needed here.
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbItem,
  BreadcrumbButton,
  Tooltip,
} from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { routeLabels, routeParents } from '../../../tools'
import { useNavigationBarStyles } from './NavigationBar.styles'

/** Props for {@link NavigationBar}. */
export interface INavigationBarProps {
  /**
   * Label for the root "Home" crumb.
   *
   * @defaultValue `'Home'`
   */
  homeLabel?: string
  /**
   * Overrides the current-page crumb label derived from {@link routeLabels}.
   * Use this to display a dynamic value such as a record display name.
   *
   * @example
   * ```tsx
   * <NavigationBar dynamicLabel={entity.displayName} />
   * ```
   */
  dynamicLabel?: string
}

/**
 * Application-level breadcrumb navigation bar.
 *
 * @remarks
 * Reads the current pathname from React Router's `useLocation` and derives up to three
 * crumb levels automatically from {@link routeLabels} and {@link routeParents}:
 *
 * 1. **Home** — always present; marked `current` when at the root route.
 * 2. **Parent** — rendered when the current route has a parent in `routeParents`.
 * 3. **Current** — the active page label, optionally overridden via `dynamicLabel`.
 *
 * All navigation is handled by `useNavigate`; no `<a>` tags are used.
 *
 * @param props - See {@link INavigationBarProps}.
 * @returns A Fluent UI {@link Breadcrumb} wrapped in a styled `<nav>` container,
 *          or `null` when on the home route with no active section.
 *
 * @example
 * ```tsx
 * // Basic usage — place above the <Routes> block in App.tsx
 * <NavigationBar />
 *
 * // With a dynamic label for a detail view
 * <NavigationBar dynamicLabel={selectedEntity?.displayName} />
 * ```
 */
export function NavigationBar({ homeLabel = 'Home', dynamicLabel }: INavigationBarProps) {
  const styles = useNavigationBarStyles()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // AI-CONTEXT: currentLabel is null on the home route — Home crumb is marked current in that case.
  const currentLabel = dynamicLabel ?? routeLabels[pathname] ?? null
  const isHome       = currentLabel === null
  const parentPath   = routeParents[pathname] ?? null
  const parentLabel  = parentPath ? (routeLabels[parentPath] ?? null) : null

  return (
    <nav className={styles.root}>
      <Breadcrumb aria-label="Navigation breadcrumb">
        {/* Home crumb — current when on the root route, clickable otherwise */}
        <BreadcrumbItem>
          {isHome
            ? <BreadcrumbButton current>{homeLabel}</BreadcrumbButton>
            : (
              <Tooltip content={`Go back to ${homeLabel}`} relationship="description" positioning="below" withArrow>
                <BreadcrumbButton current={false} onClick={() => navigate('/')} className={styles.crumb}>
                  {homeLabel}
                </BreadcrumbButton>
              </Tooltip>
            )
          }
        </BreadcrumbItem>

        {/* Optional parent crumb */}
        {parentLabel !== null && parentPath !== null && (
          <>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <Tooltip content={`Go back to ${parentLabel}`} relationship="description" positioning="below" withArrow>
                <BreadcrumbButton current={false} onClick={() => navigate(parentPath)} className={styles.crumb}>
                  {parentLabel}
                </BreadcrumbButton>
              </Tooltip>
            </BreadcrumbItem>
          </>
        )}

        {/* Current page crumb — not rendered on home route */}
        {!isHome && (
          <>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current>
                {currentLabel}
              </BreadcrumbButton>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
    </nav>
  )
}
