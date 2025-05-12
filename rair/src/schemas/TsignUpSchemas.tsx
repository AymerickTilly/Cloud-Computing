import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords must match',
    path: ['confirmpassword'],
  });
  
  export type TsignUpSchema = z.infer<typeof signUpSchema>;