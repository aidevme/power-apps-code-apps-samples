import { useState, useEffect } from 'react';
import { Aidevme_appeventlogsService } from '../../generated/services/Aidevme_appeventlogsService';
import type { Aidevme_appeventlogs } from '../../generated/models/Aidevme_appeventlogsModel';

const MAX_RECORDS = 100;
const SELECTED_FIELDS = [
  'aidevme_appeventlogid',
  'aidevme_name',
  'aidevme_eventtype',
  'aidevme_status',
  'aidevme_entitylogicalname',
  'aidevme_duration',
  'aidevme_sessionid',
  'createdon',
  'ttlinseconds',
]

/**
 * Loads App Event Log records from the Elastic table.
 *
 * @remarks
 * Elastic tables do not support `$orderby` without a `partitionid` filter, so
 * no sort order is applied here. Records are returned in storage order.
 *
 * @returns The event log records, a loading flag, an error string if the last
 * fetch failed, and a `loadAppEventLogs` callback to manually refresh.
 */
export function useAppEventLogs() {
  const [appEventLogs, setAppEventLogs] = useState<Aidevme_appeventlogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppEventLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAppEventLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await Aidevme_appeventlogsService.getAll({
        select: SELECTED_FIELDS,
        top: MAX_RECORDS,
      });
      if (result.data) setAppEventLogs(result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error loading app event logs:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { appEventLogs, loading, error, loadAppEventLogs };
}
