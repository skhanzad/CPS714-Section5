export type ItemType = 'book' | 'dvd' | 'magazine' | 'other';

export type LoanStatus = 'checked-out' | 'returned' | 'overdue';

export type FineStatus = 'pending' | 'paid';

export type Item = {
  id: string;
  title: string;
  itemType: ItemType;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Loan = {
  id: string;
  memberId: string; // libraryCardNumber
  itemId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
};

export type Fine = {
  id: string;
  loanId: string;
  memberId: string;
  amount: number;
  status: FineStatus;
  calculatedDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
};