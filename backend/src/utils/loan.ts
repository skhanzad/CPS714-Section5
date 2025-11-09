import type { ItemType } from '../types/loan';

// Due date calculator based on item type
export const calculateDueDate = (itemType: ItemType, checkoutDate: Date = new Date()): Date => {
  const dueDate = new Date(checkoutDate);
  
  switch (itemType) {
    case 'book':
      dueDate.setDate(dueDate.getDate() + 21); // 3 weeks
      break;
    case 'dvd':
      dueDate.setDate(dueDate.getDate() + 7); // 1 week
      break;
    case 'magazine':
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
      break;
    default:
      dueDate.setDate(dueDate.getDate() + 14); // default 2 weeks
  }
  
  return dueDate;
};

// Late fee calculator
export const calculateLateFee = (dueDate: Date, returnDate: Date = new Date()): number => {
  if (returnDate <= dueDate) {
    return 0;
  }
  
  const daysOverdue = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  const feePerDay = 0.50; // Configurable
  return Math.round(daysOverdue * feePerDay * 100) / 100; // Round to 2 decimals
};