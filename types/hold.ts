export interface Hold {
  id: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  memberEmail: string;
  status: string;
  position: number;
  placedAt: string;
  readyAt?: string;
  expiresAt?: string;
  updatedAt: string;
}

export interface HoldWithItem extends Hold {
  itemDetails?: {
    id: string;
    title: string;
    author: string;
  };
}
