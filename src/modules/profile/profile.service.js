import prisma from '../../lib/prisma.js';

export async function getProfileByUserId(userId) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

export async function upsertProfile(userId, data) {
  return prisma.artistProfile.upsert({
    where: { userId },
    update: {
      ...(data.artistName ? { artistName: String(data.artistName).trim() } : {}),
      ...(data.username ? { username: String(data.username).trim() } : {}),
      ...(data.bio !== undefined ? { bio: String(data.bio) } : {}),
      ...(data.specialty !== undefined ? { specialty: String(data.specialty) } : {}),
      ...(data.city !== undefined ? { city: String(data.city) } : {}),
      ...(data.country !== undefined ? { country: String(data.country) } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: String(data.avatarUrl) } : {}),
      ...(data.coverUrl !== undefined ? { coverUrl: String(data.coverUrl) } : {}),
      ...(data.spotifyUrl !== undefined ? { spotifyUrl: String(data.spotifyUrl) } : {}),
      ...(data.youtubeUrl !== undefined ? { youtubeUrl: String(data.youtubeUrl) } : {}),
      ...(data.instagramUrl !== undefined ? { instagramUrl: String(data.instagramUrl) } : {}),
      ...(data.tiktokUrl !== undefined ? { tiktokUrl: String(data.tiktokUrl) } : {}),
    },
    create: {
      userId,
      artistName: data.artistName ? String(data.artistName).trim() : 'Artist',
      username: data.username ? String(data.username).trim() : `artist-${userId}`,
      bio: data.bio ?? null,
      specialty: data.specialty ?? null,
      city: data.city ?? null,
      country: data.country ?? null,
      avatarUrl: data.avatarUrl ?? null,
      coverUrl: data.coverUrl ?? null,
      spotifyUrl: data.spotifyUrl ?? null,
      youtubeUrl: data.youtubeUrl ?? null,
      instagramUrl: data.instagramUrl ?? null,
      tiktokUrl: data.tiktokUrl ?? null,
    },
  });
}

export async function getPublicProfile(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    include: {
      user: { select: { id: true, name: true, email: true } },
      publications: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
      shows: { orderBy: { showDate: 'desc' } },
    },
  });

  if (!profile) {
    const error = new Error('Perfil artístico no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return profile;
}
