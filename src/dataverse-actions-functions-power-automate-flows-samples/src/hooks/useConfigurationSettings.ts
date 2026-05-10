import { useState, useEffect, useCallback } from 'react'
import { Aidevme_codeappssamplesconfigurationsettingsService } from '../generated/services/Aidevme_codeappssamplesconfigurationsettingsService'
import type { Aidevme_codeappssamplesconfigurationsettings } from '../generated/models/Aidevme_codeappssamplesconfigurationsettingsModel'

/** Return value of {@link useConfigurationSettings}. */
export interface IUseConfigurationSettingsResult {
  /** All active configuration settings, ordered by key ascending. */
  settings: Aidevme_codeappssamplesconfigurationsettings[]
  /** `true` while the initial or reloaded fetch is in progress. */
  loading: boolean
  /** Error from the last failed fetch, or `null` when successful. */
  error: Error | null
  /** Manually re-fetches the configuration settings from Dataverse. */
  reload: () => void
}

/**
 * Loads all active Code Apps sample configuration settings from the
 * `aidevme_codeappssamplesconfigurationsetting` Dataverse table,
 * ordered alphabetically by key.
 *
 * @returns The list of settings, a `loading` flag, an `error` if the fetch
 *   failed, and a `reload` callback to manually re-fetch.
 *
 * @example
 * ```ts
 * const { settings, loading, error, reload } = useConfigurationSettings()
 * ```
 */
export function useConfigurationSettings(): IUseConfigurationSettingsResult {
  const [settings, setSettings] = useState<Aidevme_codeappssamplesconfigurationsettings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await Aidevme_codeappssamplesconfigurationsettingsService.getAll({
        select: [
          'aidevme_codeappssamplesconfigurationsettingid',
          'aidevme_key',
          'aidevme_value',
          'aidevme_configurationvaluetype',
          'aidevme_description',
          'aidevme_issecured',
          'aidevme_isvalid',
          'statecode',
          'statuscode',
          'createdon',
          'modifiedon',
        ],
        filter: 'statecode eq 0',
        orderBy: ['aidevme_key asc'],
      })
      if (!result.success) {
        throw new Error('Failed to load configuration settings')
      }
      setSettings(result.data ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { settings, loading, error, reload: load }
}
