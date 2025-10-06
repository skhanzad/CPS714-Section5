import { z } from 'zod';

export const applicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  phone: z.string().min(7),
  pin: z.string().min(4).max(6)
});

export const loginSchema = z.object({
  libraryCardNumber: z.string().min(5),
  pin: z.string().min(4)
});

export const applicationIdSchema = z.object({
  applicationId: z.string().min(3)
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
