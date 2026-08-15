import { z } from 'zod';

export const updateProfileSchema = z.object({
  artistName: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  bio: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  spotifyUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  tiktokUrl: z.string().optional().nullable(),
}).passthrough();
