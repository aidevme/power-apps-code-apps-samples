import { makeStyles, tokens } from '@fluentui/react-components'
import { Notes } from '../../misc/Notes'
import type { NoteType } from '../../misc/Notes'

const CONFIGURATION_SETTINGS_APP_NOTE_TYPE: NoteType = 'info'
const CONFIGURATION_SETTINGS_APP_DESCRIPTION =
  'Lists all configuration setting records from the aidevme_codeappssamplesconfigurationsetting Dataverse table. ' +
  'Each record stores a named key/value pair used to drive runtime behaviour of the app.'
const CONFIGURATION_SETTINGS_APP_INFO_LABEL_TEXT =
  'Configuration settings are stored as rows in a custom Dataverse table and fetched via the PAC CLI-generated service layer. ' +
  'This pattern keeps environment-specific values out of source code and makes them manageable through the Power Platform admin centre.'
const CONFIGURATION_SETTINGS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Styles for {@link ConfigurationSettingsApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
})

/** Props for {@link ConfigurationSettingsApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IConfigurationSettingsAppProps {
  // reserved for future configuration props
}

/**
 * Displays configuration setting records from the Dataverse
 * aidevme_codeappssamplesconfigurationsetting table.
 *
 * @example
 * ```tsx
 * <ConfigurationSettingsApp />
 * ```
 */
export function ConfigurationSettingsApp() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Notes
        noteType={CONFIGURATION_SETTINGS_APP_NOTE_TYPE}
        showInfoLabel={CONFIGURATION_SETTINGS_APP_INFO_LABEL_TEXT}
        infoLabelLink={CONFIGURATION_SETTINGS_APP_INFO_LABEL_LINK}
      >
        {CONFIGURATION_SETTINGS_APP_DESCRIPTION}
      </Notes>
    </div>
  )
}