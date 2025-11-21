import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const holdRef = db.collection('reservations').doc(id);
    const holdSnap = await holdRef.get();

    if (!holdSnap.exists) {
      return NextResponse.json(
        { error: 'Hold not found' },
        { status: 404 }
      );
    }

    const data = holdSnap.data();
    return NextResponse.json({
      id: holdSnap.id,
      ...data,
    });
  } catch (error) {
    console.error('Error fetching hold:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hold' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const holdRef = db.collection('reservations').doc(id);
    const holdSnap = await holdRef.get();

    if (!holdSnap.exists) {
      return NextResponse.json(
        { error: 'Hold not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const updateData: any = {
      status,
      updatedAt: now,
    };

    if (status === 'ready') {
      updateData.readyAt = now;
      updateData.notifiedAt = now;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      updateData.expiresAt = expiresAt.toISOString();
    } else if (status === 'fulfilled') {
      updateData.fulfilledAt = now;
    }

    await holdRef.update(updateData);

    const updatedSnap = await holdRef.get();
    const data = updatedSnap.data();

    return NextResponse.json({
      id: updatedSnap.id,
      ...data,
    });
  } catch (error) {
    console.error('Error updating hold:', error);
    return NextResponse.json(
      { error: 'Failed to update hold' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const holdRef = db.collection('reservations').doc(id);
    const holdSnap = await holdRef.get();

    if (!holdSnap.exists) {
      return NextResponse.json(
        { error: 'Hold not found' },
        { status: 404 }
      );
    }

    await holdRef.update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Hold cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling hold:', error);
    return NextResponse.json(
      { error: 'Failed to cancel hold' },
      { status: 500 }
    );
  }
}
