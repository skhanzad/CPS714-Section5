import { z } from 'zod';

export const checkoutSchema = z.object({
  memberId: z.string().min(5), // libraryCardNumber
  itemId: z.string().min(1)
});

export const checkinSchema = z.object({
  loanId: z.string().min(1),
  itemId: z.string().min(1)
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;