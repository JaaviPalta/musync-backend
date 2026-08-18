import { z } from 'zod';

const itemSchema = z.object({
  publicationId: z.coerce
    .number()
    .int('El publicationId debe ser un entero')
    .positive('El publicationId debe ser positivo'),

  quantity: z.coerce
    .number()
    .int('La cantidad debe ser un entero')
    .positive('La cantidad debe ser positiva')
    .max(100, 'La cantidad máxima por item es 100')
    .default(1),
});

export const createOrderSchema = z
  .object({
    buyerName: z
      .string()
      .trim()
      .min(2, 'El nombre del comprador debe tener al menos 2 caracteres')
      .max(120, 'El nombre del comprador no puede superar los 120 caracteres'),

    buyerEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email('Email inválido')
      .max(255, 'El email no puede superar los 255 caracteres'),

    items: z
      .array(itemSchema)
      .min(1, 'Debe incluir al menos un item')
      .max(50, 'La orden no puede tener más de 50 items'),
  })
  .superRefine((data, ctx) => {
    const ids = data.items.map((item) => item.publicationId);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items'],
        message: 'No puedes repetir una publicación en la misma orden',
      });
    }
  });