import { db } from '../config/firebase';
import { calculateDueDate, calculateLateFee } from '../utils/loan';
import type { Loan, Item, Fine, LoanStatus } from '../types/loan';
import type { CheckoutInput, CheckinInput } from '../validators/loanValidators.ts';

const loansCollection = () => db.collection('loans');
const itemsCollection = () => db.collection('items');
const finesCollection = () => db.collection('fines');
const membersCollection = () => db.collection('members');

// Checkout: Create loan, update item availability
export const checkoutItem = async (input: CheckoutInput): Promise<Loan> => {
  const now = new Date();
  
  return await db.runTransaction(async (transaction) => {
    // Verify member exists and is approved
    const memberRef = membersCollection().doc(input.memberId);
    const memberSnap = await transaction.get(memberRef);
    if (!memberSnap.exists) {
      throw new Error('Member not found');
    }
    const member = memberSnap.data();
    if (member?.status !== 'approved') {
      throw new Error('Member is not approved');
    }
    
    // Verify item exists and is available
    const itemRef = itemsCollection().doc(input.itemId);
    const itemSnap = await transaction.get(itemRef);
    if (!itemSnap.exists) {
      throw new Error('Item not found');
    }
    const item = itemSnap.data() as Item;
    if (!item.isAvailable) {
      throw new Error('Item is not available');
    }
    
    // Create loan
    const loanId = `LOAN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const dueDate = calculateDueDate(item.itemType, now);
    
    const loan: Loan = {
      id: loanId,
      memberId: input.memberId,
      itemId: input.itemId,
      checkoutDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'checked-out',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    const loanRef = loansCollection().doc(loanId);
    transaction.set(loanRef, loan);
    
    // Update item availability
    transaction.update(itemRef, {
      isAvailable: false,
      updatedAt: now.toISOString()
    });
    
    return loan;
  });
};

// Checkin: Update loan, calculate fines if overdue, update item availability
export const checkinItem = async (input: CheckinInput): Promise<{ loan: Loan; fine?: Fine }> => {
  const now = new Date();
  
  return await db.runTransaction(async (transaction) => {
    // Get loan
    const loanRef = loansCollection().doc(input.loanId);
    const loanSnap = await transaction.get(loanRef);
    if (!loanSnap.exists) {
      throw new Error('Loan not found');
    }
    const loan = loanSnap.data() as Loan;
    
    if (loan.status === 'returned') {
      throw new Error('Item already returned');
    }
    
    if (loan.itemId !== input.itemId) {
      throw new Error('Item ID mismatch');
    }
    
    // Calculate fine if overdue
    const dueDate = new Date(loan.dueDate);
    const fineAmount = calculateLateFee(dueDate, now);
    
    let fine: Fine | undefined;
    if (fineAmount > 0) {
      const fineId = `FINE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      fine = {
        id: fineId,
        loanId: input.loanId,
        memberId: loan.memberId,
        amount: fineAmount,
        status: 'pending',
        calculatedDate: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      const fineRef = finesCollection().doc(fineId);
      transaction.set(fineRef, fine);
    }
    
    // Update loan status
    const status: LoanStatus = fineAmount > 0 ? 'overdue' : 'returned';
    transaction.update(loanRef, {
      returnDate: now.toISOString(),
      status,
      updatedAt: now.toISOString()
    });
    
    // Update item availability
    const itemRef = itemsCollection().doc(input.itemId);
    transaction.update(itemRef, {
      isAvailable: true,
      updatedAt: now.toISOString()
    });
    
    return {
      loan: { ...loan, returnDate: now.toISOString(), status },
      fine
    };
  });
};

// Get active loans for a member
export const getMemberLoans = async (memberId: string): Promise<Loan[]> => {
  const snapshot = await loansCollection()
    .where('memberId', '==', memberId)
    .where('status', 'in', ['checked-out', 'overdue'])
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Loan));
};

// Get pending fines for a member
export const getMemberFines = async (memberId: string): Promise<Fine[]> => {
  const snapshot = await finesCollection()
    .where('memberId', '==', memberId)
    .where('status', '==', 'pending')
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fine));
};