/**
 * Application route path constants.
 *
 * Single source of truth for all route paths used in `<Route path="...">` in
 * `App.tsx` and in the {@link routeLabels} lookup used by {@link AppBreadcrumb}.
 */
export const ROUTES = {
  HOME:           '/',
  CRUD:           '/crud',
  FUNCTIONS:      '/functions',
  ACTIONS:        '/actions',
  CUSTOM_ACTIONS: '/custom-actions',
  CUSTOM_APIS:    '/custom-apis',
  FLOWS:          '/flows',
  AZURE_SQL:      '/azure-sql',
  AZURE_FUNCTIONS:'/azure-functions',
  SHAREPOINT:     '/sharepoint',
  ENV_VARIABLES:  '/env-variables',
  GRAPH:          '/graph',
  DOCS:           '/docs',
} as const

/**
 * Maps application route paths to their human-readable section labels.
 *
 * Used by {@link AppBreadcrumb} to derive the active section name from the
 * current React Router pathname without duplicating route definitions.
 */
export const routeLabels: Record<string, string> = {
  [ROUTES.CRUD]:           'CRUD Operations',
  [ROUTES.FUNCTIONS]:      'Dataverse Functions',
  [ROUTES.ACTIONS]:        'Dataverse Actions',
  [ROUTES.CUSTOM_ACTIONS]: 'Dataverse Custom Actions',
  [ROUTES.CUSTOM_APIS]:    'Dataverse Custom APIs',
  [ROUTES.FLOWS]:          'Power Automate Flows',
  [ROUTES.AZURE_SQL]:      'Azure SQL',
  [ROUTES.AZURE_FUNCTIONS]:'Azure Functions',
  [ROUTES.SHAREPOINT]:     'SharePoint',
  [ROUTES.ENV_VARIABLES]:  'Environment Variables',
  [ROUTES.GRAPH]:          'Microsoft Graph API',
  [ROUTES.DOCS]:           'Documentation',
}
