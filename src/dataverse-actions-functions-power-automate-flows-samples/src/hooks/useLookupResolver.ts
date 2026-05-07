import { useState, useEffect, useRef } from 'react';
import { SystemusersService } from '../generated/services/SystemusersService';
import { AccountsService } from '../generated/services/AccountsService';
import { BusinessunitsService } from '../generated/services/BusinessunitsService';

/**
 * Batch-resolves systemuser and account GUIDs to their display names.
 *
 * Fetches only GUIDs not yet in the cache, so repeated calls with the same IDs
 * do not trigger extra network requests.
 *
 * @param userIds         - Array of systemuser GUIDs (e.g. `_createdby_value`).
 * @param accountIds      - Array of account GUIDs (e.g. `parentcustomerid`).
 * @param businessUnitIds - Array of business unit GUIDs (e.g. `_businessunitid_value`).
 * @returns Stable name maps for users, accounts, and business units, plus a combined `loading` flag.
 *
 * @example
 * ```ts
 * const { userNameMap, accountNameMap, businessUnitNameMap } = useLookupResolver(userIds, accountIds, businessUnitIds)
 * // userNameMap['guid'] === 'Jane Doe'
 * // accountNameMap['guid'] === 'Contoso Ltd.'
 * // businessUnitNameMap['guid'] === 'Sales'
 * ```
 */
export function useLookupResolver(userIds: string[], accountIds: string[] = [], businessUnitIds: string[] = []) {
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});
  const [accountNameMap, setAccountNameMap] = useState<Record<string, string>>({});
  const [businessUnitNameMap, setBusinessUnitNameMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchedUserIds = useRef<Set<string>>(new Set());
  const fetchedAccountIds = useRef<Set<string>>(new Set());
  const fetchedBusinessUnitIds = useRef<Set<string>>(new Set());

  const userIdsKey = [...new Set(userIds.filter(Boolean))].sort().join(',');
  const accountIdsKey = [...new Set(accountIds.filter(Boolean))].sort().join(',');
  const businessUnitIdsKey = [...new Set(businessUnitIds.filter(Boolean))].sort().join(',');

  useEffect(() => {
    const missingUsers = userIdsKey
      ? userIdsKey.split(',').filter(id => !fetchedUserIds.current.has(id))
      : [];
    const missingAccounts = accountIdsKey
      ? accountIdsKey.split(',').filter(id => !fetchedAccountIds.current.has(id))
      : [];
    const missingBusinessUnits = businessUnitIdsKey
      ? businessUnitIdsKey.split(',').filter(id => !fetchedBusinessUnitIds.current.has(id))
      : [];

    if (missingUsers.length === 0 && missingAccounts.length === 0 && missingBusinessUnits.length === 0) return;

    missingUsers.forEach(id => fetchedUserIds.current.add(id));
    missingAccounts.forEach(id => fetchedAccountIds.current.add(id));
    missingBusinessUnits.forEach(id => fetchedBusinessUnitIds.current.add(id));

    async function resolve() {
      setLoading(true);
      try {
        const [userEntries, accountEntries, businessUnitEntries] = await Promise.all([
          Promise.all(
            missingUsers.map(async (id) => {
              try {
                const result = await SystemusersService.get(id, { select: ['systemuserid', 'fullname'] });
                return [id, result.data?.fullname ?? 'Unknown'] as const;
              } catch {
                return [id, 'Unknown'] as const;
              }
            })
          ),
          Promise.all(
            missingAccounts.map(async (id) => {
              try {
                const result = await AccountsService.get(id, { select: ['accountid', 'name'] });
                return [id, result.data?.name ?? 'Unknown'] as const;
              } catch {
                return [id, 'Unknown'] as const;
              }
            })
          ),
          Promise.all(
            missingBusinessUnits.map(async (id) => {
              try {
                const result = await BusinessunitsService.get(id, { select: ['businessunitid', 'name'] });
                return [id, result.data?.name ?? 'Unknown'] as const;
              } catch {
                return [id, 'Unknown'] as const;
              }
            })
          ),
        ]);

        if (userEntries.length > 0)
          setUserNameMap(prev => ({ ...prev, ...Object.fromEntries(userEntries) }));
        if (accountEntries.length > 0)
          setAccountNameMap(prev => ({ ...prev, ...Object.fromEntries(accountEntries) }));
        if (businessUnitEntries.length > 0)
          setBusinessUnitNameMap(prev => ({ ...prev, ...Object.fromEntries(businessUnitEntries) }));
      } finally {
        setLoading(false);
      }
    }

    resolve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdsKey, accountIdsKey, businessUnitIdsKey]);

  return { userNameMap, accountNameMap, businessUnitNameMap, loading };
}
