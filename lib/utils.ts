import { db } from './firebase';

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
