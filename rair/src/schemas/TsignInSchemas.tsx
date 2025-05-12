import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    remeberme: z.boolean().default(false),
  });
  
  export type TsignInSchema = z.infer<typeof signInSchema>;