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

// Cuando el formulario de publicaciones manda esto (siempre va como
// multipart/form-data, tenga imagen o no), isActive llega como el texto
// "true"/"false", no como boolean real — FormData no tiene otra forma de
// mandarlo. z.coerce.boolean() no sirve acá: Boolean("false") da true en
// JS, así que coercionaría mal el caso "false". Hay que interpretarlo a mano.
const activeSchema = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean().optional());

const optionalSpecText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
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

  format: optionalSpecText(160),
  sizeLabel: optionalSpecText(60),
  license: optionalSpecText(160),

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

  format: optionalSpecText(160),
  sizeLabel: optionalSpecText(60),
  license: optionalSpecText(160),

  isActive: activeSchema,
});