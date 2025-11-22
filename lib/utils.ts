import { db } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function recalculateQueuePositions(itemId: string) {
  try {
    const holdsQuery = db
      .collection('holds')
      .where('itemId', '==', itemId)
      .where('status', '==', 'active')
      .orderBy('placedAt', 'asc');

    const holdsSnapshot = await holdsQuery.get();

    const updates = holdsSnapshot.docs.map((holdDoc, index) => {
      return db.collection('reservations').doc(holdDoc.id).update({
        position: index + 1,
      });
    });

    await Promise.all(updates);

    return { success: true, updatedCount: updates.length };
  } catch (error) {
    console.error('Error recalculating queue positions:', error);
    throw error;
  }
}

export async function getQueuePosition(itemId: string, holdId: string) {
  try {
    const holdsQuery = db
      .collection('holds')
      .where('itemId', '==', itemId)
      .where('status', '==', 'active')
      .orderBy('placedAt', 'asc');

    const holdsSnapshot = await holdsQuery.get();

    const position = holdsSnapshot.docs.findIndex((d) => d.id === holdId) + 1;

    return position > 0 ? position : null;
  } catch (error) {
    console.error('Error getting queue position:', error);
    throw error;
  }
}

export function formatDate(date: Date | string | Timestamp): string {
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if (date instanceof Timestamp) {
    d = date.toDate();
  } else {
    d = date;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | Timestamp): string {
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if (date instanceof Timestamp) {
    d = date.toDate();
  } else {
    d = date;
  }
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function daysBetween(date1: Date | string | Timestamp, date2: Date | string | Timestamp): number {
  let d1: Date;
  let d2: Date;
  
  if (typeof date1 === 'string') {
    d1 = new Date(date1);
  } else if (date1 instanceof Timestamp) {
    d1 = date1.toDate();
  } else {
    d1 = date1;
  }
  
  if (typeof date2 === 'string') {
    d2 = new Date(date2);
  } else if (date2 instanceof Timestamp) {
    d2 = date2.toDate();
  } else {
    d2 = date2;
  }

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function isPastDate(date: Date | string | Timestamp): boolean {
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if (date instanceof Timestamp) {
    d = date.toDate();
  } else {
    d = date;
  }
  return d < new Date();
}
