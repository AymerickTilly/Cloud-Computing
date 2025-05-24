
import { z } from "zod";

export const addToCartSchema = z.object({
  userId: z.string().min(1, "User ID is required"), // Changed to string for Cognito user ID
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"], {
    errorMap: () => ({ message: "Please select a valid size" }),
  }),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"), // Changed to min(1) for cart
  imageUrl: z.string().min(1, "Image URL is required"), // Use existing imageUrl
});

export type TAddToCartSchema = z.infer<typeof addToCartSchema>;