import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from 'firebase/firestore';


export async function recalculateQueuePositions(itemId: string) {
  try {
    const holdsQuery = query(
      collection(db, 'holds'),
      where('itemId', '==', itemId),
      where('status', '==', 'active'),
      orderBy('placedAt', 'asc')
    );

    const holdsSnapshot = await getDocs(holdsQuery);
    
    const updates = holdsSnapshot.docs.map((holdDoc, index) => {
      return updateDoc(doc(db, 'reservations', holdDoc.id), {
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
    const holdsQuery = query(
      collection(db, 'holds'),
      where('itemId', '==', itemId),
      where('status', '==', 'active'),
      orderBy('placedAt', 'asc')
    );

    const holdsSnapshot = await getDocs(holdsQuery);
    
    const position = holdsSnapshot.docs.findIndex(doc => doc.id === holdId) + 1;
    
    return position > 0 ? position : null;
  } catch (error) {
    console.error('Error getting queue position:', error);
    throw error;
  }
}


export async function checkExpiredHoldShelfItems() {
  try {
    const holdShelfQuery = query(collection(db, 'holdShelf'));
    const holdShelfSnapshot = await getDocs(holdShelfQuery);
    
    const now = new Date();
    const expiredItems = holdShelfSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.expiresAt && data.expiresAt.toDate() < now;
    });

    const updates = expiredItems.map(item => {
      const data = item.data();
      return updateDoc(doc(db, 'reservations', data.holdId), {
        status: 'expired',
      });
    });

    await Promise.all(updates);
    
    return { success: true, expiredCount: expiredItems.length };
  } catch (error) {
    console.error('Error checking expired hold shelf items:', error);
    throw error;
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}


export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function isPastDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}
