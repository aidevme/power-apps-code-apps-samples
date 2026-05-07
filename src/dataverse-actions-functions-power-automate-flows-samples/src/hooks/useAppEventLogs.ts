import { useState, useEffect } from 'react';
import { Aidevme_appeventlogsService } from '../generated/services/Aidevme_appeventlogsService';
import type { Aidevme_appeventlogs } from '../generated/models/Aidevme_appeventlogsModel';

const DEFAULT_SORT_ORDER = 'createdon desc';
const MAX_RECORDS = 100;

/**
 * Loads App Event Log records from the Elastic table, sorted by creation date descending.
 *
 * @returns The event log records, a loading flag, and a `loadAppEventLogs` callback to manually refresh.
 */
export function useAppEventLogs() {
  const [appEventLogs, setAppEventLogs] = useState<Aidevme_appeventlogs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppEventLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAppEventLogs = async () => {
    try {
      setLoading(true);
      const result = await Aidevme_appeventlogsService.getAll({
        orderBy: [DEFAULT_SORT_ORDER],
        top: MAX_RECORDS,
      });
      if (result.data) setAppEventLogs(result.data);
    } catch (err) {
      console.error('Error loading app event logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return { appEventLogs, loading, loadAppEventLogs };
}
