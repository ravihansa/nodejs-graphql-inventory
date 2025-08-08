import { z } from 'zod';
import { objectIdSchema } from '../../utils/validators/customTypes.js';

export const createProductSchema = z.object({
    prodId: z.string().length(9, 'Product id must be 9 characters long'),
    name: z.string().min(3, 'Product name must be at least 3 characters long'),
    description: z.string().optional(),
    brand: z.string().min(3, 'Brand name must be at least 3 characters long').optional(),
    price: z.number().min(0, 'Price must be 0 or positive').multipleOf(0.01),
    isActive: z.boolean().default(true),
    categoryId: objectIdSchema,
});

export const updateProductSchema = z.object({
    prodId: z.string().length(9, 'Product id must be 9 characters long').optional(),
    name: z.string().min(3, 'Product name must be at least 3 characters long').optional(),
    description: z.string().optional(),
    brand: z.string().min(3, 'Brand name must be at least 3 characters long').optional(),
    price: z.number().min(0, 'Price must be 0 or positive').multipleOf(0.01).optional(),
    isActive: z.boolean().default(true).optional(),
    categoryId: objectIdSchema.optional(),
});
