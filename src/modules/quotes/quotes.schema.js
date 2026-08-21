import { z } from 'zod';

const idSchema = z.coerce
  .number()
  .int('El id debe ser un entero')
  .positive('El id debe ser positivo');

const optionalDateSchema = z
  .string()
  .trim()
  .date('La fecha debe tener el formato YYYY-MM-DD')
  .nullable()
  .optional();

export const createQuoteSchema = z
  .object({
    artistId: idSchema.optional(),

    publicationId: idSchema.optional(),

    requestType: z
      .enum(['quote', 'booking'])
      .default('quote'),

    clientName: z
      .string()
      .trim()
      .min(2, 'El nombre del cliente debe tener al menos 2 caracteres')
      .max(120, 'El nombre del cliente no puede superar los 120 caracteres'),

    clientEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email('Email inválido')
      .max(255, 'El email no puede superar los 255 caracteres'),

    budget: z
      .coerce
      .number()
      .int('El presupuesto debe ser un número entero')
      .nonnegative('El presupuesto no puede ser negativo')
      .nullable()
      .optional(),

    eventDate: optionalDateSchema,

    message: z
      .string()
      .trim()
      .min(1, 'El mensaje es obligatorio')
      .max(5000, 'El mensaje no puede superar los 5000 caracteres'),
  })
  .superRefine((data, ctx) => {
    if (!data.artistId && !data.publicationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['artistId'],
        message: 'Debes indicar un artista o una publicación',
      });
    }

    if (data.artistId && data.publicationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['publicationId'],
        message: 'Indica artistId o publicationId, no ambos',
      });
    }
  });

export const updateQuoteStatusSchema = z.object({
  status: z.enum([
    'pending',
    'reviewed',
    'accepted',
    'rejected',
  ]),
});