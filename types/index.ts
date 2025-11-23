// Section 5, Team 3
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
