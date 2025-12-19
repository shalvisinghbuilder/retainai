import { NextRequest, NextResponse } from 'next/server';
import { submitVJT } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await submitVJT(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit VJT' },
      { status: 400 }
    );
  }
}

