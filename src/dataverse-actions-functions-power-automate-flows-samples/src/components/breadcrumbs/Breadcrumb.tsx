import {
  Breadcrumb,
  BreadcrumbDivider,
} from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBreadcrumbStyles } from '../../styles/breadcrumb.styles'
import { routeLabels, routeParents } from '../../tools'
import { Crumb } from './Crumb'

/** Props for {@link AppBreadcrumb}. */
export interface IBreadcrumbProps {
  /**
   * Label for the root "Home" crumb.
   * @defaultValue `'Home'`
   */
  homeLabel?: string
  /**
   * Overrides the current-page crumb label derived from {@link routeLabels}.
   * Use this to show a dynamic value such as an entity display name.
   */
  dynamicLabel?: string
}

/**
 * Application-level breadcrumb navigation.
 *
 * Reads the current route from React Router's `useLocation` to derive the
 * active section label automatically, and uses `useNavigate` for navigation.
 *
 * @example
 * ```tsx
 * <AppBreadcrumb />
 * ```
 */
export function AppBreadcrumb({ homeLabel = 'Home', dynamicLabel }: IBreadcrumbProps) {
  const styles = useBreadcrumbStyles()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentLabel = dynamicLabel ?? routeLabels[pathname] ?? null
  const parentPath = routeParents[pathname] ?? null
  const parentLabel = parentPath ? (routeLabels[parentPath] ?? null) : null

  return (
    <Breadcrumb aria-label="Navigation">
      <Crumb
        label={homeLabel}
        tooltip={currentLabel !== null ? `Go back to ${homeLabel}` : `You are on the ${homeLabel} page`}
        current={currentLabel === null}
        className={styles.crumb}
        onClick={() => navigate('/')}
      />
      {parentLabel !== null && parentPath !== null && (
        <>
          <BreadcrumbDivider />
          <Crumb
            label={parentLabel}
            tooltip={`Go back to ${parentLabel}`}
            current={false}
            className={styles.crumb}
            onClick={() => navigate(parentPath)}
          />
        </>
      )}
      {currentLabel !== null && (
        <>
          <BreadcrumbDivider />
          <Crumb
            label={currentLabel}
            tooltip={`You are currently viewing: ${currentLabel}`}
            current
            className={styles.crumb}
          />
        </>
      )}
    </Breadcrumb>
  )
}
