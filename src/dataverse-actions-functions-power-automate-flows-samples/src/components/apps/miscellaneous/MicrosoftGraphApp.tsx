import { Notes } from '../../misc/Notes'
import type { NoteType } from '../../misc/Notes'

const MICROSOFT_GRAPH_APP_DESCRIPTION =
  'Call Microsoft Graph API endpoints from a Power Apps Code App using the authenticated user context. ' +
  'Demonstrates REST calls to Graph, response parsing, and typed result models.'

const MICROSOFT_GRAPH_APP_NOTE_TYPE: NoteType = 'info'
const MICROSOFT_GRAPH_APP_INFO_LABEL_TEXT =
  "Microsoft Graph API calls are made via fetch() to https://graph.microsoft.com/v1.0. " +
  "Authentication is handled transparently by the Power Apps connector — no token management is required in app code. " +
  "Responses follow the Graph OData envelope: value[] for collections, or a single resource object for individual lookups."
const MICROSOFT_GRAPH_APP_INFO_LABEL_LINK = 'https://aidevme.com'

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