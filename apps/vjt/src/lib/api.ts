const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface VJTSubmitRequest {
  candidateId: string;
  nonce: string;
  skillScore: number;
  meta?: {
    clientVersion?: string;
  };
}

export interface VJTSubmitResponse {
  passed: boolean;
  candidateStatus: string;
  coolDownUntil: string | null;
}

export async function submitVJT(data: VJTSubmitRequest): Promise<VJTSubmitResponse> {
  const response = await fetch(`${API_BASE_URL}/candidates/vjt/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit VJT');
  }

  return response.json();
}

export async function checkCandidateStatus(
  candidateId: string,
  nonce: string,
): Promise<{ status: string; coolDownUntil: string | null }> {
  // This would ideally be a separate endpoint, but for MVP we'll handle it client-side
  // The nonce validation happens on submit
  return {
    status: 'VJTPENDING',
    coolDownUntil: null,
  };
}

