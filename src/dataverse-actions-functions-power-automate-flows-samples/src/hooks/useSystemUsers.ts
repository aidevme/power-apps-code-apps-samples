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

  return { systemUsers, loading, loadSystemUsers };
}
