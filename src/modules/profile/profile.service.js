import { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../lib/prisma.js';
import { uploadImageToCloudinary } from '../../lib/cloudinary.js';

const PROFILE_FIELDS = [
  'artistName',
  'username',
  'bio',
  'specialty',
  'city',
  'country',
  'availability',
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
          role: true,
        },
      },
    },
  });

  if (!profile) {
    return null;
  }

  return profile;
}

export async function upsertProfile(userId, data, files = {}) {
  const profileData = normalizeProfileData(data);

  // tags es un array — no pasa por normalizeProfileData porque esa función
  // fuerza todo a String().trim(), lo que corrompería un array (String(['a','b'])
  // da 'a,b', no un array). Se maneja aparte.
  if (data.tags !== undefined) {
    profileData.tags = data.tags;
  }

  const avatarFile = files?.avatarFile;
  const coverFile = files?.coverFile;

  if (avatarFile) {
    const avatarUpload = await uploadImageToCloudinary(avatarFile, 'musync/profile/avatar');
    profileData.avatarUrl = avatarUpload.secure_url;
  }

  if (coverFile) {
    const coverUpload = await uploadImageToCloudinary(coverFile, 'musync/profile/cover');
    profileData.coverUrl = coverUpload.secure_url;
  }

  const createData = {
    userId,
    artistName: profileData.artistName ?? 'Artist',
    username: profileData.username ?? `artist-${userId}`,
    bio: profileData.bio ?? null,
    specialty: profileData.specialty ?? null,
    city: profileData.city ?? null,
    country: profileData.country ?? null,
    availability: profileData.availability ?? null,
    avatarUrl: profileData.avatarUrl ?? null,
    coverUrl: profileData.coverUrl ?? null,
    spotifyUrl: profileData.spotifyUrl ?? null,
    youtubeUrl: profileData.youtubeUrl ?? null,
    instagramUrl: profileData.instagramUrl ?? null,
    tiktokUrl: profileData.tiktokUrl ?? null,
    tags: profileData.tags ?? [],
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

export async function getArtistsList({ search = '', page = 1, limit = 20 } = {}) {
  const normalizedSearch = String(search).trim();
  const safePage = Number.isFinite(Number(page)) ? Math.max(Number(page), 1) : 1;
  const safeLimit = Number.isFinite(Number(limit)) ? Math.min(Math.max(Number(limit), 1), 100) : 20;
  const skip = (safePage - 1) * safeLimit;

  const where = normalizedSearch
    ? {
        OR: [
          { artistName: { contains: normalizedSearch, mode: 'insensitive' } },
          { username: { contains: normalizedSearch, mode: 'insensitive' } },
          { specialty: { contains: normalizedSearch, mode: 'insensitive' } },
          { city: { contains: normalizedSearch, mode: 'insensitive' } },
          { country: { contains: normalizedSearch, mode: 'insensitive' } },
        ],
      }
    : {};

  const [artists, total] = await Promise.all([
    prisma.artistProfile.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        artistName: true,
        username: true,
        bio: true,
        specialty: true,
        city: true,
        country: true,
        tags: true,
        availability: true,
        avatarUrl: true,
        coverUrl: true,
        spotifyUrl: true,
        youtubeUrl: true,
        instagramUrl: true,
        tiktokUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.artistProfile.count({ where }),
  ]);

  return {
    artists,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
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
      tags: true,
      availability: true,
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