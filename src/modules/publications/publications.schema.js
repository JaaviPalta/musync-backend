import { z } from 'zod';

const publicationTypeSchema = z.enum([
  'music',
  'digital_product',
  'service',
  'portfolio',
]);

const nullableUrlSchema = z
  .string()
  .trim()
  .url('Debe ser una URL válida')
  .nullable()
  .optional();

const activeSchema = z
  .boolean()
  .optional();

export const createPublicationSchema = z.object({
  type: publicationTypeSchema,

  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(160, 'El título no puede superar los 160 caracteres'),

  description: z
    .string()
    .trim()
    .max(5000, 'La descripción no puede superar los 5000 caracteres')
    .nullable()
    .optional(),

  price: z
    .coerce
    .number()
    .int('El precio debe ser un número entero')
    .nonnegative('El precio no puede ser negativo')
    .nullable()
    .optional(),

  imageUrl: nullableUrlSchema,
  externalUrl: nullableUrlSchema,

  // El servidor debe decidir el valor inicial.
  // Por eso no lo aceptamos desde el cliente.
});

export const updatePublicationSchema = z.object({
  type: publicationTypeSchema.optional(),

  title: z
    .string()
    .trim()
    .min(1, 'El título no puede estar vacío')
    .max(160, 'El título no puede superar los 160 caracteres')
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000, 'La descripción no puede superar los 5000 caracteres')
    .nullable()
    .optional(),

  price: z
    .coerce
    .number()
    .int('El precio debe ser un número entero')
    .nonnegative('El precio no puede ser negativo')
    .nullable()
    .optional(),

  imageUrl: nullableUrlSchema,
  externalUrl: nullableUrlSchema,

  isActive: activeSchema,
});