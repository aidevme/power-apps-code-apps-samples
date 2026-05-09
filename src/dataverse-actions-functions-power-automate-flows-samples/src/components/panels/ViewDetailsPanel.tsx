import type { ReactElement } from 'react'
import {
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Badge,
  Text,
  tokens,
} from '@fluentui/react-components'
import { DismissRegular, EyeRegular } from '@fluentui/react-icons'
import type { Savedqueries } from '../../generated/models/SavedqueriesModel'
import { useViewDetailsPanelStyles } from '../../styles/viewdetailspanel.styles'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for {@link ViewDetailsPanel}. */
export interface IViewDetailsPanelProps {
  /**
   * Whether the drawer is open.
   * @defaultValue `false`
   */
  open: boolean
  /** Called when the user closes the panel. */
  onClose: () => void
  /** The saved query record to display. `undefined` while no view is selected. */
  savedQuery: Savedqueries | undefined
}

// ---------------------------------------------------------------------------
// ViewDetailsPanel
// ---------------------------------------------------------------------------

/**
 * Slide-in panel that displays metadata about a selected Dataverse saved query (view).
 * Rendered as a Fluent UI `OverlayDrawer` on the right side of the page.
 *
 * @example
 * ```tsx
 * <ViewDetailsPanel open={open} onClose={() => setOpen(false)} savedQuery={selectedQuery} />
 * ```
 */
export function ViewDetailsPanel({ open, onClose, savedQuery }: IViewDetailsPanelProps): ReactElement {
  const styles = useViewDetailsPanelStyles()

  return (
    <OverlayDrawer open={open} position="end" size="large" onOpenChange={(_, { open: o }) => { if (!o) onClose() }}>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button appearance="subtle" aria-label="Close" icon={<DismissRegular />} onClick={onClose} />
          }
        >
          <EyeRegular style={{ marginRight: tokens.spacingHorizontalS }} />
          View Details
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        {savedQuery ? (
          <div className={styles.body}>
            <div className={styles.row}>
              <Text className={styles.label}>Name</Text>
              <Text weight="semibold">{savedQuery.name}</Text>
            </div>
            {savedQuery.description && (
              <div className={styles.row}>
                <Text className={styles.label}>Description</Text>
                <Text>{savedQuery.description}</Text>
              </div>
            )}
            <div className={styles.row}>
              <Text className={styles.label}>Entity</Text>
              <Text>{savedQuery.returnedtypecode}</Text>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Status</Text>
              <Badge
                appearance="filled"
                color={savedQuery.statecode === 0 ? 'success' : 'danger'}
              >
                {savedQuery.statecode === 0 ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Default View</Text>
              <Badge appearance="outline" color={savedQuery.isdefault ? 'brand' : 'subtle'}>
                {savedQuery.isdefault ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Custom</Text>
              <Text>{savedQuery.iscustom ? 'Yes' : 'No'}</Text>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Managed</Text>
              <Text>{savedQuery.ismanaged ? 'Yes' : 'No'}</Text>
            </div>
            {savedQuery.createdbyname && (
              <div className={styles.row}>
                <Text className={styles.label}>Created By</Text>
                <Text>{savedQuery.createdbyname}</Text>
              </div>
            )}
            {savedQuery.createdon && (
              <div className={styles.row}>
                <Text className={styles.label}>Created On</Text>
                <Text>{new Date(savedQuery.createdon).toLocaleString()}</Text>
              </div>
            )}
            {savedQuery.modifiedbyname && (
              <div className={styles.row}>
                <Text className={styles.label}>Modified By</Text>
                <Text>{savedQuery.modifiedbyname}</Text>
              </div>
            )}
            {savedQuery.modifiedon && (
              <div className={styles.row}>
                <Text className={styles.label}>Modified On</Text>
                <Text>{new Date(savedQuery.modifiedon).toLocaleString()}</Text>
              </div>
            )}
            {savedQuery.fetchxml && (
              <div className={styles.row}>
                <Text className={styles.label}>FetchXML</Text>
                <Text className={styles.fetchxml}>{savedQuery.fetchxml}</Text>
              </div>
            )}
            {savedQuery.layoutjson && (
              <div className={styles.row}>
                <Text className={styles.label}>Layout JSON</Text>
                <Text className={styles.fetchxml}>{savedQuery.layoutjson}</Text>
              </div>
            )}
          </div>
        ) : (
          <Text>No view selected.</Text>
        )}
      </DrawerBody>
    </OverlayDrawer>
  )
}
