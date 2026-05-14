import { useState } from 'react';
import { UsersettingscollectionService } from '../../generated/services/UsersettingscollectionService';
import type { Usersettingscollection } from '../../generated/models/UsersettingscollectionModel';

/** Result returned by {@link useUserSettings}. */
export interface IUseUserSettingsResult {
  /** The user settings record, or `null` while loading or if not found. */
  userSettings: Usersettingscollection | null;
  /** Whether a fetch is currently in progress. */
  loading: boolean;
  /**
   * Fetches the `usersettingscollection` record for the given Dataverse `systemuserid`.
   *
   * Selects only the fields relevant for locale and timezone detection:
   * `uilanguageid`, `localeid`, `helplanguageid`, and `timezonecode`.
   *
   * @param systemUserId - The Dataverse `systemuserid` GUID to look up.
   * @example
   * ```ts
   * const { userSettings, loadUserSettings } = useUserSettings()
   * await loadUserSettings('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
   * console.log(userSettings?.uilanguageid) // e.g. 1033
   * ```
   */
  loadUserSettings: (systemUserId: string) => Promise<void>;
}

/**
 * Fetches the Dataverse user settings record for a given system user.
 *
 * Exposes `uilanguageid`, `localeid`, `helplanguageid`, and `timezonecode`
 * from the `usersettingscollection` table. Call `loadUserSettings(systemUserId)`
 * after resolving the user's `systemuserid` from {@link useSystemUsers}.
 *
 * @returns `userSettings`, `loading`, and `loadUserSettings`.
 * @example
 * ```tsx
 * const { userSettings, loadUserSettings } = useUserSettings()
 * useEffect(() => {
 *   if (systemUserId) loadUserSettings(systemUserId)
 * }, [systemUserId])
 * ```
 */
export function useUserSettings(): IUseUserSettingsResult {
  const [userSettings, setUserSettings] = useState<Usersettingscollection | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUserSettings = async (systemUserId: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await UsersettingscollectionService.get(systemUserId, {
        select: ['uilanguageid', 'localeid', 'helplanguageid', 'timezonecode'],
      });
      if (result.data) setUserSettings(result.data);
    } catch (err) {
      console.error('Error loading user settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return { userSettings, loading, loadUserSettings };
}
