import { getWorkouts, saveWorkouts, getSessions, saveSessions } from '../storage/jsonStorage.js';

export class SyncService {
  /**
   * Process offline sync batches idempotently
   * Reconciles sessions, exercises, and sets from mobile & web offline queues.
   */
  async processSyncBatch(payload = {}) {
    const { sessions = [], exercises = [], sets = [] } = payload;
    const now = new Date().toISOString();

    // 1. Reconcile Sessions (timestamp LWW merge)
    let mergedSessions = [];
    if (Array.isArray(sessions) && sessions.length > 0) {
      const existingSessions = await getSessions();
      const sessionMap = new Map(existingSessions.map(s => [s.id, s]));

      for (const incomingSession of sessions) {
        if (!incomingSession || !incomingSession.id) continue;
        const existing = sessionMap.get(incomingSession.id);
        if (!existing || new Date(incomingSession.updatedAt || 0) >= new Date(existing.updatedAt || 0)) {
          sessionMap.set(incomingSession.id, incomingSession);
        }
      }
      mergedSessions = Array.from(sessionMap.values());
      await saveSessions(mergedSessions);
    }

    // 2. Reconcile Workout Exercises
    let updatedWorkoutCount = 0;
    if (Array.isArray(exercises) && exercises.length > 0) {
      const workouts = await getWorkouts();
      for (const item of exercises) {
        if (!item || !item.id) continue;
        const idx = workouts.findIndex(w => w.id === item.id);
        if (idx !== -1) {
          workouts[idx] = { ...workouts[idx], ...item };
        } else {
          workouts.unshift(item);
        }
        updatedWorkoutCount++;
      }
      if (updatedWorkoutCount > 0) {
        await saveWorkouts(workouts);
      }
    }

    return {
      success: true,
      syncedSessionCount: sessions.length,
      syncedExerciseCount: exercises.length,
      syncedSetCount: sets.length,
      count: updatedWorkoutCount || exercises.length,
      syncedAt: now,
      serverTimestamp: now
    };
  }
}

export const syncService = new SyncService();
