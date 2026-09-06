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

    category: z
      .string()
      .trim()
      .max(120, 'La categoría no puede superar los 120 caracteres')
      .nullable()
      .optional(),

    subcategory: z
      .string()
      .trim()
      .max(120, 'La subcategoría no puede superar los 120 caracteres')
      .nullable()
      .optional(),

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

export const createMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
});