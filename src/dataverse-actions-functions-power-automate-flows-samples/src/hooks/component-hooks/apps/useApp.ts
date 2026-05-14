// AI-CONTEXT: Aggregates all entity-metadata hooks, session bootstrap, and derives the shared metadataCache used by route components.
// AI-FILE-RELATIONS:
//   - consumer:  src/App.tsx                          (only caller — wires metadataCache and individual results to route components)
//   - hooks:     src/hooks/metadata-hooks/*            (one hook per Dataverse entity; all follow the two-effect pattern)
//   - types:     src/components/index.ts               (IEntityMetadataCacheEntry — shape stored in the cache map)
// AI-CONSTRAINT: Never call these metadata hooks from individual route components — they are mounted once here and passed as props.
// AI-PATTERN: To add a new entity, add its hook call, include its tableInfo in the tableInfos array, and add it to IUseAppMetadataResult.

import { useMemo, useState, useEffect, useRef } from 'react'
import type { IContext } from '@microsoft/power-apps/app'
import type { IEntityMetadataCacheEntry } from '../../../components'
import type { Usersettingscollection } from '../../../generated/models/UsersettingscollectionModel'
import {
  useContext,
  useEnvironmentVariable,
  useSystemUsers,
  useUserSettings,
  useEntities,
  useAadUserMetadata,
  useAccountMetadata,
  useAppEventLogMetadata,
  useAppointmentMetadata,
  useAuditMetadata,
  useBusinessUnitMetadata,
  useConfigurationSettingMetadata,
  useContactMetadata,
  useCustomApiMetadata,
  useCustomApiRequestParameterMetadata,
  useCustomApiResponsePropertyMetadata,
  useEmailMetadata,
  useEntitiesMetadata,
  useEnvironmentVariableDefinitionMetadata,
  useEnvironmentVariableValueMetadata,
  useLeadMetadata,
  useOpportunityMetadata,
  useSavedQueriesMetadata,
  useSolutionComponentDefinitionMetadata,
  useSolutionComponentMetadata,
  useSolutionMetadata,
  useSystemFormMetadata,
  useSystemUserMetadata,
  useTaskMetadata,
  useTeamMetadata,
  useTransactionCurrencyMetadata,
  useWebresourceMetadata,
} from '../../'
import type * as EntitiesModel from '../../../generated/models/EntitiesModel'
import type {
  IUseAadUserMetadataResult,
  IUseAccountMetadataResult,
  IUseAppEventLogMetadataResult,
  IUseAppointmentMetadataResult,
  IUseAuditMetadataResult,
  IUseBusinessUnitMetadataResult,
  IUseConfigurationSettingMetadataResult,
  IUseContactMetadataResult,
  IUseCustomApiMetadataResult,
  IUseCustomApiRequestParameterMetadataResult,
  IUseCustomApiResponsePropertyMetadataResult,
  IUseEmailMetadataResult,
  IUseEntitiesMetadataResult,
  IUseEnvironmentVariableDefinitionMetadataResult,
  IUseEnvironmentVariableValueMetadataResult,
  IUseLeadMetadataResult,
  IUseOpportunityMetadataResult,
  IUseSavedQueriesMetadataResult,
  IUseSolutionComponentDefinitionMetadataResult,
  IUseSolutionComponentMetadataResult,
  IUseSolutionMetadataResult,
  IUseSystemFormMetadataResult,
  IUseSystemUserMetadataResult,
  IUseTaskMetadataResult,
  IUseTeamMetadataResult,
  IUseTransactionCurrencyMetadataResult,
  IUseWebresourceMetadataResult,
} from '../../'

// AI-CONTEXT: Captured at module load time (not during render) to satisfy the no-impure-calls lint rule.
const APP_START_MS = performance.now()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// AI-CONTEXT: Ordered startup phases shown in the startup overlay — last three are simulated for UX continuity.
export type StartupPhase = 'context' | 'entities' | 'env-variables' | 'config-settings' | 'translations' | 'done'

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

/**
 * Return value of the {@link useAppMetadata} hook.
 *
 * @remarks
 * Contains the pre-built `metadataCache` lookup map and individual metadata results
 * for every Dataverse entity mounted at startup. Route components that need
 * per-entity metadata receive the relevant result object via props from `App.tsx`.
 */
