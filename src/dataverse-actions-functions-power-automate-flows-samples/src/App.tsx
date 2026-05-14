import './App.css'
import { useState } from 'react'
import {
  FluentProvider,
  IdPrefixProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components'
import { Header, AppBreadcrumb, Footer, SettingsPanel, CustomSpinner, AppRoutes } from './components'
import { useAppMetadata } from './hooks/component-hooks/apps/useApp'
import { useAppStyles } from './styles/app.styles'

import { useLocation, useSearchParams } from 'react-router-dom'
import { ROUTES } from './tools'
import { ThemeContext } from './context/ThemeContext'

export default function App() {
  const styles = useAppStyles()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(1033)

  // AI-CONTEXT: Session bootstrap, all entity metadata hooks, metadataCache, entities, and startup phase are aggregated in useAppMetadata.
  const {
    context, contextLoading, repoBaseUrl, dataverseUserId, userSettings,
    metadataCache, entities, entitiesLoading, startupPhase, showOverlay,
    accountMetadata, aadUserMetadata, appEventLogMetadata, appointmentMetadata,
    auditMetadata, businessUnitMetadata, configurationSettingMetadata,
    contactMetadata, customApiMetadata, customApiRequestParameterMetadata, customApiResponsePropertyMetadata,
    emailMetadata, entitiesMetadata, environmentVariableDefinitionMetadata, environmentVariableValueMetadata,
    leadMetadata, opportunityMetadata, savedQueriesMetadata,
    solutionComponentDefinitionMetadata, solutionComponentMetadata, solutionMetadata,
    systemFormMetadata, systemUserMetadata, taskMetadata, teamMetadata,
    transactionCurrencyMetadata, webresourceMetadata,
  } = useAppMetadata()

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

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <IdPrefixProvider value="app">
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
            <AppRoutes
              entities={entities}
              entitiesLoading={entitiesLoading}
              metadataCache={metadataCache}
              accountMetadata={accountMetadata} aadUserMetadata={aadUserMetadata} appEventLogMetadata={appEventLogMetadata} appointmentMetadata={appointmentMetadata}
              auditMetadata={auditMetadata} businessUnitMetadata={businessUnitMetadata} configurationSettingMetadata={configurationSettingMetadata}
              contactMetadata={contactMetadata} customApiMetadata={customApiMetadata} customApiRequestParameterMetadata={customApiRequestParameterMetadata} customApiResponsePropertyMetadata={customApiResponsePropertyMetadata}
              emailMetadata={emailMetadata} entitiesMetadata={entitiesMetadata} environmentVariableDefinitionMetadata={environmentVariableDefinitionMetadata} environmentVariableValueMetadata={environmentVariableValueMetadata}
              leadMetadata={leadMetadata} opportunityMetadata={opportunityMetadata} savedQueriesMetadata={savedQueriesMetadata}
              solutionComponentDefinitionMetadata={solutionComponentDefinitionMetadata} solutionComponentMetadata={solutionComponentMetadata} solutionMetadata={solutionMetadata}
              systemFormMetadata={systemFormMetadata} systemUserMetadata={systemUserMetadata} taskMetadata={taskMetadata} teamMetadata={teamMetadata}
              transactionCurrencyMetadata={transactionCurrencyMetadata} webresourceMetadata={webresourceMetadata}
            />
            <Footer
              description="This app demonstrates typed Dataverse service calls using PAC CLI-generated services. It covers Custom API Functions (GET) via WhoAmIService and Custom API Actions (POST) via AddToQueueService."
              sourceLabel={repoBaseUrl?.replace('https://github.com/', '') ?? 'aidevme/power-apps-code-apps-samples'}
              sourceUrl={repoBaseUrl ?? 'https://github.com/aidevme/power-apps-code-apps-samples'}
            />
          </div>
          <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} context={context} contextLoading={contextLoading} dataverseUserId={dataverseUserId} userSettings={userSettings} />
          {showOverlay && (
            <div className={styles.startupOverlay}>
              <CustomSpinner
                size="large"
                spinnerType="BeatLoader"
                label={
                  startupPhase === 'context'          ? 'Loading context…'
                  : startupPhase === 'entities'       ? 'Loading entities metadata…'
                  : startupPhase === 'env-variables'  ? 'Loading configuration: Environment variables…'
                  : startupPhase === 'config-settings'? 'Loading configuration: Configuration settings…'
                  :                                     'Loading translations…'
                }
              />
            </div>
          )}
        </FluentProvider>
      </IdPrefixProvider>
    </ThemeContext.Provider>
  )
}

