require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const sampleItems = [
  {
    title: "Book 1",
    author: "A1",
    isbn: "1",
    isCheckedOut: true,
    currentBorrowerId: "1",
    dueDate: new Date('2025-11-30'),
    onHoldShelf: false,
  },
  {
    title: "Book 2",
    author: "A2",
    isbn: "2",
    isCheckedOut: true,
    currentBorrowerId: "2",
    dueDate: new Date('2025-11-28'),
    onHoldShelf: false,
  },
  {
    title: "Book 3",
    author: "A3",
    isbn: "3",
    isCheckedOut: false,
    onHoldShelf: false,
  },
  {
    title: "Book 4",
    author: "A4",
    isbn: "4",
    isCheckedOut: true,
    currentBorrowerId: "3",
    dueDate: new Date('2025-12-05'),
    onHoldShelf: false,
  },
  {
    title: "Book 5",
    author: "A5",
    isbn: "5",
    isCheckedOut: false,
    onHoldShelf: false,
  },
  {
    title: "Book 6",
    author: "A6",
    isbn: "6",
    isCheckedOut: true,
    currentBorrowerId: "4",
    dueDate: new Date('2025-12-01'),
    onHoldShelf: false,
  },
];

const sampleMembers = [
  {
    id: "member001",
    name: "Member One",
    email: "member1@example.com",
    phone: "555-0101",
  },
  {
    id: "member002",
    name: "Member Two",
    email: "member2@example.com",
    phone: "555-0102",
  },
  {
    id: "member003",
    name: "Member Three",
    email: "member3@example.com",
    phone: "555-0103",
  },
  {
    id: "member004",
    name: "Member Four",
    email: "member4@example.com",
    phone: "555-0104",
  },
  {
    id: "member005",
    name: "Member Five",
    email: "member5@example.com",
    phone: "555-0105",
  },
];

async function seedDatabase() {
  try {
    const collections = ['items', 'reservations', 'holdShelf', 'members'];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
    }

    for (const member of sampleMembers) {
      const { id, ...memberData } = member;
      await db.collection('members').doc(id).set({
        ...memberData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }


    const itemIds = [];
    for (const item of sampleItems) {
      const itemRef = await db.collection('items').add({
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      itemIds.push(itemRef.id);
    }


    const checkedOutItems = await db.collection('items').where('isCheckedOut', '==', true).get();

    if (!checkedOutItems.empty) {
      const firstItem = checkedOutItems.docs[0];
      const secondItem = checkedOutItems.docs[1];

      const holdsForFirstItem = [
        {
          itemId: firstItem.id,
          memberId: 'member002',
          memberName: 'Member Two',
          memberEmail: 'member2@example.com',
          status: 'active',
          position: 1,
          placedAt: admin.firestore.Timestamp.fromDate(new Date('2025-11-10')),
        },
        {
          itemId: firstItem.id,
          memberId: 'member003',
          memberName: 'Member Three',
          memberEmail: 'member3@example.com',
          status: 'active',
          position: 2,
          placedAt: admin.firestore.Timestamp.fromDate(new Date('2025-11-12')),
        },
        {
          itemId: firstItem.id,
          memberId: 'member005',
          memberName: 'Member Five',
          memberEmail: 'member5@example.com',
          status: 'active',
          position: 3,
          placedAt: admin.firestore.Timestamp.fromDate(new Date('2025-11-14')),
        },
      ];

      for (const hold of holdsForFirstItem) {
        await db.collection('reservations').add({
          ...hold,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await db.collection('reservations').add({
        itemId: secondItem.id,
        memberId: 'member004',
        memberName: 'Member Four',
        memberEmail: 'member4@example.com',
        status: 'active',
        position: 1,
        placedAt: admin.firestore.Timestamp.fromDate(new Date('2025-11-13')),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedDatabase();
