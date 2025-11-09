export type MemberStatus = 'pending' | 'approved' | 'rejected';

export type MemberApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status: MemberStatus;
  libraryCardNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export type MemberRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status: MemberStatus;
  libraryCardNumber: string;
  applicationId: string;
  pinHash: string;
  createdAt: string;
  updatedAt: string;
};

export type MemberApplicationDoc = Omit<MemberApplication, 'id'> & {
  pinHash?: string;
};

export type MemberRecordDoc = Omit<MemberRecord, 'id'>;
