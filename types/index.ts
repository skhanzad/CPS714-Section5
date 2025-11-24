// Section 5, Team 3

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  isCheckedOut: boolean;
  currentBorrowerId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
