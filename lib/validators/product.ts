import { z } from 'zod';

// Product creation schema
export const ProductCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().int().positive('Price must be a positive integer'),
});

// Product update schema
export const ProductUpdateSchema = ProductCreateSchema.partial();
