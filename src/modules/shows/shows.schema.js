import { z } from 'zod';

export const createShowSchema = z.object({
  name: z.string().min(1, 'El nombre del show es obligatorio'),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  showDate: z.string().min(1, 'La fecha del show es obligatoria'),
}).passthrough();

export const updateShowSchema = z.object({
  name: z.string().min(1, 'El nombre del show es obligatorio').optional(),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  showDate: z.string().min(1, 'La fecha del show es obligatoria').optional(),
}).passthrough();
