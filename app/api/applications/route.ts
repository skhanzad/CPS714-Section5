import { NextRequest, NextResponse } from 'next/server';
import { listApplications } from '@/lib/services/adminService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? undefined;
    const applications = await listApplications(status);
    return NextResponse.json({ applications });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
