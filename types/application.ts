export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  libraryCardNumber?: string;
  createdAt: string;
  updatedAt: string;
}
