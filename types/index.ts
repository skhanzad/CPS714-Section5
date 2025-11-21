export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  isCheckedOut: boolean;
  currentBorrowerId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hold {
  id: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  memberEmail: string;
  status: 'active' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
  position: number;
  placedAt: Date;
  notifiedAt?: Date;
  readyAt?: Date;
  expiresAt?: Date;
  fulfilledAt?: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface HoldShelfItem {
  id: string;
  holdId: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  itemTitle: string;
  placedOnShelfAt: Date;
  expiresAt: Date;
  notificationSent: boolean;
}

export type HoldStatus = 'active' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
