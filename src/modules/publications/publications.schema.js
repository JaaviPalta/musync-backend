import { z } from 'zod';

export const createPublicationSchema = z.object({
  type: z.enum(['music', 'digital_product', 'service', 'portfolio']),
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  externalUrl: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional(),
}).passthrough();

export const updatePublicationSchema = z.object({
  type: z.enum(['music', 'digital_product', 'service', 'portfolio']).optional(),
  title: z.string().min(1, 'El título es obligatorio').optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  externalUrl: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional(),
}).passthrough();
