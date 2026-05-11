import { makeStyles, tokens } from '@fluentui/react-components'
import { Notes } from '../../misc/Notes'
import {
  AZURE_BLOB_STORAGE_APP_DESCRIPTION,
  AZURE_BLOB_STORAGE_APP_NOTE_TYPE,
  AZURE_BLOB_STORAGE_APP_INFO_LABEL_TEXT,
  AZURE_BLOB_STORAGE_APP_INFO_LABEL_LINK,
} from '../../../tools/notes.const'

/** Styles for {@link AzureBlobStorageApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
})

/** Props for {@link AzureBlobStorageApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAzureBlobStorageAppProps {
  // reserved for future configuration props
}

/**
 * Demonstrates reading and writing files in Azure Blob Storage
 * from a Power Apps Code App via Power Automate flows or a custom connector.
 *
 * @example
 * ```tsx
 * <AzureBlobStorageApp />
 * ```
 */
export function AzureBlobStorageApp() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Notes
        noteType={AZURE_BLOB_STORAGE_APP_NOTE_TYPE}
        showInfoLabel={AZURE_BLOB_STORAGE_APP_INFO_LABEL_TEXT}
        infoLabelLink={AZURE_BLOB_STORAGE_APP_INFO_LABEL_LINK}
      >
        {AZURE_BLOB_STORAGE_APP_DESCRIPTION}
      </Notes>
    </div>
  )
}
