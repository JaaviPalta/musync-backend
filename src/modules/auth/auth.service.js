import prisma from '../../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../../lib/auth.js';

export async function registerUser(data) {
  const { name, artistName, artist_name, username, email, password } = data;

  const normalizedUsername = String(username).trim();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedArtistName = artistName || artist_name || name;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { artistProfile: { username: normalizedUsername } }] },
    include: { artistProfile: true },
  });

  if (existingUser) {
    const error = new Error('El email o nombre de usuario ya está registrado');
    error.code = 'CONFLICT';
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      artistProfile: {
        create: {
          artistName: String(normalizedArtistName).trim(),
          username: normalizedUsername,
        },
      },
    },
    include: { artistProfile: true },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    profile: user.artistProfile,
    token,
  };
}

export async function loginUser(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
    include: { artistProfile: true },
  });

  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('Credenciales inválidas');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    profile: user.artistProfile,
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { artistProfile: true },
  });

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return {
    user: { id: user.id, name: user.name, email: user.email },
    profile: user.artistProfile,
  };
}
