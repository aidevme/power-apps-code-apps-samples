import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Button,
  Divider,
  Text,
  Spinner,
  Badge,
  tokens,
} from '@fluentui/react-components'
import {
  DismissRegular,
  SettingsRegular,
  PersonRegular,
  MailRegular,
  KeyRegular,
  BuildingRegular,
  AppGenericRegular,
  CloudRegular,
  TagRegular,
} from '@fluentui/react-icons'
import { type ReactElement } from 'react'
import type { IContext } from '@microsoft/power-apps/app'
import { useSettingsPanelStyles } from '../styles/settingspanel.styles'

/** Props for {@link SettingsPanel}. */
export interface ISettingsPanelProps {
  /**
   * Whether the drawer is open.
   * @defaultValue `false`
   */
  open: boolean
  /** Called when the user closes the panel. */
  onClose: () => void
  /** Power Apps host context resolved at app startup. */
  context: IContext | null
  /** Whether the context fetch is still in progress. */
  contextLoading: boolean
}

/**
 * Slide-in settings panel rendered as a Fluent UI `OverlayDrawer` on the
 * right side of the page, overlaying the full application.
 *
 * @example
 * ```tsx
 * const [settingsOpen, setSettingsOpen] = useState(false)
 *
 * <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
 * ```
 */
export function SettingsPanel({ open, onClose, context, contextLoading }: ISettingsPanelProps) {
  const styles = useSettingsPanelStyles()

  const ctxRows: Array<{ label: string; value: string | undefined; icon: ReactElement; bg: string }> = context ? [
    { label: 'Full Name',   value: context.user.fullName,           icon: <PersonRegular />,     bg: '#0f6cbd' },
    { label: 'UPN',         value: context.user.userPrincipalName,  icon: <MailRegular />,       bg: '#8764b8' },
    { label: 'User ID',     value: context.user.objectId,           icon: <KeyRegular />,        bg: '#038387' },
    { label: 'Tenant ID',   value: context.user.tenantId,           icon: <BuildingRegular />,   bg: '#c43501' },
    { label: 'App ID',      value: context.app.appId,               icon: <AppGenericRegular />, bg: '#107c10' },
    { label: 'Environment', value: context.app.environmentId,       icon: <CloudRegular />,      bg: '#e3008c' },
    { label: 'Session ID',  value: context.host.sessionId,          icon: <TagRegular />,        bg: '#ca5010' },
  ] : []

  return (
    <OverlayDrawer
      open={open}
      position="end"
      className={styles.drawer}
      onOpenChange={(_, { open: isOpen }) => { if (!isOpen) onClose() }}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close Settings"
              icon={<DismissRegular />}
              onClick={onClose}
            />
          }
        >
          <SettingsRegular style={{ marginRight: tokens.spacingHorizontalS }} />
          Settings
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.body}>
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>General</Text>
            <Text size={200}>Configure application preferences and display options.</Text>
          </div>
          <Divider />
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>About</Text>
            <Text size={200}>Dataverse Actions, Functions &amp; Power Automate Flows sample app.</Text>
            {contextLoading && <Spinner size="tiny" label="Loading context…" />}
            {!contextLoading && context && (
              <div className={styles.contextList}>
                {ctxRows.map(({ label, value, icon, bg }) => (
                  <div key={label} className={styles.contextCard}>
                    <div className={styles.contextIconWrap} style={{ backgroundColor: bg, color: '#ffffff' }}>
                      {icon}
                    </div>
                    <div className={styles.contextText}>
                      <Text size={100} className={styles.contextLabel}>{label}</Text>
                      <Text size={200} className={styles.contextValue}>{value ?? '—'}</Text>
                    </div>
                    {label === 'Session ID' && (
                      <Badge appearance="filled" color="success" size="small" style={{ marginLeft: 'auto', flexShrink: 0 }}>live</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DrawerBody>
    </OverlayDrawer>
  )
}
