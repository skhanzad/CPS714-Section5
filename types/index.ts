import { Timestamp } from 'firebase-admin/firestore';

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  isCheckedOut: boolean;
  currentBorrowerId?: string;
  dueDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Hold {
  id: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  memberEmail: string;
  status: 'active' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
  position: number;
  placedAt: Timestamp;
  notifiedAt?: Timestamp;
  readyAt?: Timestamp;
  expiresAt?: Timestamp;
  fulfilledAt?: Timestamp;
  updatedAt: Timestamp;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Timestamp;
}

export interface HoldShelfItem {
  id: string;
  holdId: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  itemTitle: string;
  placedOnShelfAt: Timestamp;
  expiresAt: Timestamp;
  notificationSent: boolean;
}

export type HoldStatus = 'active' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