export interface IUseAppMetadataResult {
  /** The resolved Power Apps host context, or `null` while loading or on error. */
  context: IContext | null
  /** `true` while the `getContext()` call is in flight. */
  contextLoading: boolean
  /**
   * Value of the `aidevme_GitHubRepositoryBaseUrl` environment variable, or `null` when not set.
   * Used to build the source link in the `Footer` component.
   */
  repoBaseUrl: string | null
  /** Resolved Dataverse `systemuserid` for the current AAD user, or `null` while resolving. */
  dataverseUserId: string | null
  /** User settings record from `usersettingscollection`, or `null` while loading or not found. */
  userSettings: Usersettingscollection | null
  /**
   * Map of entity logical name → {@link IEntityMetadataCacheEntry}.
   * Built from all hook `tableInfo` values via `useMemo`.
   * Used by `CRUDApp` and `EntityMetadataApp` for display-name resolution.
   */
  metadataCache: Record<string, IEntityMetadataCacheEntry>
  /** All Dataverse entity records, loaded after the 1 s startup delay. */
  entities: EntitiesModel.Entities[]
  /** `true` while the entity list is being fetched. */
  entitiesLoading: boolean
  /** Current startup phase — drives the loading overlay label in `App.tsx`. */
  startupPhase: StartupPhase
  /** `true` while the startup overlay should remain visible. */
  showOverlay: boolean
  /** Metadata result for the `aaduser` (Azure AD User) table. */
  aadUserMetadata: IUseAadUserMetadataResult
  /** Metadata result for the `account` table. */
  accountMetadata: IUseAccountMetadataResult
  /** Metadata result for the `aidevme_appeventlog` table. */
  appEventLogMetadata: IUseAppEventLogMetadataResult
  /** Metadata result for the `appointment` table. */
  appointmentMetadata: IUseAppointmentMetadataResult
  /** Metadata result for the `audit` table. */
  auditMetadata: IUseAuditMetadataResult
  /** Metadata result for the `businessunit` table. */
  businessUnitMetadata: IUseBusinessUnitMetadataResult
  /** Metadata result for the `aidevme_codeappssamplesconfigurationsetting` table. */
  configurationSettingMetadata: IUseConfigurationSettingMetadataResult
  /** Metadata result for the `contact` table. */
  contactMetadata: IUseContactMetadataResult
  /** Metadata result for the `customapi` table. */
  customApiMetadata: IUseCustomApiMetadataResult
  /** Metadata result for the `customapirequestparameter` table. */
  customApiRequestParameterMetadata: IUseCustomApiRequestParameterMetadataResult
  /** Metadata result for the `customapiresponseproperty` table. */
  customApiResponsePropertyMetadata: IUseCustomApiResponsePropertyMetadataResult
  /** Metadata result for the `email` table. */
  emailMetadata: IUseEmailMetadataResult
  /** Metadata result for the `entity` (Entities) table. */
  entitiesMetadata: IUseEntitiesMetadataResult
  /** Metadata result for the `environmentvariabledefinition` table. */
  environmentVariableDefinitionMetadata: IUseEnvironmentVariableDefinitionMetadataResult
  /** Metadata result for the `environmentvariablevalue` table. */
  environmentVariableValueMetadata: IUseEnvironmentVariableValueMetadataResult
  /** Metadata result for the `lead` table. */
  leadMetadata: IUseLeadMetadataResult
  /** Metadata result for the `opportunity` table. */
  opportunityMetadata: IUseOpportunityMetadataResult
  /** Metadata result for the `savedquery` (public views) table. */
  savedQueriesMetadata: IUseSavedQueriesMetadataResult
  /** Metadata result for the `solutioncomponentdefinition` table. */
  solutionComponentDefinitionMetadata: IUseSolutionComponentDefinitionMetadataResult
  /** Metadata result for the `solutioncomponent` table. */
  solutionComponentMetadata: IUseSolutionComponentMetadataResult
  /** Metadata result for the `solution` table. */
  solutionMetadata: IUseSolutionMetadataResult
  /** Metadata result for the `systemform` table. */
  systemFormMetadata: IUseSystemFormMetadataResult
  /** Metadata result for the `systemuser` table. */
  systemUserMetadata: IUseSystemUserMetadataResult
  /** Metadata result for the `task` table. */
  taskMetadata: IUseTaskMetadataResult
  /** Metadata result for the `team` table. */
  teamMetadata: IUseTeamMetadataResult
  /** Metadata result for the `transactioncurrency` table. */
  transactionCurrencyMetadata: IUseTransactionCurrencyMetadataResult
  /** Metadata result for the `webresource` table. */
  webresourceMetadata: IUseWebresourceMetadataResult
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Mounts all entity-metadata hooks once at startup and returns their results
 * alongside a pre-built `metadataCache` lookup map.
 *
 * @remarks
 * This hook is the single aggregation point for all Dataverse entity metadata.
 * Each of the 27 underlying hooks follows the two-effect pattern:
 * effect 1 fetches entity metadata on mount/retry; effect 2 fetches the
 * solution components once `MetadataId` resolves.
 *
 * `metadataCache` is derived via `useMemo` from all hook `tableInfo` values and
 * is stable across renders unless a table's metadata changes.
 *
 * **Extension pattern:** add the new hook call, include `newHook.tableInfo` in
 * both the `tableInfos` array and the `useMemo` dependency array, then add the
 * result to {@link IUseAppMetadataResult}.
 *
 * @returns {@link IUseAppMetadataResult} — all individual metadata results and the aggregated cache.
 *
 * @example
 * ```tsx
 * const { metadataCache, accountMetadata, contactMetadata } = useAppMetadata()
 * ```
 */
export function useAppMetadata(): IUseAppMetadataResult {
  // AI-CONTEXT: Session bootstrap — resolves Power Apps context, env variable, and Dataverse user identity.
  const { context, loading: contextLoading } = useContext()
  const { value: repoBaseUrl } = useEnvironmentVariable('aidevme_GitHubRepositoryBaseUrl')
  const { getSystemUserIdByAadObjectId } = useSystemUsers()
  const { userSettings, loadUserSettings } = useUserSettings()
  const [dataverseUserId, setDataverseUserId] = useState<string | null>(null)

  // AI-CONTEXT: Resolves the AAD object ID → Dataverse systemuserid, then loads user settings.
  // AI-CONSTRAINT: Do not add getSystemUserIdByAadObjectId or loadUserSettings to the dep array — they are stable function refs.
  useEffect(() => {
    if (context?.user.objectId) {
      getSystemUserIdByAadObjectId(context.user.objectId).then(id => {
        setDataverseUserId(id)
        if (id) loadUserSettings(id)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.user.objectId])

  // AI-CONTEXT: Entities are loaded after a 1 s delay post-context to avoid parallel startup contention.
  const [entitiesEnabled, setEntitiesEnabled] = useState(false)
  // AI-CONTEXT: null = real loading still in progress; other values = active simulated phase.
  const [simulatedPhase, setSimulatedPhase] = useState<'env-variables' | 'config-settings' | 'translations' | 'done' | null>(null)
  const { entities, loading: entitiesLoading } = useEntities(entitiesEnabled)

  // AI-CONTEXT: Delay entity loading by 1 s after context resolves to avoid parallel startup contention.
  useEffect(() => {
    if (contextLoading) return
    const timer = setTimeout(() => setEntitiesEnabled(true), 1000)
    return () => clearTimeout(timer)
  }, [contextLoading])

  // AI-CONTEXT: Drives simulated startup phase transitions after all real loading completes.
  // AI-CONSTRAINT: All setState calls are in timer callbacks to avoid synchronous setState-in-effect lint errors.
  // AI-CONSTRAINT: Simulated phase durations (800 / 800 / 600 ms) are cosmetic only — do not gate real logic on them.
  useEffect(() => {
    if (contextLoading || !entitiesEnabled || entitiesLoading) return
    const t0 = setTimeout(() => setSimulatedPhase('env-variables'), 0)
    const t1 = setTimeout(() => setSimulatedPhase('config-settings'), 800)
    const t2 = setTimeout(() => setSimulatedPhase('translations'), 1600)
    const t3 = setTimeout(() => setSimulatedPhase('done'), 2200)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [contextLoading, entitiesEnabled, entitiesLoading])

  // AI-CONTEXT: Derived display phase — real conditions take priority; simulatedPhase drives the three cosmetic tail phases.
  const startupPhase: StartupPhase = contextLoading ? 'context'
    : (!entitiesEnabled || entitiesLoading) ? 'entities'
    : simulatedPhase ?? 'env-variables'
  const showOverlay = contextLoading || !entitiesEnabled || entitiesLoading || simulatedPhase !== 'done'

  // AI-CONTEXT: Measures how long each startup phase lasts and logs it to the browser console.
  const phaseTimestampRef = useRef<number>(APP_START_MS)
  const prevPhaseRef = useRef<string>('(start)')
  useEffect(() => {
    const now = performance.now()
    const elapsed = Math.round(now - phaseTimestampRef.current)
    console.log(`[Startup] ${prevPhaseRef.current} → ${startupPhase} (+${elapsed}ms)`)
    prevPhaseRef.current = startupPhase
    phaseTimestampRef.current = now
  }, [startupPhase])

  const aadUserMetadata = useAadUserMetadata()
  const accountMetadata = useAccountMetadata()
  const appEventLogMetadata = useAppEventLogMetadata()
  const appointmentMetadata = useAppointmentMetadata()
  const auditMetadata = useAuditMetadata()
  const businessUnitMetadata = useBusinessUnitMetadata()
  const configurationSettingMetadata = useConfigurationSettingMetadata()
  const contactMetadata = useContactMetadata()
  const customApiMetadata = useCustomApiMetadata()
  const customApiRequestParameterMetadata = useCustomApiRequestParameterMetadata()
  const customApiResponsePropertyMetadata = useCustomApiResponsePropertyMetadata()
  const emailMetadata = useEmailMetadata()
  const entitiesMetadata = useEntitiesMetadata()
  const environmentVariableDefinitionMetadata = useEnvironmentVariableDefinitionMetadata()
  const environmentVariableValueMetadata = useEnvironmentVariableValueMetadata()
  const leadMetadata = useLeadMetadata()
  const opportunityMetadata = useOpportunityMetadata()
  const savedQueriesMetadata = useSavedQueriesMetadata()
  const solutionComponentDefinitionMetadata = useSolutionComponentDefinitionMetadata()
  const solutionComponentMetadata = useSolutionComponentMetadata()
  const solutionMetadata = useSolutionMetadata()
  const systemFormMetadata = useSystemFormMetadata()
  const systemUserMetadata = useSystemUserMetadata()
  const taskMetadata = useTaskMetadata()
  const teamMetadata = useTeamMetadata()
  const transactionCurrencyMetadata = useTransactionCurrencyMetadata()
  const webresourceMetadata = useWebresourceMetadata()

  // AI-CONTEXT: Build a map of logicalName → IEntityMetadataCacheEntry from all startup metadata hooks.
  // AI-PATTERN: Add new metadata hooks to the `tableInfos` array to automatically include them in the cache.
  // AI-CONSTRAINT: Only add hooks that are mounted unconditionally at App level — never conditionally mounted hooks.
  const metadataCache = useMemo<Record<string, IEntityMetadataCacheEntry>>(() => {
    const tableInfos = [
      accountMetadata.tableInfo, aadUserMetadata.tableInfo, appEventLogMetadata.tableInfo,
      appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
      configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
      customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
      emailMetadata.tableInfo, entitiesMetadata.tableInfo, environmentVariableDefinitionMetadata.tableInfo,
      environmentVariableValueMetadata.tableInfo, leadMetadata.tableInfo, opportunityMetadata.tableInfo,
      savedQueriesMetadata.tableInfo, solutionComponentDefinitionMetadata.tableInfo,
      solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo, systemFormMetadata.tableInfo,
      systemUserMetadata.tableInfo, taskMetadata.tableInfo, teamMetadata.tableInfo,
      transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
    ]
    const cache: Record<string, IEntityMetadataCacheEntry> = {}
    for (const info of tableInfos) {
      const logicalName = info.logicalName
      if (!logicalName) continue
      cache[logicalName] = {
        logicalName,
        displayName: info.displayName ?? logicalName,
        schemaName: info.schemaName ?? '',
        entityTypeCode: info.objectTypeCode,
        tableType: info.tableType ?? 'Standard',
        ownershipType: info.ownershipType ?? null,
        primaryIdAttribute: info.primaryIdAttribute ?? null,
        description: info.description ?? null,
        isActivity: info.isActivity ?? null,
      }
    }
    return cache
  }, [
    accountMetadata.tableInfo, aadUserMetadata.tableInfo, appEventLogMetadata.tableInfo,
    appointmentMetadata.tableInfo, auditMetadata.tableInfo, businessUnitMetadata.tableInfo,
    configurationSettingMetadata.tableInfo, contactMetadata.tableInfo,
    customApiMetadata.tableInfo, customApiRequestParameterMetadata.tableInfo, customApiResponsePropertyMetadata.tableInfo,
    emailMetadata.tableInfo, entitiesMetadata.tableInfo, environmentVariableDefinitionMetadata.tableInfo,
    environmentVariableValueMetadata.tableInfo, leadMetadata.tableInfo, opportunityMetadata.tableInfo,
    savedQueriesMetadata.tableInfo, solutionComponentDefinitionMetadata.tableInfo,
    solutionComponentMetadata.tableInfo, solutionMetadata.tableInfo, systemFormMetadata.tableInfo,
    systemUserMetadata.tableInfo, taskMetadata.tableInfo, teamMetadata.tableInfo,
    transactionCurrencyMetadata.tableInfo, webresourceMetadata.tableInfo,
  ])

  return {
    context, contextLoading, repoBaseUrl, dataverseUserId, userSettings,
    metadataCache, entities, entitiesLoading, startupPhase, showOverlay,
    aadUserMetadata, accountMetadata, appEventLogMetadata, appointmentMetadata, auditMetadata,
    businessUnitMetadata, configurationSettingMetadata, contactMetadata,
    customApiMetadata, customApiRequestParameterMetadata, customApiResponsePropertyMetadata,
    emailMetadata, entitiesMetadata, environmentVariableDefinitionMetadata, environmentVariableValueMetadata,
    leadMetadata, opportunityMetadata, savedQueriesMetadata,
    solutionComponentDefinitionMetadata, solutionComponentMetadata, solutionMetadata,
    systemFormMetadata, systemUserMetadata, taskMetadata, teamMetadata,
    transactionCurrencyMetadata, webresourceMetadata,
  }
}
