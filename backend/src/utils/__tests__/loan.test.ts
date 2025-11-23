import { describe, it, expect } from 'vitest';
import { calculateDueDate, calculateLateFee } from '../loan';

describe('calculateDueDate', () => {
  it('should calculate due date for books (3 weeks)', () => {
    const checkoutDate = new Date('2024-01-01');
    const dueDate = calculateDueDate('book', checkoutDate);
    const expectedDate = new Date('2024-01-22'); // 21 days later
    
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should calculate due date for DVDs (1 week)', () => {
    const checkoutDate = new Date('2024-01-01');
    const dueDate = calculateDueDate('dvd', checkoutDate);
    const expectedDate = new Date('2024-01-08'); // 7 days later
    
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should calculate due date for magazines (2 weeks)', () => {
    const checkoutDate = new Date('2024-01-01');
    const dueDate = calculateDueDate('magazine', checkoutDate);
    const expectedDate = new Date('2024-01-15'); // 14 days later
    
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should use default 2 weeks for other item types', () => {
    const checkoutDate = new Date('2024-01-01');
    const dueDate = calculateDueDate('other', checkoutDate);
    const expectedDate = new Date('2024-01-15'); // 14 days later
    
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should use current date if no checkout date provided', () => {
    const now = new Date();
    const dueDate = calculateDueDate('book');
    const expectedDate = new Date(now);
    expectedDate.setDate(expectedDate.getDate() + 21);
    
    // Allow 1 second difference for execution time
    expect(Math.abs(dueDate.getTime() - expectedDate.getTime())).toBeLessThan(1000);
  });
});

describe('calculateLateFee', () => {
  it('should return 0 if item is returned on time', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-15');
    
    expect(calculateLateFee(dueDate, returnDate)).toBe(0);
  });

  it('should return 0 if item is returned before due date', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-14');
    
    expect(calculateLateFee(dueDate, returnDate)).toBe(0);
  });

  it('should calculate fee for 1 day overdue', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-16');
    
    expect(calculateLateFee(dueDate, returnDate)).toBe(0.50);
  });

  it('should calculate fee for 5 days overdue', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-20');
    
    expect(calculateLateFee(dueDate, returnDate)).toBe(2.50);
  });

  it('should calculate fee for 10 days overdue', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-25');
    
    expect(calculateLateFee(dueDate, returnDate)).toBe(5.00);
  });

  it('should round to 2 decimal places', () => {
    const dueDate = new Date('2024-01-15');
    const returnDate = new Date('2024-01-16');
    
    const fee = calculateLateFee(dueDate, returnDate);
    expect(fee).toBe(0.50);
    // Check that fee has at most 2 decimal places
    const decimalPart = fee.toString().split('.')[1];
    expect(decimalPart?.length || 0).toBeLessThanOrEqual(2);
  });

  it('should use current date if no return date provided', () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 1); // 1 day ago
    
    const fee = calculateLateFee(dueDate);
    expect(fee).toBe(0.50);
  });
});

