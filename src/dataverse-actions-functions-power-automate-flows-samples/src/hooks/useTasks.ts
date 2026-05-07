import { useState, useEffect } from 'react'
import { TasksService } from '../generated/services/TasksService'
import type { Tasks } from '../generated/models/TasksModel'

/** Loads all task records sorted by scheduled end date descending. */
export function useTasks() {
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTasks() }, [])

  /**
   * Fetches task records from Dataverse and updates local state.
   * Safe to call imperatively for a manual refresh.
   */
  const loadTasks = async () => {
    try {
      setLoading(true)
      const result = await TasksService.getAll({ orderBy: ['scheduledend desc'] })
      if (result.data) setTasks(result.data)
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  return { tasks, loading, loadTasks }
}
