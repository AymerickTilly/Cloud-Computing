import { z } from "zod";

export const signUpConfirmSchema = z.object({
    username: z.string().min(4),
    code: z.string(),
  });
  
  export type TsignUpConfirmSchema = z.infer<typeof signUpConfirmSchema>;