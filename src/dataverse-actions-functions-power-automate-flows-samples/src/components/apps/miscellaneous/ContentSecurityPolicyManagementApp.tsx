import { makeStyles, tokens } from '@fluentui/react-components'
import { Notes } from '../../misc/Notes'
import type { NoteType } from '../../misc/Notes'

const CONTENT_SECURITY_POLICY_APP_NOTE_TYPE: NoteType = 'info'
const CONTENT_SECURITY_POLICY_APP_DESCRIPTION =
  'Manage the Content Security Policy (CSP) headers applied to this Power Apps Code App. ' +
  'CSP directives control which external origins the browser is permitted to load scripts, styles, images, and other resources from.'
const CONTENT_SECURITY_POLICY_APP_INFO_LABEL_TEXT =
  'CSP for Power Apps Code Apps is configured via the Power Platform admin centre or through environment-level settings. ' +
  'A misconfigured policy will surface as blocked network requests in the browser console. ' +
  'Use the \'report-uri\' or \'report-to\' directive with Azure Application Insights to capture violations.'
const CONTENT_SECURITY_POLICY_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Styles for {@link ContentSecurityPolicyManagementApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
})

/** Props for {@link ContentSecurityPolicyManagementApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IContentSecurityPolicyManagementAppProps {
  // reserved for future configuration props
}

/**
 * Displays Content Security Policy management information and configuration
 * guidance for Power Apps Code Apps.
 *
 * @example
 * ```tsx
 * <ContentSecurityPolicyManagementApp />
 * ```
 */
export function ContentSecurityPolicyManagementApp() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Notes
        noteType={CONTENT_SECURITY_POLICY_APP_NOTE_TYPE}
        showInfoLabel={CONTENT_SECURITY_POLICY_APP_INFO_LABEL_TEXT}
        infoLabelLink={CONTENT_SECURITY_POLICY_APP_INFO_LABEL_LINK}
      >
        {CONTENT_SECURITY_POLICY_APP_DESCRIPTION}
      </Notes>
    </div>
  )
}