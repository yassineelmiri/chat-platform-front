// # Types specific to Auth
// import { z } from "zod";

// export const loginSchema = z.object({
//     email: z.string().email("Invalid email address"),
//     password: z
//         .string()
//         .min(4, "Password must be at least 4 characters")
//         .regex(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//             "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//         ),
// });

// export const registerSchema = loginSchema.extend({
//     username: z
//         .string()
//         .min(3, "Username must be at least 3 characters")
//         .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
//         .optional(),
//     confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
// });

// export type LoginFormType = z.infer<typeof loginSchema>;
// export type RegisterFormType = z.infer<typeof registerSchema>;
// export type FormType = LoginFormType | RegisterFormType;