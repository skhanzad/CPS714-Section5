import { FieldValue } from 'firebase-admin/firestore';
import type { Query, DocumentData } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import type {
  MemberApplication,
  MemberApplicationDoc,
  MemberRecord,
  MemberRecordDoc
} from '../types/member';
import { generateLibraryCardNumber } from '../utils/id';
import { mapApplicationForAdmin } from '../utils/mappers';

const applicationsCollection = () => db.collection('memberApplications');
const membersCollection = () => db.collection('members');

const ensureUniqueLibraryCard = async (cardNumber: string) => {
  const existing = await membersCollection().doc(cardNumber).get();
  return !existing.exists;
};

const pickUniqueCardNumber = async (): Promise<string> => {
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const candidate = generateLibraryCardNumber();
    if (await ensureUniqueLibraryCard(candidate)) {
      return candidate;
    }
  }
  throw new Error('Unable to generate unique library card number');
};

export const listApplications = async (status?: string): Promise<MemberApplication[]> => {
  let query: Query<DocumentData> = applicationsCollection();
  if (status) {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(25).get();
  return snapshot.docs
    .map((doc) => mapApplicationForAdmin(doc))
    .filter((app): app is MemberApplication => Boolean(app));
};

export const listMembers = async (): Promise<MemberRecord[]> => {
  const snapshot = await membersCollection()
    .where('status', '==', 'approved')
    .get();
  
  const members = snapshot.docs.map(doc => {
    const data = doc.data() as MemberRecordDoc;
    return {
      id: doc.id,
      ...data
    } satisfies MemberRecord;
  });
  
  // Sort by library card number in memory
  return members.sort((a, b) => a.libraryCardNumber.localeCompare(b.libraryCardNumber));
};

export const approveApplication = async (applicationId: string): Promise<MemberRecord> => {
  const now = new Date().toISOString();

  const member = await db.runTransaction(async (transaction) => {
    const appRef = applicationsCollection().doc(applicationId);
    const appSnap = await transaction.get(appRef);
    if (!appSnap.exists) {
      throw new Error('Application not found');
    }

    const data = appSnap.data() as MemberApplicationDoc | undefined;
    if (!data) {
      throw new Error('Application data missing');
    }

    if (data.status !== 'pending') {
      throw new Error('Application is not pending');
    }

    const pinHash = data.pinHash;
    if (!pinHash) {
      throw new Error('Application PIN hash missing');
    }

    const {
      firstName = '',
      lastName = '',
      email = '',
      address = '',
      phone = '',
      libraryCardNumber: existingCard
    } = data;

    const libraryCardNumber = existingCard ?? await pickUniqueCardNumber();
    const memberRef = membersCollection().doc(libraryCardNumber);

    const memberPayload: MemberRecordDoc = {
      firstName,
      lastName,
      email,
      address,
      phone,
      status: 'approved',
      libraryCardNumber,
      applicationId,
      pinHash,
      createdAt: now,
      updatedAt: now
    };

    transaction.set(memberRef, memberPayload);
    transaction.update(appRef, {
      status: 'approved',
      libraryCardNumber,
      updatedAt: now,
      pinHash: FieldValue.delete()
    });

    return {
      id: memberRef.id,
      ...memberPayload
    } satisfies MemberRecord;
  });

  return member;
};
