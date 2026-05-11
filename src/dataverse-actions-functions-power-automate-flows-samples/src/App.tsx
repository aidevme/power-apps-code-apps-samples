import './App.css'
import { useState, useEffect } from 'react'
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components'
import { Header, MainApp, AppBreadcrumb, Footer, SettingsPanel, CustomSpinner } from './components'
import {
  CRUDApp, DataverseFunctionsApp, DataverseActionsApp,
  DataverseCustomActionsApp, DataverseCustomAPIsApp,
  PowerAutomateFlowsApp, DocumentationsApp,
  AzureSQLApp, SharePointApp, EnvironmentVariablesApp, AzureFunctionsApp, MicrosoftGraphApp,
  ERDDiagramApp, EntityDetailsApp, ConfigurationSettingsApp, ContentSecurityPolicyManagementApp, AzureBlobStorageApp,
} from './components'
import { useEntities, useContext, useEnvironmentVariable, useSystemUsers, useUserSettings, useAadUserMetadata, useAccountMetadata, useAppEventLogMetadata, useContactMetadata, useTaskMetadata } from './hooks'
import { useAppStyles } from './styles/app.styles'
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { ROUTES } from './tools'
import { ThemeContext } from './context/ThemeContext'

export default function App() {
  const styles = useAppStyles()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(1033)
  const { entities, loading: entitiesLoading } = useEntities()
  const { context, loading: contextLoading } = useContext()
  const accountMetadata = useAccountMetadata()
  const appEventLogMetadata = useAppEventLogMetadata()
  const contactMetadata = useContactMetadata()
  const aadUserMetadata = useAadUserMetadata()
  const taskMetadata = useTaskMetadata()

  useEffect(() => {
    if (!accountMetadata.loading) {
      if (accountMetadata.error) {
        console.error('[useAccountMetadata] error:', accountMetadata.error)
      } else {
        console.log('[useAccountMetadata] metadata:', accountMetadata.metadata)
        console.log('[useAccountMetadata] tableType:', accountMetadata.tableType)
        console.log('[useAccountMetadata] isActivity:', accountMetadata.isActivity)
        console.log('[useAccountMetadata] columnDisplayNames:', accountMetadata.columnDisplayNames)
        console.log('[useAccountMetadata] attributes:', accountMetadata.attributes)
        console.log('[useAccountMetadata] requiredAttributes:', accountMetadata.requiredAttributes)
      }
    }
  }, [accountMetadata.loading, accountMetadata.error, accountMetadata.metadata, accountMetadata.tableType, accountMetadata.isActivity, accountMetadata.columnDisplayNames, accountMetadata.attributes, accountMetadata.requiredAttributes])

  useEffect(() => {
    if (!contactMetadata.loading) {
      if (contactMetadata.error) {
        console.error('[useContactMetadata] error:', contactMetadata.error)
      } else {
        console.log('[useContactMetadata] metadata:', contactMetadata.metadata)
        console.log('[useContactMetadata] tableType:', contactMetadata.tableType)
        console.log('[useContactMetadata] isActivity:', contactMetadata.isActivity)
        console.log('[useContactMetadata] columnDisplayNames:', contactMetadata.columnDisplayNames)
        console.log('[useContactMetadata] attributes:', contactMetadata.attributes)
        console.log('[useContactMetadata] requiredAttributes:', contactMetadata.requiredAttributes)
      }
    }
  }, [contactMetadata.loading, contactMetadata.error, contactMetadata.metadata, contactMetadata.tableType, contactMetadata.isActivity, contactMetadata.columnDisplayNames, contactMetadata.attributes, contactMetadata.requiredAttributes])

  useEffect(() => {
    if (!taskMetadata.loading) {
      if (taskMetadata.error) {
        console.error('[useTaskMetadata] error:', taskMetadata.error)
      } else {
        console.log('[useTaskMetadata] metadata:', taskMetadata.metadata)
        console.log('[useTaskMetadata] tableType:', taskMetadata.tableType)
        console.log('[useTaskMetadata] isActivity:', taskMetadata.isActivity)
        console.log('[useTaskMetadata] columnDisplayNames:', taskMetadata.columnDisplayNames)
        console.log('[useTaskMetadata] attributes:', taskMetadata.attributes)
        console.log('[useTaskMetadata] requiredAttributes:', taskMetadata.requiredAttributes)
      }
    }
  }, [taskMetadata.loading, taskMetadata.error, taskMetadata.metadata, taskMetadata.tableType, taskMetadata.isActivity, taskMetadata.columnDisplayNames, taskMetadata.attributes, taskMetadata.requiredAttributes])

  useEffect(() => {
    if (!appEventLogMetadata.loading) {
      if (appEventLogMetadata.error) {
        console.error('[useAppEventLogMetadata] error:', appEventLogMetadata.error)
      } else {
        console.log('[useAppEventLogMetadata] metadata:', appEventLogMetadata.metadata)
        console.log('[useAppEventLogMetadata] tableType:', appEventLogMetadata.tableType)
        console.log('[useAppEventLogMetadata] isActivity:', appEventLogMetadata.isActivity)
        console.log('[useAppEventLogMetadata] columnDisplayNames:', appEventLogMetadata.columnDisplayNames)
        console.log('[useAppEventLogMetadata] attributes:', appEventLogMetadata.attributes)
        console.log('[useAppEventLogMetadata] requiredAttributes:', appEventLogMetadata.requiredAttributes)
      }
    }
  }, [appEventLogMetadata.loading, appEventLogMetadata.error, appEventLogMetadata.metadata, appEventLogMetadata.tableType, appEventLogMetadata.isActivity, appEventLogMetadata.columnDisplayNames, appEventLogMetadata.attributes, appEventLogMetadata.requiredAttributes])

  useEffect(() => {
    if (!aadUserMetadata.loading) {
      if (aadUserMetadata.error) {
        console.error('[useAadUserMetadata] error:', aadUserMetadata.error)
      } else {
        console.log('[useAadUserMetadata] metadata:', aadUserMetadata.metadata)
        console.log('[useAadUserMetadata] tableType:', aadUserMetadata.tableType)
        console.log('[useAadUserMetadata] isActivity:', aadUserMetadata.isActivity)
        console.log('[useAadUserMetadata] columnDisplayNames:', aadUserMetadata.columnDisplayNames)
        console.log('[useAadUserMetadata] attributes:', aadUserMetadata.attributes)
        console.log('[useAadUserMetadata] requiredAttributes:', aadUserMetadata.requiredAttributes)
      }
    }
  }, [aadUserMetadata.loading, aadUserMetadata.error, aadUserMetadata.metadata, aadUserMetadata.tableType, aadUserMetadata.isActivity, aadUserMetadata.columnDisplayNames, aadUserMetadata.attributes, aadUserMetadata.requiredAttributes])

  const { value: repoBaseUrl } = useEnvironmentVariable('aidevme_GitHubRepositoryBaseUrl')
  const { getSystemUserIdByAadObjectId } = useSystemUsers()
  const { userSettings, loadUserSettings } = useUserSettings()
  const [dataverseUserId, setDataverseUserId] = useState<string | null>(null)

  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const breadcrumbDynamicLabel = (() => {
    if (pathname === ROUTES.ENTITY_DETAILS) {
      const logicalName = searchParams.get('entity')
      const match = entities.find(e => e.logicalname === logicalName)
      const displayName = match?.name ?? logicalName
      return displayName ? `${displayName} - Details` : undefined
    }
    return undefined
  })()

  useEffect(() => {
    if (context?.user.objectId) {
      getSystemUserIdByAadObjectId(context.user.objectId).then(id => {
        setDataverseUserId(id)
        if (id) loadUserSettings(id)
      })
    }
  }, [context?.user.objectId])

  return (
    <ThemeContext.Provider value={{ isDark }}>
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
        <AppBreadcrumb dynamicLabel={breadcrumbDynamicLabel} />
        <Routes>
          <Route path={ROUTES.HOME} element={<MainApp />} />
          <Route path={ROUTES.CRUD} element={<CRUDApp entities={entities} entitiesLoading={entitiesLoading} />} />
          <Route path={ROUTES.FUNCTIONS} element={<DataverseFunctionsApp />} />
          <Route path={ROUTES.ACTIONS} element={<DataverseActionsApp />} />
          <Route path={ROUTES.CUSTOM_ACTIONS} element={<DataverseCustomActionsApp />} />
          <Route path={ROUTES.CUSTOM_APIS} element={<DataverseCustomAPIsApp />} />
          <Route path={ROUTES.FLOWS} element={<PowerAutomateFlowsApp />} />
          <Route path={ROUTES.AZURE_SQL} element={<AzureSQLApp />} />
          <Route path={ROUTES.AZURE_BLOB_STORAGE} element={<AzureBlobStorageApp />} />
          <Route path={ROUTES.AZURE_FUNCTIONS} element={<AzureFunctionsApp />} />
          <Route path={ROUTES.SHAREPOINT} element={<SharePointApp />} />
          <Route path={ROUTES.ENV_VARIABLES} element={<EnvironmentVariablesApp />} />
          <Route path={ROUTES.GRAPH} element={<MicrosoftGraphApp />} />
          <Route path={ROUTES.CONFIG_SETTINGS} element={<ConfigurationSettingsApp />} />
          <Route path={ROUTES.CSP_MANAGEMENT} element={<ContentSecurityPolicyManagementApp />} />
          <Route path={ROUTES.ERD_DIAGRAM} element={<ERDDiagramApp />} />
          <Route path={ROUTES.ENTITY_DETAILS} element={<EntityDetailsApp entities={entities} accountMetadata={accountMetadata} aadUserMetadata={aadUserMetadata} appEventLogMetadata={appEventLogMetadata} contactMetadata={contactMetadata} />} />
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
          <CustomSpinner
            size="large"
            spinnerType="ClimbingBoxLoader"
            label={contextLoading ? 'Loading context…' : 'Loading entities…'}
          />
        </div>
      )}
    </FluentProvider>
    </ThemeContext.Provider>
  )
}

