/**
 * IronPulse Offline Storage & Outbox Queue Engine
 * High-performance IndexedDB client with client UUID generation
 * and offline sync outbox queue.
 */

export interface SyncOutboxItem {
  readonly id: string;
  readonly entityType: 'session' | 'exercise' | 'set';
  readonly entityId: string;
  readonly action: 'UPSERT' | 'DELETE';
  readonly payload: unknown;
  readonly clientTimestamp: string;
}

const DB_NAME = 'ironpulse_offline_db';
const DB_VERSION = 1;
const STORE_SESSIONS = 'sessions';
const STORE_OUTBOX = 'sync_outbox';

export function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in current environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enqueue a mutation to the offline outbox
 */
export async function enqueueOutboxItem(
  entityType: 'session' | 'exercise' | 'set',
  entityId: string,
  action: 'UPSERT' | 'DELETE',
  payload: unknown
): Promise<SyncOutboxItem> {
  const item: SyncOutboxItem = {
    id: generateClientUUID(),
    entityType,
    entityId,
    action,
    payload,
    clientTimestamp: new Date().toISOString(),
  };

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_OUTBOX], 'readwrite');
      const store = tx.objectStore(STORE_OUTBOX);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB is blocked
    const fallbackOutbox: SyncOutboxItem[] = JSON.parse(
      localStorage.getItem('ironpulse_fallback_outbox') || '[]'
    );
    fallbackOutbox.push(item);
    localStorage.setItem('ironpulse_fallback_outbox', JSON.stringify(fallbackOutbox));
  }

  return item;
}

/**
 * Retrieve all pending outbox queue items
 */
export async function getPendingOutboxItems(): Promise<SyncOutboxItem[]> {
  try {
    const db = await openDatabase();
    return await new Promise<SyncOutboxItem[]>((resolve, reject) => {
      const tx = db.transaction([STORE_OUTBOX], 'readonly');
      const store = tx.objectStore(STORE_OUTBOX);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return JSON.parse(localStorage.getItem('ironpulse_fallback_outbox') || '[]');
  }
}

/**
 * Remove processed outbox items by IDs
 */
export async function removeOutboxItems(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_OUTBOX], 'readwrite');
      const store = tx.objectStore(STORE_OUTBOX);
      for (const id of ids) {
        store.delete(id);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const existing: SyncOutboxItem[] = JSON.parse(
      localStorage.getItem('ironpulse_fallback_outbox') || '[]'
    );
    const filtered = existing.filter((item) => !ids.includes(item.id));
    localStorage.setItem('ironpulse_fallback_outbox', JSON.stringify(filtered));
  }
}
