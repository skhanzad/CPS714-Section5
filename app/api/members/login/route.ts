import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/memberValidators';
import { authenticateMember } from '@/lib/services/memberService';
import { generateSessionToken } from '@/lib/utils/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const member = await authenticateMember(parsed.data);
    const { pinHash: _ignored, ...sanitized } = member;
    void _ignored;
    const token = generateSessionToken();
    
    return NextResponse.json({ token, member: sanitized });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
