const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface WorkerPosition {
  employeeId: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'offline';
  lastScan: string;
}

export interface FloorState {
  workers: WorkerPosition[];
  timestamp: string;
}

export interface AdaptRecord {
  id: string;
  employeeId: string;
  employeeBadgeId?: string;
  type: 'PRODUCTIVITY' | 'QUALITY' | 'ATTENDANCE';
  status: 'PENDINGREVIEW' | 'APPROVEDDELIVERED' | 'EXEMPTED';
  metricValue: number;
  metricThreshold: number;
  generatedAt: string;
  deliveredAt: string | null;
}

export interface AdaptQueue {
  items: AdaptRecord[];
}

export async function getFloorState(token: string): Promise<FloorState> {
  const response = await fetch(`${API_BASE_URL}/map/floor-state`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch floor state');
  }

  return response.json();
}

export async function getAdaptQueue(token: string): Promise<AdaptQueue> {
  const response = await fetch(`${API_BASE_URL}/adapt/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ADAPT queue');
  }

  return response.json();
}

export async function approveAdaptRecord(
  token: string,
  id: string,
  managerNote?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/adapt/${id}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ managerNote }),
  });

  if (!response.ok) {
    throw new Error('Failed to approve AdaptRecord');
  }
}

export async function overrideAdaptRecord(
  token: string,
  id: string,
  exemptionReason: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/adapt/${id}/override`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ exemptionReason }),
  });

  if (!response.ok) {
    throw new Error('Failed to override AdaptRecord');
  }
}

export async function login(badgeId: string): Promise<{
  accessToken: string;
  refreshToken: string;
  employee: { id: string; badgeId: string; role: string };
}> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ badgeId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

