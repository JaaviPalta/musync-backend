import { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../lib/prisma.js';

const PROFILE_FIELDS = [
  'artistName',
  'username',
  'bio',
  'specialty',
  'city',
  'country',
  'avatarUrl',
  'coverUrl',
  'spotifyUrl',
  'youtubeUrl',
  'instagramUrl',
  'tiktokUrl',
];

function normalizeProfileData(data) {
  return Object.fromEntries(
    PROFILE_FIELDS
      .filter((field) => data[field] !== undefined)
      .map((field) => [
        field,
        data[field] === null
          ? null
          : String(data[field]).trim(),
      ]),
  );
}

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function getUniqueConflictMessage(error) {
  const target = error.meta?.target;

  if (Array.isArray(target) && target.includes('username')) {
    return 'El username ya está en uso';
  }

  if (typeof target === 'string' && target.includes('username')) {
    return 'El username ya está en uso';
  }

  return 'Ya existe un perfil con uno de esos datos únicos';
}

export async function getProfileByUserId(userId) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return profile;
}

export async function upsertProfile(userId, data) {
  const profileData = normalizeProfileData(data);

  const createData = {
    userId,
    artistName: profileData.artistName ?? 'Artist',
    username: profileData.username ?? `artist-${userId}`,
    bio: profileData.bio ?? null,
    specialty: profileData.specialty ?? null,
    city: profileData.city ?? null,
    country: profileData.country ?? null,
    avatarUrl: profileData.avatarUrl ?? null,
    coverUrl: profileData.coverUrl ?? null,
    spotifyUrl: profileData.spotifyUrl ?? null,
    youtubeUrl: profileData.youtubeUrl ?? null,
    instagramUrl: profileData.instagramUrl ?? null,
    tiktokUrl: profileData.tiktokUrl ?? null,
  };

  try {
    return await prisma.artistProfile.upsert({
      where: { userId },
      update: profileData,
      create: createData,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createHttpError(
        getUniqueConflictMessage(error),
        'CONFLICT',
        409,
      );
    }

    throw error;
  }
}

export async function getPublicProfile(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    select: {
      id: true,
      artistName: true,
      username: true,
      bio: true,
      specialty: true,
      city: true,
      country: true,
      avatarUrl: true,
      coverUrl: true,
      spotifyUrl: true,
      youtubeUrl: true,
      instagramUrl: true,
      tiktokUrl: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },

      publications: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },

      shows: {
        orderBy: { showDate: 'desc' },
      },
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil artístico no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return profile;
}