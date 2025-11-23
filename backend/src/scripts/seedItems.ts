import 'dotenv/config';
import { db } from '../config/firebase';
import { calculateDueDate } from '../utils/loan';
import type { Item, Loan } from '../types/loan';

const itemsCollection = () => db.collection('items');
const loansCollection = () => db.collection('loans');
const membersCollection = () => db.collection('members');

const dummyItems: Omit<Item, 'id'>[] = [
  // Books
  { title: 'The Great Gatsby', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'To Kill a Mockingbird', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: '1984', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Pride and Prejudice', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'The Catcher in the Rye', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Lord of the Flies', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Animal Farm', itemType: 'book', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // DVDs
  { title: 'The Shawshank Redemption', itemType: 'dvd', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'The Godfather', itemType: 'dvd', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Pulp Fiction', itemType: 'dvd', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'The Dark Knight', itemType: 'dvd', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Inception', itemType: 'dvd', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Magazines
  { title: 'National Geographic - January 2024', itemType: 'magazine', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Time Magazine - February 2024', itemType: 'magazine', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'Scientific American - March 2024', itemType: 'magazine', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Other
  { title: 'Audiobook: Harry Potter Series', itemType: 'other', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { title: 'E-Reader Device', itemType: 'other', isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

async function seedItems() {
  try {
    console.log('Starting to seed items...');

    // Get existing members to use for loans
    const membersSnapshot = await membersCollection().limit(5).get();
    const memberIds = membersSnapshot.docs.map(doc => doc.id);
    
    if (memberIds.length === 0) {
      console.log('⚠️  No members found. Please create some members first, or loans will be skipped.');
    }

    // Add items to Firestore
    const itemRefs: string[] = [];
    for (const item of dummyItems) {
      const itemRef = itemsCollection().doc();
      await itemRef.set(item);
      itemRefs.push(itemRef.id);
      console.log(`✓ Added item: ${item.title} (ID: ${itemRef.id})`);
    }

    // Create some loans for items (marking them as checked out)
    const loansToCreate = [
      { itemIndex: 0, memberIndex: 0, daysAgo: 5 }, // Book checked out 5 days ago
      { itemIndex: 1, memberIndex: 0, daysAgo: 10 }, // Book checked out 10 days ago
      { itemIndex: 7, memberIndex: Math.min(1, memberIds.length - 1), daysAgo: 3 }, // DVD checked out 3 days ago
      { itemIndex: 8, memberIndex: Math.min(1, memberIds.length - 1), daysAgo: 8 }, // DVD checked out 8 days ago (overdue if 1 week)
      { itemIndex: 12, memberIndex: Math.min(2, memberIds.length - 1), daysAgo: 15 }, // Magazine checked out 15 days ago
    ];
    
    if (memberIds.length > 0) {
      console.log('\nCreating loans for some items...');
      
      const now = new Date();

      for (const loanInfo of loansToCreate) {
        if (loanInfo.itemIndex >= itemRefs.length) continue;
        
        const itemId = itemRefs[loanInfo.itemIndex];
        const memberId = memberIds[loanInfo.memberIndex];
        
        // Get item to determine due date
        const itemDoc = await itemsCollection().doc(itemId).get();
        const item = itemDoc.data() as Item;
        
        const checkoutDate = new Date(now);
        checkoutDate.setDate(checkoutDate.getDate() - loanInfo.daysAgo);
        const dueDate = calculateDueDate(item.itemType, checkoutDate);
        
        const isOverdue = new Date() > dueDate;
        
        const loanId = `LOAN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const loan: Loan = {
          id: loanId,
          memberId,
          itemId,
          checkoutDate: checkoutDate.toISOString(),
          dueDate: dueDate.toISOString(),
          status: isOverdue ? 'overdue' : 'checked-out',
          createdAt: checkoutDate.toISOString(),
          updatedAt: checkoutDate.toISOString()
        };
        
        await loansCollection().doc(loanId).set(loan);
        
        // Update item availability
        await itemsCollection().doc(itemId).update({
          isAvailable: false,
          updatedAt: new Date().toISOString()
        });
        
        const itemTitle = dummyItems[loanInfo.itemIndex].title;
        console.log(`✓ Created loan for "${itemTitle}" (Member: ${memberId}, Status: ${loan.status})`);
      }
    }

    const loansCreated = memberIds.length > 0 ? loansToCreate.length : 0;
    console.log('\n✅ Seeding completed successfully!');
    console.log(`   - Added ${dummyItems.length} items`);
    console.log(`   - Created ${loansCreated} loans`);
    console.log(`   - ${dummyItems.length - loansCreated} items remain available`);
    
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    process.exit(1);
  }
}

// Run the seed function
seedItems()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

