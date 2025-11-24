// Section 5, Team 3
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { LibraryItem } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemRef = db.collection('items').doc(id);
    const itemSnap = await itemRef.get();

    if (!itemSnap.exists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const data = itemSnap.data();
    return NextResponse.json({
      id: itemSnap.id,
      ...data,
      dueDate: data?.dueDate?.toDate?.()?.toISOString() || data?.dueDate,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
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
    const { isCheckedOut, currentBorrowerId, dueDate } = body;

    const itemRef = db.collection('items').doc(id);
    const itemSnap = await itemRef.get();

    if (!itemSnap.exists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const updateData: Partial<LibraryItem> = {
      updatedAt: Timestamp.now().toDate().toISOString(),
    };

    if (isCheckedOut !== undefined) {
      updateData.isCheckedOut = isCheckedOut;
      if (!isCheckedOut) {
        updateData.currentBorrowerId = undefined;
        updateData.dueDate = undefined;
      }
    }

    if (currentBorrowerId !== undefined) {
      updateData.currentBorrowerId = currentBorrowerId;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate || null;
    }

    await itemRef.update(updateData);

    const updatedSnap = await itemRef.get();
    const data = updatedSnap.data();

    return NextResponse.json({
      id: updatedSnap.id,
      ...data,
      dueDate: data?.dueDate?.toDate?.()?.toISOString() || data?.dueDate,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}
