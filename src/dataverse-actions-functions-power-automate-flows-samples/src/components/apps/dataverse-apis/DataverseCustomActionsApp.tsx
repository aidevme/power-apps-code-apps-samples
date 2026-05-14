import { Notes } from '../../misc/notes/Notes'
import type { NoteType } from '../../misc/notes/Notes'

const DATAVERSE_CUSTOM_ACTIONS_APP_DESCRIPTION =
  'Invoke Dataverse Custom API Actions (unbound POST operations) and display their responses. ' +
  'Demonstrates request body construction, typed response models, and the PAC CLI-generated service layer.'

const DATAVERSE_CUSTOM_ACTIONS_APP_NOTE_TYPE: NoteType = 'info'
const DATAVERSE_CUSTOM_ACTIONS_APP_INFO_LABEL_TEXT =
  'Custom API Actions are unbound POST operations registered in Dataverse. ' +
  'Called via /api/data/v9.2/ActionName with a JSON request body. ' +
  'A 204 No Content response indicates success with no return value. ' +
  'Responses are typed using PAC CLI-generated models.'
const DATAVERSE_CUSTOM_ACTIONS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Props for {@link DataverseCustomActionsApp}. */
export interface IDataverseCustomActionsAppProps {
  // reserved for future configuration props
}

/**
 * Lists and invokes registered Dataverse Custom API Actions (unbound POST operations).
 *
 * @example
 * ```tsx
 * <DataverseCustomActionsApp />
 * ```
 */
export function DataverseCustomActionsApp(_props: IDataverseCustomActionsAppProps) {
  return (
    <Notes
      noteType={DATAVERSE_CUSTOM_ACTIONS_APP_NOTE_TYPE}
      showInfoLabel={DATAVERSE_CUSTOM_ACTIONS_APP_INFO_LABEL_TEXT}
      infoLabelLink={DATAVERSE_CUSTOM_ACTIONS_APP_INFO_LABEL_LINK}
    >
      {DATAVERSE_CUSTOM_ACTIONS_APP_DESCRIPTION}
    </Notes>
  )
}
