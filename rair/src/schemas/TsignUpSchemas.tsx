import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().email("Invalid email address"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmpassword: z.string().min(10, "Confirm Password must be at least 10 characters"),
  });
  
  export type TsignUpSchema = z.infer<typeof signUpSchema>;