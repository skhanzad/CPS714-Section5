// Section 5, Team 3
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const itemRef = db.collection('items').doc(itemId);
    const itemSnap = await itemRef.get();

    if (!itemSnap.exists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const itemData = itemSnap.data();

    const activeHoldsQuery = await db.collection('reservations')
      .where('itemId', '==', itemId)
      .where('status', '==', 'active')
      .orderBy('position', 'asc')
      .get();

    if (activeHoldsQuery.empty) {
      return NextResponse.json(
        { error: 'No active holds for this item' },
        { status: 404 }
      );
    }

    const nextHold = activeHoldsQuery.docs[0];
    const holdData = nextHold.data();

    const now = Timestamp.now();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    await db.collection('reservations').doc(nextHold.id).update({
      status: 'ready',
      readyAt: now,
      notifiedAt: now,
      expiresAt: expiresAt,
      updatedAt: now,
    });

    const holdShelfData = {
      holdId: nextHold.id,
      itemId,
      libraryCardNumber: holdData.libraryCardNumber,
      memberName: holdData.memberName,
      itemTitle: itemData?.title || 'Unknown',
      placedOnShelfAt: now,
      expiresAt: expiresAt,
      notificationSent: true,
    };

    const holdShelfRef = await db.collection('holdShelf').add(holdShelfData);

    await itemRef.update({
      isCheckedOut: false,
      currentBorrowerId: null,
      dueDate: null,
      onHoldShelf: true,
      holdShelfFor: holdData.libraryCardNumber,
      updatedAt: now,
    });

    return NextResponse.json({
      id: holdShelfRef.id,
      ...holdShelfData,
      message: `Item placed on hold shelf for ${holdData.memberName}`,
    }, { status: 201 });

  } catch (error) {
    console.error('Error placing item on hold shelf:', error);
    return NextResponse.json(
      { error: 'Failed to place item on hold shelf' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const libraryCardNumber = searchParams.get('libraryCardNumber');

    let holdShelfQuery = db.collection('holdShelf')
      .orderBy('placedOnShelfAt', 'desc');

    if (libraryCardNumber) {
      holdShelfQuery = db.collection('holdShelf')
        .where('libraryCardNumber', '==', libraryCardNumber)
        .orderBy('placedOnShelfAt', 'desc');
    }

    const holdShelfSnapshot = await holdShelfQuery.get();
    const holdShelfItems = holdShelfSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json(holdShelfItems);
  } catch (error) {
    console.error('Error fetching hold shelf items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hold shelf items' },
      { status: 500 }
    );
  }
}
