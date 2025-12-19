import { NextRequest, NextResponse } from 'next/server';
import { overrideAdaptRecord } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    await overrideAdaptRecord(token, params.id, body.exemptionReason);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to override AdaptRecord' },
      { status: 500 }
    );
  }
}

