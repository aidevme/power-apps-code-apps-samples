import { useState, useEffect } from 'react';
import { ContactsService } from '../../generated/services/ContactsService';
import type { Contacts } from '../../generated/models/ContactsModel';

const DEFAULT_SORT_ORDER = 'fullname asc';

/**
 * Loads contact records from Dataverse, sorted by full name.
 *
 * @returns The contact records, a loading flag, and a `loadContacts` callback to manually refresh.
 */
export function useContacts() {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const result = await ContactsService.getAll({
        orderBy: [DEFAULT_SORT_ORDER],
      });
      if (result.data) setContacts(result.data);
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  return { contacts, loading, loadContacts };
}
