/**
 * useEntities Hook
 * Custom hook for loading entity metadata records for lookup field population.
 *
 * PURPOSE:
 * This hook loads Entity metadata records from Dataverse, useful for resolving
 * entity logical names, display names, and set names in lookup scenarios.
 *
 * PATTERN:
 * - Loads data once on mount
 * - No error state exposed (silently fails to avoid disrupting main flow)
 * - In production, consider adding error handling and retry logic
 */

import { useState, useEffect } from 'react';
import { EntitiesService } from '../generated/services/EntitiesService';
import type { Entities } from '../generated/models/EntitiesModel';

const DEFAULT_SORT_ORDER = 'name asc';

/**
 * OData collection names (plural) of Dataverse tables registered via
 * `pac code add-data-source`. Update this list whenever a new data source is added.
 */
export const REGISTERED_TABLE_COLLECTIONS: readonly string[] = [
  'accounts',
  'aidevme_appeventlogs',
  'aidevme_codeappssamplesconfigurationsettings',
  'appointments',
  'businessunits',
  'contacts',
  'emails',
  'leads',
  'opportunities',
  'systemforms',
  'systemusers',
  'tasks',
  'teams',
  'transactioncurrencies',
];

/** Pre-built OData filter that matches only the registered tables. */
const registeredFilter = REGISTERED_TABLE_COLLECTIONS
  .map(name => `logicalcollectionname eq '${name}'`)
  .join(' or ');

export function useEntities() {
  const [entities, setEntities] = useState<Entities[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      const result = await EntitiesService.getAll({
        orderBy: [DEFAULT_SORT_ORDER],
        filter: registeredFilter,
      });
      if (result.data) setEntities(result.data);
    } catch (err) {
      console.error('Error loading entities:', err);
    } finally {
      setLoading(false);
    }
  };

  return { entities, loading, loadEntities };
}