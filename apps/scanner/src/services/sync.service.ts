import { databaseService } from './database.service';
import { MutationQueueItem, ScanPayload, SentimentPayload } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Use your computer's IP address for mobile device access
// Change this to your computer's IP if it's different
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.152:3000';
const MAX_RETRIES = 6;
const BACKOFF_SCHEDULE = [1000, 2000, 5000, 30000, 300000]; // 1s, 2s, 5s, 30s, 5m

export class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  async start(): Promise<void> {
    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncIfOnline();
    }, 30000);

    // Sync on connectivity change
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.syncIfOnline();
      }
    });

    // Initial sync
    this.syncIfOnline();
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async triggerSync(): Promise<void> {
    await this.syncIfOnline();
  }

  private async syncIfOnline(): Promise<void> {
    if (this.isSyncing) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    this.isSyncing = true;
    try {
      await this.sync();
    } finally {
      this.isSyncing = false;
    }
  }

  private async sync(): Promise<void> {
    // Cleanup old records first
    await databaseService.cleanupOldRecords();

    // Get pending batch
    const pending = await databaseService.getPendingBatch(50);
    if (pending.length === 0) return;

    // Group by action type
    const scanEvents: ScanPayload[] = [];
    const sentimentEvents: SentimentPayload[] = [];

    for (const item of pending) {
      if (item.actionType === 'SCAN') {
        try {
          const payload = JSON.parse(item.payload) as ScanPayload;
          scanEvents.push(payload);
        } catch (error) {
          // Invalid payload, mark as FAILED_FATAL
          await databaseService.updateStatus(item.id, 'FAILED_FATAL');
        }
      } else if (item.actionType === 'SENTIMENT') {
        try {
          const payload = JSON.parse(item.payload) as SentimentPayload;
          sentimentEvents.push(payload);
        } catch (error) {
          // Invalid payload, mark as FAILED_FATAL
          await databaseService.updateStatus(item.id, 'FAILED_FATAL');
        }
      }
    }

    // Sync scan events
    if (scanEvents.length > 0) {
      await this.syncScanEvents(scanEvents, pending.filter((p) => p.actionType === 'SCAN'));
    }

    // Sync sentiment events
    if (sentimentEvents.length > 0) {
      await this.syncSentimentEvents(
        sentimentEvents,
        pending.filter((p) => p.actionType === 'SENTIMENT'),
      );
    }
  }

  private async syncScanEvents(
    events: ScanPayload[],
    queueItems: MutationQueueItem[],
  ): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        // No token, can't sync
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ events }),
      });

      if (response.status === 200) {
        // All succeeded
        for (const item of queueItems) {
          await databaseService.updateStatus(item.id, 'SYNCED');
        }
      } else if (response.status === 206) {
        // Partial success
        const result = await response.json();
        const syncedIds = new Set<string>();
        const failedIds = new Set<string>();

        // Map eventId to queue item id
        const eventIdToQueueId = new Map<string, string>();
        for (let i = 0; i < events.length; i++) {
          eventIdToQueueId.set(events[i].eventId, queueItems[i].id);
        }

        // Mark successes
        for (const error of result.errors || []) {
          failedIds.add(error.eventId);
        }

        for (const event of events) {
          if (!failedIds.has(event.eventId)) {
            syncedIds.add(event.eventId);
          }
        }

        // Update statuses
        for (const [eventId, queueId] of eventIdToQueueId.entries()) {
          if (syncedIds.has(eventId)) {
            await databaseService.updateStatus(queueId, 'SYNCED');
          } else {
            // Invalid payload, mark as FAILED_FATAL
            await databaseService.updateStatus(queueId, 'FAILED_FATAL');
          }
        }
      } else if (response.status === 400) {
        // Envelope invalid, mark all as FAILED_FATAL
        for (const item of queueItems) {
          await databaseService.updateStatus(item.id, 'FAILED_FATAL');
        }
      } else {
        // Retryable error (500, timeout, etc.)
        await this.handleRetry(queueItems);
      }
    } catch (error) {
      // Network error, retry with backoff
      await this.handleRetry(queueItems);
    }
  }

  private async syncSentimentEvents(
    events: SentimentPayload[],
    queueItems: MutationQueueItem[],
  ): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        // No token, can't sync
        return;
      }

      // Process each sentiment event individually
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const queueItem = queueItems[i];

        try {
          const response = await fetch(`${API_BASE_URL}/sentiment/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              questionId: event.questionId,
              score: event.score,
              respondedAt: event.respondedAt,
            }),
          });

          if (response.status === 200 || response.status === 409) {
            // Success or already submitted (idempotent)
            await databaseService.updateStatus(queueItem.id, 'SYNCED');
          } else if (response.status === 400) {
            // Validation error, mark as FAILED_FATAL
            await databaseService.updateStatus(queueItem.id, 'FAILED_FATAL');
          } else {
            // Retryable error (500, timeout, etc.)
            await this.handleRetry([queueItem]);
          }
        } catch (error) {
          // Network error, retry with backoff
          await this.handleRetry([queueItem]);
        }
      }
    } catch (error) {
      // General error, retry all
      await this.handleRetry(queueItems);
    }
  }

  private async handleRetry(queueItems: MutationQueueItem[]): Promise<void> {
    for (const item of queueItems) {
      const newRetryCount = item.retryCount + 1;

      if (newRetryCount > MAX_RETRIES) {
        // Mark as POISON
        await databaseService.updateStatus(item.id, 'POISON');
      } else {
        // Calculate backoff
        const backoffIndex = Math.min(newRetryCount - 1, BACKOFF_SCHEDULE.length - 1);
        const backoffMs = BACKOFF_SCHEDULE[backoffIndex];
        const nextRetryAt = Date.now() + backoffMs;

        await databaseService.updateStatus(
          item.id,
          'PENDING',
          newRetryCount,
          nextRetryAt,
        );
      }
    }
  }
}

export const syncService = new SyncService();

