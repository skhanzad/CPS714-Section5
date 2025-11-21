import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, isbn } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const itemData = {
      title,
      author,
      isbn: isbn || null,
      isCheckedOut: false,
      onHoldShelf: false,
      createdAt: now,
      updatedAt: now,
    };

    const itemRef = await db.collection('items').add(itemData);

    return NextResponse.json({
      id: itemRef.id,
      ...itemData,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isCheckedOut = searchParams.get('isCheckedOut');

    let itemsQuery = db.collection('items').orderBy('title', 'asc');

    if (isCheckedOut !== null) {
      itemsQuery = db.collection('items')
        .where('isCheckedOut', '==', isCheckedOut === 'true')
        .orderBy('title', 'asc');
    }

    const itemsSnapshot = await itemsQuery.get();
    const items = itemsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
