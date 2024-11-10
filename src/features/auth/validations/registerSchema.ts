import { z } from 'zod';
import { loginSchema } from './loginSchema';

export const registerSchema = loginSchema
    .extend({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
            .optional(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterFormType = z.infer<typeof registerSchema>;