import type { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import type { MemberApplication, MemberApplicationDoc, MemberRecord, MemberRecordDoc } from '../types/member';

const extractApplication = (data: Partial<MemberApplicationDoc> = {}): Omit<MemberApplication, 'id'> => ({
  firstName: data.firstName ?? '',
  lastName: data.lastName ?? '',
  email: data.email ?? '',
  address: data.address ?? '',
  phone: data.phone ?? '',
  status: data.status ?? 'pending',
  libraryCardNumber: data.libraryCardNumber,
  createdAt: data.createdAt ?? '',
  updatedAt: data.updatedAt ?? ''
});

const extractMember = (data: Partial<MemberRecordDoc> = {}, fallbackId: string): Omit<MemberRecord, 'id'> => ({
  firstName: data.firstName ?? '',
  lastName: data.lastName ?? '',
  email: data.email ?? '',
  address: data.address ?? '',
  phone: data.phone ?? '',
  status: data.status ?? 'pending',
  libraryCardNumber: data.libraryCardNumber ?? fallbackId,
  applicationId: data.applicationId ?? '',
  pinHash: data.pinHash ?? '',
  createdAt: data.createdAt ?? '',
  updatedAt: data.updatedAt ?? ''
});

export const mapApplication = (snap: DocumentSnapshot<DocumentData>): MemberApplication | null => {
  if (!snap.exists) return null;
  const data = snap.data() as Partial<MemberApplicationDoc> | undefined;
  const application = extractApplication(data);
  return { id: snap.id, ...application };
};

export const mapMember = (snap: DocumentSnapshot<DocumentData>): MemberRecord | null => {
  if (!snap.exists) return null;
  const data = snap.data() as Partial<MemberRecordDoc> | undefined;
  const member = extractMember(data, snap.id);
  return { id: snap.id, ...member };
};

export const mapApplicationForAdmin = mapApplication;
