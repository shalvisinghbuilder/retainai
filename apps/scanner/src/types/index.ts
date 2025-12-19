export type ActionType = 'SCAN' | 'SENTIMENT';

export type QueueStatus = 'PENDING' | 'SYNCED' | 'FAILED_FATAL' | 'POISON';

export interface MutationQueueItem {
  id: string; // UUID
  actionType: ActionType;
  payload: string; // JSON string
  status: QueueStatus;
  retryCount: number;
  nextRetryAt: number | null; // epoch ms
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface ScanPayload {
  eventId: string;
  employeeId: string;
  barcode: string;
  location: string;
  actionType: 'PICK' | 'STOW' | 'COUNT' | 'ERRORLOG';
  timestamp: string; // ISO8601
  expectedSeconds: number;
  actualSeconds?: number;
  isError?: boolean;
  errorCode?: string;
}

export interface SentimentPayload {
  employeeId: string;
  questionId: string;
  score: number; // 1-5
  respondedAt: string; // ISO8601
}

