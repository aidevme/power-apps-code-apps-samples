import { useState, useEffect } from 'react';
import { BusinessunitsService } from '../../generated/services/BusinessunitsService';
import type { Businessunits } from '../../generated/models/BusinessunitsModel';

const DEFAULT_SORT_ORDER = 'name asc';

/** Loads all business unit records sorted by name. */
export function useBusinessUnits() {
  const [businessUnits, setBusinessUnits] = useState<Businessunits[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBusinessUnits(); }, []);

  const loadBusinessUnits = async () => {
    try {
      setLoading(true);
      const result = await BusinessunitsService.getAll({ orderBy: [DEFAULT_SORT_ORDER] });
      if (result.data) setBusinessUnits(result.data);
    } catch (err) {
      console.error('Error loading business units:', err);
    } finally {
      setLoading(false);
    }
  };

  return { businessUnits, loading, loadBusinessUnits };
}
