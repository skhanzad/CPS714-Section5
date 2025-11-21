import { NextRequest, NextResponse } from 'next/server';
import { applicationIdSchema } from '@/lib/validators/memberValidators';
import { getApplication } from '@/lib/services/memberService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    const parsed = applicationIdSchema.safeParse({ applicationId });
    
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid application id' }, { status: 400 });
    }

    const application = await getApplication(parsed.data.applicationId);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
