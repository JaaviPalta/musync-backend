import { z } from 'zod';

const showDateSchema = z
  .iso
  .datetime({
    offset: true,
    message: 'La fecha debe ser una fecha ISO válida',
  })
  .transform((value) => new Date(value));

const optionalText = (max, field) =>
  z
    .string()
    .trim()
    .max(max, `${field} no puede superar los ${max} caracteres`)
    .nullable()
    .optional();

export const createShowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del show es obligatorio')
    .max(160, 'El nombre del show no puede superar los 160 caracteres'),

  venue: optionalText(160, 'El lugar'),

  city: optionalText(120, 'La ciudad'),

  showDate: showDateSchema,
});

export const updateShowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del show no puede estar vacío')
    .max(160, 'El nombre del show no puede superar los 160 caracteres')
    .optional(),

  venue: optionalText(160, 'El lugar'),

  city: optionalText(120, 'La ciudad'),

  showDate: showDateSchema.optional(),
});