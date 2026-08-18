import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .max(500, 'El texto no puede superar los 500 caracteres')
  .nullable()
  .optional();

const optionalShortText = z
  .string()
  .trim()
  .max(100, 'El texto no puede superar los 100 caracteres')
  .nullable()
  .optional();

const optionalUrl = z
  .string()
  .trim()
  .url('Debe ser una URL válida')
  .nullable()
  .optional();

export const updateProfileSchema = z.object({
  artistName: z
    .string()
    .trim()
    .min(2, 'El nombre artístico debe tener al menos 2 caracteres')
    .max(100, 'El nombre artístico no puede superar los 100 caracteres')
    .optional(),

  username: z
    .string()
    .trim()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(30, 'El username no puede superar los 30 caracteres')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'El username solo puede contener letras, números, guiones y guiones bajos',
    )
    .optional(),

  bio: optionalText,
  specialty: optionalShortText,
  city: optionalShortText,
  country: optionalShortText,

  avatarUrl: optionalUrl,
  coverUrl: optionalUrl,
  spotifyUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});