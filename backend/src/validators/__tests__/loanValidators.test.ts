import { describe, it, expect } from 'vitest';
import { checkoutSchema, checkinSchema } from '../loanValidators';

describe('checkoutSchema', () => {
  it('should validate correct checkout input', () => {
    const validInput = {
      memberId: 'LIB-12345678',
      itemId: 'ITEM-123'
    };
    
    const result = checkoutSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.memberId).toBe('LIB-12345678');
      expect(result.data.itemId).toBe('ITEM-123');
    }
  });

  it('should reject checkout with memberId too short', () => {
    const invalidInput = {
      memberId: 'LIB',
      itemId: 'ITEM-123'
    };
    
    const result = checkoutSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkout with empty itemId', () => {
    const invalidInput = {
      memberId: 'LIB-12345678',
      itemId: ''
    };
    
    const result = checkoutSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkout with missing memberId', () => {
    const invalidInput = {
      itemId: 'ITEM-123'
    };
    
    const result = checkoutSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkout with missing itemId', () => {
    const invalidInput = {
      memberId: 'LIB-12345678'
    };
    
    const result = checkoutSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('checkinSchema', () => {
  it('should validate correct checkin input', () => {
    const validInput = {
      loanId: 'LOAN-123456',
      itemId: 'ITEM-123'
    };
    
    const result = checkinSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.loanId).toBe('LOAN-123456');
      expect(result.data.itemId).toBe('ITEM-123');
    }
  });

  it('should reject checkin with empty loanId', () => {
    const invalidInput = {
      loanId: '',
      itemId: 'ITEM-123'
    };
    
    const result = checkinSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkin with empty itemId', () => {
    const invalidInput = {
      loanId: 'LOAN-123456',
      itemId: ''
    };
    
    const result = checkinSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkin with missing loanId', () => {
    const invalidInput = {
      itemId: 'ITEM-123'
    };
    
    const result = checkinSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject checkin with missing itemId', () => {
    const invalidInput = {
      loanId: 'LOAN-123456'
    };
    
    const result = checkinSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

