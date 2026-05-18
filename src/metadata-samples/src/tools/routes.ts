// AI-CONTEXT: Route path constants, parent-child relationships, and human-readable labels for all app routes.
// AI-FILE-RELATIONS:
//   - consumer: src/App.tsx                                    (Route path= attributes)
//   - consumer: src/components/ui/navigation/NavigationBar.tsx (breadcrumb derivation)
// AI-PATTERN: Add a new route by adding an entry to ROUTES, routeLabels, and (if it has a parent) routeParents.
// AI-CONSTRAINT: This is the single source of truth for route paths — never hard-code path strings elsewhere.

/**
 * Application route path constants.
 *
 * @remarks
 * Single source of truth for all route paths used in `<Route path="...">` in `App.tsx`
 * and in the {@link routeLabels} lookup consumed by {@link NavigationBar}.
 */
export const ROUTES = {
  HOME:             '/',
  REFERENCE:        '/reference',
  METADATA:         '/metadata',
  METADATA_ERD:     '/metadata/erd',
  METADATA_BROWSER: '/metadata/browser',
  METADATA_DETAILS: '/metadata/details',
} as const

/**
 * Maps child route paths to their logical parent route path.
 *
 * @remarks
 * Used by {@link NavigationBar} to render intermediate crumbs between Home and the
 * current page when navigating into a sub-section.
 *
 * @example
 * `/metadata/erd` is a child of `/metadata`, so the breadcrumb renders
 * `Home > Metadata > ERD Diagram`.
 */
export const routeParents: Partial<Record<string, string>> = {
  [ROUTES.METADATA_ERD]:     ROUTES.METADATA,
  [ROUTES.METADATA_BROWSER]: ROUTES.METADATA,
  [ROUTES.METADATA_DETAILS]: ROUTES.METADATA_BROWSER,
}

/**
 * Maps application route paths to their human-readable section labels.
 *
 * @remarks
 * Used by {@link NavigationBar} to derive the active crumb label from the current
 * React Router pathname without duplicating route definitions.
 */
export const routeLabels: Record<string, string> = {
  [ROUTES.REFERENCE]:        'Reference',
  [ROUTES.METADATA]:         'Metadata',
  [ROUTES.METADATA_ERD]:     'ERD Diagram',
  [ROUTES.METADATA_BROWSER]: 'Metadata Browser',
  [ROUTES.METADATA_DETAILS]: 'Metadata Details',
}
