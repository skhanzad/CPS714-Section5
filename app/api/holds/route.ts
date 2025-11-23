// Section 5, Team 3
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, libraryCardNumber, memberName, memberEmail } = body;

    if (!itemId || !libraryCardNumber || !memberName || !memberEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    if (!itemData || !itemData.isCheckedOut) {
      return NextResponse.json(
        { error: 'Item is currently available, no hold needed' },
        { status: 400 }
      );
    }

    const existingHoldsQuery = await db.collection('reservations')
      .where('itemId', '==', itemId)
      .where('libraryCardNumber', '==', libraryCardNumber)
      .where('status', 'in', ['active', 'ready'])
      .get();
    const existingHolds = existingHoldsQuery;

    if (!existingHolds.empty) {
      return NextResponse.json(
        { error: 'You already have an active hold on this item' },
        { status: 400 }
      );
    }

    const activeHoldsQuery = await db.collection('reservations')
      .where('itemId', '==', itemId)
      .where('status', '==', 'active')
      .orderBy('placedAt', 'asc')
      .get();
    const activeHolds = activeHoldsQuery;
    const position = activeHolds.size + 1;

    const now = Timestamp.now();
    const holdData = {
      itemId,
      libraryCardNumber,
      memberName,
      memberEmail,
      status: 'active',
      position,
      placedAt: now,
      updatedAt: now,
    };

    const holdRef = await db.collection('reservations').add(holdData);

    return NextResponse.json({
      id: holdRef.id,
      ...holdData,
    }, { status: 201 });

  } catch (error) {
    console.error('Error placing hold:', error);
    return NextResponse.json(
      { error: 'Failed to place hold' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const libraryCardNumber = searchParams.get('libraryCardNumber');
    const itemId = searchParams.get('itemId');
    const status = searchParams.get('status');

    let holdsQuery: FirebaseFirestore.Query = db.collection('reservations');

    if (libraryCardNumber) {
      holdsQuery = holdsQuery.where('libraryCardNumber', '==', libraryCardNumber);
    }
    if (itemId) {
      holdsQuery = holdsQuery.where('itemId', '==', itemId);
    }
    if (status) {
      holdsQuery = holdsQuery.where('status', '==', status);
    }

    holdsQuery = holdsQuery.orderBy('placedAt', 'desc');

    const holdsSnapshot = await holdsQuery.get();
    const holds = holdsSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json(holds);
  } catch (error) {
    console.error('Error fetching holds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holds' },
      { status: 500 }
    );
  }
}
