import { z } from 'zod';

const itemSchema = z.object({
  publicationId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().default(1),
});

export const createOrderSchema = z.object({
  buyerName: z.string().min(1, 'El nombre del comprador es obligatorio'),
  buyerEmail: z.string().email('Email inválido'),
  items: z.array(itemSchema).min(1, 'Debe incluir al menos un item'),
}).passthrough();
