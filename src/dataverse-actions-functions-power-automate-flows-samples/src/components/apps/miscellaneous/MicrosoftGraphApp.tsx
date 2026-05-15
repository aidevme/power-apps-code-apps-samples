import { Notes } from '../../misc/notes/Notes'
import {
  MICROSOFT_GRAPH_APP_DESCRIPTION,
  MICROSOFT_GRAPH_APP_NOTE_TYPE,
  MICROSOFT_GRAPH_APP_INFO_LABEL_TEXT,
  MICROSOFT_GRAPH_APP_INFO_LABEL_LINK,
} from '../../../tools/notes.const'

/** Props for {@link MicrosoftGraphApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMicrosoftGraphAppProps {
  // reserved for future configuration props
}

/**
 * Microsoft Graph API sample — calls Graph endpoints using the authenticated user context.
 *
 * @example
 * ```tsx
 * <MicrosoftGraphApp />
 * ```
 */
export function MicrosoftGraphApp() {
  return (
    <Notes
      noteType={MICROSOFT_GRAPH_APP_NOTE_TYPE}
      showInfoLabel={MICROSOFT_GRAPH_APP_INFO_LABEL_TEXT}
      infoLabelLink={MICROSOFT_GRAPH_APP_INFO_LABEL_LINK}
    >
      {MICROSOFT_GRAPH_APP_DESCRIPTION}
    </Notes>
  )
}