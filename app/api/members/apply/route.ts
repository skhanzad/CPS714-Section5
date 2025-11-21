import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validators/memberValidators';
import { submitApplication } from '@/lib/services/memberService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid application payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const application = await submitApplication(parsed.data);
    return NextResponse.json(
      { id: application.id, status: application.status },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
