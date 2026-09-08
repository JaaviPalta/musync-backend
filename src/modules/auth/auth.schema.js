import { z } from 'zod';

const userRoleSchema = z.enum(['artist', 'client']).default('artist');

export const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    artistName: z.string().trim().min(2).optional(),
    artist_name: z.string().trim().min(2).optional(),
    username: z.string().trim().min(3, 'El username debe tener al menos 3 caracteres').optional(),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: userRoleSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const role = data.role ?? 'artist';

    if (role === 'artist' && (!data.username || data.username.trim().length < 3)) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'El username debe tener al menos 3 caracteres',
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
