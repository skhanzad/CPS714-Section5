export interface HoldShelfItem {
  id: string;
  holdId: string;
  itemId: string;
  libraryCardNumber: string;
  memberName: string;
  itemTitle: string;
  placedOnShelfAt: string;
  expiresAt: string;
  notificationSent: boolean;
}
