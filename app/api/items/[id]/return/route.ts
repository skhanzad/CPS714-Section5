// Section 5, Team 3
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(
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

    const itemData = itemSnap.data();

    if (!itemData?.isCheckedOut) {
      return NextResponse.json(
        { error: 'Item is not checked out' },
        { status: 400 }
      );
    }

    const holdsSnapshot = await db
      .collection('holds')
      .where('itemId', '==', id)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'asc')
      .limit(1)
      .get();

    let message = `Item "${itemData.title}" returned successfully.`;

    if (!holdsSnapshot.empty) {
      const hold = holdsSnapshot.docs[0];
      const holdData = hold.data();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);

      // Create hold shelf entry
      await db.collection('holdShelf').add({
        itemId: id,
        itemTitle: itemData.title,
        itemAuthor: itemData.author,
        itemIsbn: itemData.isbn,
        holdId: hold.id,
        memberId: holdData.memberId,
        expiresAt: Timestamp.fromDate(expiresAt),
        createdAt: Timestamp.now(),
      });

      // Update hold status
      await hold.ref.update({
        status: 'ready',
        updatedAt: Timestamp.now(),
      });

      message = `Item "${itemData.title}" returned and placed on hold shelf for member ${holdData.memberId}.`;
    }

    // Update item status
    await itemRef.update({
      isCheckedOut: false,
      currentBorrowerId: null,
      dueDate: null,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      message,
      hasHold: !holdsSnapshot.empty,
    });
  } catch (error) {
    console.error('Error processing return:', error);
    return NextResponse.json(
      { error: 'Failed to process return' },
      { status: 500 }
    );
  }
}
