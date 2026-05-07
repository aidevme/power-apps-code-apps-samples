import './App.css'
import { useState } from 'react'
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Spinner,
} from '@fluentui/react-components'
import { Header, MainApp, AppBreadcrumb, Footer, SettingsPanel, viewLabels } from './components'
import type { View } from './components'
import { useEntities, useContext } from './hooks'
import { useAppStyles } from './styles/app.styles'

export default function App() {
  const styles = useAppStyles()
  const [view, setView] = useState<View>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { entities, loading: entitiesLoading } = useEntities()
  const { context, loading: contextLoading } = useContext()

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className="app">
        <Header
          title="Dataverse Actions & Functions"
          description="Explore patterns for integrating Power Apps Code Apps with Microsoft Dataverse — from CRUD operations and typed Custom API calls to triggering Power Automate flows. Each section is a runnable sample backed by PAC CLI-generated services."
          tags={['Power Platform', 'Power Apps', 'Dataverse', 'Power Automate', 'TypeScript', 'React']}
          onSettings={() => setSettingsOpen(true)}
          isDark={isDark}
          onThemeToggle={() => setIsDark(prev => !prev)}
        />
        <AppBreadcrumb
          currentLabel={view !== null ? viewLabels[view] : null}
          onHome={() => setView(null)}
        />
        <MainApp view={view} setView={setView} entities={entities} entitiesLoading={entitiesLoading} />
        <Footer
          description="This app demonstrates typed Dataverse service calls using PAC CLI-generated services. It covers Custom API Functions (GET) via WhoAmIService and Custom API Actions (POST) via AddToQueueService."
          sourceLabel="aidevme/power-apps-code-apps-samples"
          sourceUrl="https://github.com/aidevme/power-apps-code-apps-samples"
        />
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} context={context} contextLoading={contextLoading} />
      {(contextLoading || entitiesLoading) && (
        <div className={styles.startupOverlay}>
          <Spinner
            size="large"
            label={contextLoading ? 'Loading context…' : 'Loading entities…'}
          />
        </div>
      )}
    </FluentProvider>
  )
}

