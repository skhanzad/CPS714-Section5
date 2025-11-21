import { NextRequest, NextResponse } from 'next/server';
import { approveApplication } from '@/lib/services/adminService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    if (!applicationId) {
      return NextResponse.json({ message: 'Application id is required' }, { status: 400 });
    }

    const member = await approveApplication(applicationId);
    const { pinHash: _ignored, ...sanitized } = member;
    void _ignored;
    
    return NextResponse.json({ member: sanitized });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
