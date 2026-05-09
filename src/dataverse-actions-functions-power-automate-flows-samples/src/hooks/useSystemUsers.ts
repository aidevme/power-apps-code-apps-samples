import { useState, useEffect } from 'react';
import { SystemusersService } from '../generated/services/SystemusersService';
import type { Systemusers } from '../generated/models/SystemusersModel';

const DEFAULT_SORT_ORDER = 'fullname asc';

/** Loads all active system user records sorted by full name. */
export function useSystemUsers() {
  const [systemUsers, setSystemUsers] = useState<Systemusers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSystemUsers(); }, []);

  const loadSystemUsers = async () => {
    try {
      setLoading(true);
      const result = await SystemusersService.getAll({
        orderBy: [DEFAULT_SORT_ORDER],
        filter: 'isdisabled eq false',
      });
      if (result.data) setSystemUsers(result.data);
    } catch (err) {
      console.error('Error loading system users:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resolves a `systemuserid` GUID from an Azure AD object ID.
   *
   * Queries the `systemusers` table filtered by `azureactivedirectoryobjectid`
   * and returns the matching `systemuserid`, or `null` if no record is found.
   *
   * @param aadObjectId - The Azure AD object ID (GUID) to look up.
   * @returns The `systemuserid` GUID, or `null` if not found.
   *
   * @example
   * ```ts
   * const id = await getSystemUserIdByAadObjectId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
   * ```
   */
  const getSystemUserIdByAadObjectId = async (aadObjectId: string): Promise<string | null> => {
    const result = await SystemusersService.getAll({
      select: ['systemuserid'],
      filter: `azureactivedirectoryobjectid eq '${aadObjectId}'`,
      top: 1,
    });
    return result.data?.[0]?.systemuserid ?? null;
  };

  return { systemUsers, loading, loadSystemUsers, getSystemUserIdByAadObjectId };
}
