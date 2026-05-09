import './App.css'
import { useState, useEffect } from 'react'
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Spinner,
} from '@fluentui/react-components'
import { Header, MainApp, AppBreadcrumb, Footer, SettingsPanel } from './components'
import {
  CRUDApp, DataverseFunctionsApp, DataverseActionsApp,
  DataverseCustomActionsApp, DataverseCustomAPIsApp,
  PowerAutomateFlowsApp, DocumentationsApp,
  AzureSQLApp, SharePointApp, EnvironmentVariablesApp, AzureFunctionsApp, MicrosoftGraphApp,
} from './components'
import { useEntities, useContext, useEnvironmentVariable, useSystemUsers, useUserSettings } from './hooks'
import { useAppStyles } from './styles/app.styles'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './tools'

export default function App() {
  const styles = useAppStyles()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(1033)
  const { entities, loading: entitiesLoading } = useEntities()
  const { context, loading: contextLoading } = useContext()
  const { value: repoBaseUrl } = useEnvironmentVariable('aidevme_GitHubRepositoryBaseUrl')
  const { getSystemUserIdByAadObjectId } = useSystemUsers()
  const { userSettings, loadUserSettings } = useUserSettings()
  const [dataverseUserId, setDataverseUserId] = useState<string | null>(null)

  useEffect(() => {
    if (context?.user.objectId) {
      getSystemUserIdByAadObjectId(context.user.objectId).then(id => {
        setDataverseUserId(id)
        if (id) loadUserSettings(id)
      })
    }
  }, [context?.user.objectId])

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
          searchValue={search}
          onSearchChange={setSearch}
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
        <AppBreadcrumb />
        <Routes>
          <Route path={ROUTES.HOME} element={<MainApp />} />
          <Route path={ROUTES.CRUD} element={<CRUDApp entities={entities} entitiesLoading={entitiesLoading} />} />
          <Route path={ROUTES.FUNCTIONS} element={<DataverseFunctionsApp />} />
          <Route path={ROUTES.ACTIONS} element={<DataverseActionsApp />} />
          <Route path={ROUTES.CUSTOM_ACTIONS} element={<DataverseCustomActionsApp />} />
          <Route path={ROUTES.CUSTOM_APIS} element={<DataverseCustomAPIsApp />} />
          <Route path={ROUTES.FLOWS} element={<PowerAutomateFlowsApp />} />
          <Route path={ROUTES.AZURE_SQL} element={<AzureSQLApp />} />
          <Route path={ROUTES.AZURE_FUNCTIONS} element={<AzureFunctionsApp />} />
          <Route path={ROUTES.SHAREPOINT} element={<SharePointApp />} />
          <Route path={ROUTES.ENV_VARIABLES} element={<EnvironmentVariablesApp />} />
          <Route path={ROUTES.GRAPH} element={<MicrosoftGraphApp />} />
          <Route path={ROUTES.DOCS} element={<DocumentationsApp />} />
        </Routes>
        <Footer
          description="This app demonstrates typed Dataverse service calls using PAC CLI-generated services. It covers Custom API Functions (GET) via WhoAmIService and Custom API Actions (POST) via AddToQueueService."
          sourceLabel={repoBaseUrl?.replace('https://github.com/', '') ?? 'aidevme/power-apps-code-apps-samples'}
          sourceUrl={repoBaseUrl ?? 'https://github.com/aidevme/power-apps-code-apps-samples'}
        />
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} context={context} contextLoading={contextLoading} dataverseUserId={dataverseUserId} userSettings={userSettings} />
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

