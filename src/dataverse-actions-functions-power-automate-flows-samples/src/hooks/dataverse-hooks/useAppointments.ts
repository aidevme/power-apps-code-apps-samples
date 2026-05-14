import { useState, useEffect } from 'react';
import { AppointmentsService } from '../../generated/services/AppointmentsService';
import type { Appointments } from '../../generated/models/AppointmentsModel';

/** Loads all appointment records sorted by scheduled start date descending. */
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const result = await AppointmentsService.getAll({ orderBy: ['scheduledstart desc'] });
      if (result.data) setAppointments(result.data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  return { appointments, loading, loadAppointments };
}
