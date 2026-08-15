import { z } from 'zod';

export const createQuoteSchema = z.object({
  artistId: z.coerce.number().int().positive().optional(),
  publicationId: z.coerce.number().int().positive().optional(),
  requestType: z.enum(['quote', 'booking']).optional(),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientEmail: z.string().email('Email inválido'),
  budget: z.coerce.number().int().nonnegative().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  message: z.string().min(1, 'El mensaje es obligatorio'),
}).passthrough();
