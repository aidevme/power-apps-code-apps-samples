import { Body1, Button, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise20Regular } from '@fluentui/react-icons'
import { useEnvironmentVariables, useContext } from '../../../hooks'
import { EnvironmentVariablesTable } from '../../tables/EnvironmentVariablesTable'
import { Notes } from '../../misc/notes/Notes'
import type { NoteType } from '../../misc/notes/Notes'

const ENVIRONMENT_VARIABLES_APP_DESCRIPTION =
  'Lists all Power Platform environment variable definitions for the current environment. ' +
  'Retrieves definition metadata (schema name, type, default value) via the PAC CLI-generated service layer.'

const ENVIRONMENT_VARIABLES_APP_NOTE_TYPE: NoteType = 'info'
const ENVIRONMENT_VARIABLES_APP_INFO_LABEL_TEXT =
  'Environment variables are solution-aware configuration values stored in Dataverse. ' +
  'Definition records (environmentvariabledefinition) hold the schema name, type, and default value. ' +
  'Value overrides are stored in a separate environmentvariablevalue record linked by definition ID.'
const ENVIRONMENT_VARIABLES_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Styles for {@link EnvironmentVariablesApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  count: {
    color: tokens.colorNeutralForeground3,
  },
})

/** Props for {@link EnvironmentVariablesApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IEnvironmentVariablesAppProps {
  // reserved for future configuration props
}

/**
 * Lists all Power Platform environment variable definitions for the current
 * environment, loaded via the PAC CLI-generated {@link EnvironmentvariabledefinitionsService}.
 *
 * @example
 * ```tsx
 * <EnvironmentVariablesApp />
 * ```
 */
export function EnvironmentVariablesApp() {
  const styles = useStyles()
  const { definitions, loading, error, reload } = useEnvironmentVariables()
  const { context } = useContext()

  return (
    <div className={styles.root}>
      <Notes
        noteType={ENVIRONMENT_VARIABLES_APP_NOTE_TYPE}
        showInfoLabel={ENVIRONMENT_VARIABLES_APP_INFO_LABEL_TEXT}
        infoLabelLink={ENVIRONMENT_VARIABLES_APP_INFO_LABEL_LINK}
      >
        {ENVIRONMENT_VARIABLES_APP_DESCRIPTION}
      </Notes>
      <div className={styles.toolbar}>
        <Button
          icon={<ArrowClockwise20Regular />}
          appearance="subtle"
          onClick={reload}
          disabled={loading}
        >
          Refresh
        </Button>
        {!loading && !error && (
          <Body1 className={styles.count}>
            {definitions.length} variable{definitions.length !== 1 ? 's' : ''}
          </Body1>
        )}
      </div>
      <EnvironmentVariablesTable
        definitions={definitions}
        loading={loading}
        error={error}
        environmentId={context?.app.environmentId}
      />
    </div>
  )
}
