import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await login(body.badgeId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    );
  }
}

