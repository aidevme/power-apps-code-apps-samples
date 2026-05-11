import { Notes } from '../../misc/Notes'
import type { NoteType } from '../../misc/Notes'

const DATAVERSE_FUNCTIONS_APP_DESCRIPTION =
  'Invoke Dataverse Custom API Functions (unbound GET operations) and display their responses. ' +
  'Demonstrates OData inline parameter syntax, typed response models, and the PAC CLI-generated service layer.'

const DATAVERSE_FUNCTIONS_APP_NOTE_TYPE: NoteType = 'info'
const DATAVERSE_FUNCTIONS_APP_INFO_LABEL_TEXT =
  "Custom API Functions are unbound GET operations registered in Dataverse. " +
  "Called via /api/data/v9.2/FunctionName(Param='value') using OData inline parameters. " +
  "Responses are typed using PAC CLI-generated models. No request body is sent."
const DATAVERSE_FUNCTIONS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

export function DataverseFunctionsApp() {
  return (
    <Notes
      noteType={DATAVERSE_FUNCTIONS_APP_NOTE_TYPE}
      showInfoLabel={DATAVERSE_FUNCTIONS_APP_INFO_LABEL_TEXT}
      infoLabelLink={DATAVERSE_FUNCTIONS_APP_INFO_LABEL_LINK}
    >
      {DATAVERSE_FUNCTIONS_APP_DESCRIPTION}
    </Notes>
  )
}