export interface Item {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  isCheckedOut: boolean;
  currentBorrowerId?: string;
  dueDate?: {
    _seconds: number;
    _nanoseconds: number;
  };
}
