import * as SQLite from 'expo-sqlite';
import { MutationQueueItem, ActionType, QueueStatus } from '../types';

const DB_NAME = 'retainai_scanner.db';
const TABLE_NAME = 'mutationqueue';

export class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Create mutation queue table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id TEXT PRIMARY KEY,
        actiontype TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        retrycount INTEGER NOT NULL DEFAULT 0,
        nextretryat INTEGER,
        createdat INTEGER NOT NULL,
        updatedat INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_status_created ON ${TABLE_NAME}(status, createdat);
      CREATE INDEX IF NOT EXISTS idx_status_retry ON ${TABLE_NAME}(status, nextretryat);
    `);
  }

  async enqueue(
    id: string,
    actionType: ActionType,
    payload: string,
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    await this.db.runAsync(
      `INSERT INTO ${TABLE_NAME} (id, actiontype, payload, status, retrycount, nextretryat, createdat, updatedat)
       VALUES (?, ?, ?, ?, 0, NULL, ?, ?)`,
      [id, actionType, payload, 'PENDING', now, now],
    );
  }

  async getPendingBatch(limit: number = 50): Promise<MutationQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const result = await this.db.getAllAsync<MutationQueueItem>(
      `SELECT * FROM ${TABLE_NAME}
       WHERE status = 'PENDING' AND (nextretryat IS NULL OR nextretryat <= ?)
       ORDER BY createdat ASC
       LIMIT ?`,
      [now, limit],
    );

    return result;
  }

  async updateStatus(
    id: string,
    status: QueueStatus,
    retryCount?: number,
    nextRetryAt?: number | null,
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    if (retryCount !== undefined && nextRetryAt !== undefined) {
      await this.db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET status = ?, retrycount = ?, nextretryat = ?, updatedat = ?
         WHERE id = ?`,
        [status, retryCount, nextRetryAt, now, id],
      );
    } else {
      await this.db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET status = ?, updatedat = ?
         WHERE id = ?`,
        [status, now, id],
      );
    }
  }

  async getQueueStats(): Promise<{
    pending: number;
    synced: number;
    poison: number;
    total: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{
      pending: number;
      synced: number;
      poison: number;
      total: number;
    }>(
      `SELECT 
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'SYNCED' THEN 1 ELSE 0 END) as synced,
        SUM(CASE WHEN status = 'POISON' THEN 1 ELSE 0 END) as poison,
        COUNT(*) as total
       FROM ${TABLE_NAME}`,
    );

    return result || { pending: 0, synced: 0, poison: 0, total: 0 };
  }

  async cleanupOldRecords(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const syncedRetention = 24 * 60 * 60 * 1000; // 24 hours
    const poisonRetention = 72 * 60 * 60 * 1000; // 72 hours

    // Delete SYNCED records older than 24h
    await this.db.runAsync(
      `DELETE FROM ${TABLE_NAME}
       WHERE status = 'SYNCED' AND updatedat < ?`,
      [now - syncedRetention],
    );

    // Delete POISON records older than 72h
    await this.db.runAsync(
      `DELETE FROM ${TABLE_NAME}
       WHERE status = 'POISON' AND updatedat < ?`,
      [now - poisonRetention],
    );
  }

  async checkQueueLimit(): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE status = 'PENDING'`,
    );

    return (result?.count || 0) < 2000; // Max queue length
  }
}

export const databaseService = new DatabaseService();

