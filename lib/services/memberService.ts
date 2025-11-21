import type { Firestore } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase';
import { hashPin, verifyPin } from '@/lib/utils/pin';
import { generateApplicationId } from '@/lib/utils/id';
import { mapApplication, mapMember } from '@/lib/utils/mappers';
import type { MemberApplication, MemberApplicationDoc, MemberRecord } from '@/types/member';
import type { ApplicationInput, LoginInput } from '@/lib/validators/memberValidators';

const applicationsCollection = () => db.collection('memberApplications');
const membersCollection = () => db.collection('members');

const ensureEmailNotRegistered = async (email: string, firestore: Firestore) => {
  const existingMember = await firestore.collection('members').where('email', '==', email).limit(1).get();
  if (!existingMember.empty) {
    throw new Error('An approved member already exists with this email');
  }

  const existingPending = await firestore.collection('memberApplications').where('email', '==', email).where('status', '==', 'pending').limit(1).get();
  if (!existingPending.empty) {
    throw new Error('An application for this email is already pending review');
  }
};

export const submitApplication = async (input: ApplicationInput): Promise<MemberApplication> => {
  await ensureEmailNotRegistered(input.email, db);

  const docId = generateApplicationId();
  const timestamps = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const { pin, ...applicant } = input;
  const pinHash = await hashPin(pin);

  const payload: MemberApplicationDoc = {
    ...applicant,
    status: 'pending',
    pinHash,
    ...timestamps
  };

  await applicationsCollection().doc(docId).set(payload);

  const stored = await applicationsCollection().doc(docId).get();
  const application = mapApplication(stored);
  if (!application) {
    throw new Error('Failed to create application');
  }
  return application;
};

export const getApplication = async (applicationId: string): Promise<MemberApplication | null> => {
  const snap = await applicationsCollection().doc(applicationId).get();
  return mapApplication(snap);
};

export const authenticateMember = async (input: LoginInput): Promise<MemberRecord> => {
  const memberSnap = await membersCollection().doc(input.libraryCardNumber).get();
  const member = mapMember(memberSnap);
  if (!member) {
    throw new Error('Member not found');
  }

  if (member.status !== 'approved') {
    throw new Error('Member is not approved yet');
  }

  const matches = await verifyPin(input.pin, member.pinHash);
  if (!matches) {
    throw new Error('Invalid credentials');
  }

  return member;
};
