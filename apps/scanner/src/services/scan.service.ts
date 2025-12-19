import { databaseService } from './database.service';
import { authService } from './auth.service';
import { syncService } from './sync.service';
import { generateUUID } from '../utils/uuid';
import { ScanPayload } from '../types';

export class ScanService {
  async recordScan(
    barcode: string,
    location: string,
    actionType: 'PICK' | 'STOW' | 'COUNT' | 'ERRORLOG',
    expectedSeconds: number,
    actualSeconds?: number,
    isError: boolean = false,
    errorCode?: string,
  ): Promise<void> {
    // Check queue limit
    const canEnqueue = await databaseService.checkQueueLimit();
    if (!canEnqueue) {
      throw new Error('Queue limit reached (2000 pending items)');
    }

    // Get employee info
    const employee = await authService.getEmployee();
    if (!employee) {
      throw new Error('Not authenticated');
    }

    // Create scan payload
    const eventId = await generateUUID();
    const payload: ScanPayload = {
      eventId,
      employeeId: employee.id,
      barcode,
      location,
      actionType,
      timestamp: new Date().toISOString(),
      expectedSeconds,
      actualSeconds,
      isError,
      errorCode,
    };

    // Enqueue to SQLite
    await databaseService.enqueue(eventId, 'SCAN', JSON.stringify(payload));

    // Trigger sync attempt (non-blocking)
    syncService.triggerSync().catch((error) => {
      console.error('Background sync failed:', error);
      // Don't throw - scan is already queued
    });
  }
}

export const scanService = new ScanService();

