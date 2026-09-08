import { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../lib/prisma.js';
import {
  comparePassword,
  hashPassword,
  signToken,
} from '../../lib/auth.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function getUniqueTarget(error) {
  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.join(',');
  }

  return String(target || '');
}

function handleAuthPrismaError(error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const target = getUniqueTarget(error);

    if (target.includes('email')) {
      throw createHttpError(
        'El email ya está registrado',
        'CONFLICT',
        409,
      );
    }

    if (target.includes('username')) {
      throw createHttpError(
        'El username ya está registrado',
        'CONFLICT',
        409,
      );
    }

    throw createHttpError(
      'El email o username ya está registrado',
      'CONFLICT',
      409,
    );
  }

  throw error;
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(data) {
  const {
    name,
    artistName,
    artist_name,
    username,
    email,
    password,
    role = 'artist',
  } = data;

  const normalizedArtistName = artistName || artist_name || name;
  const normalizedRole = role === 'client' ? 'client' : 'artist';

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: normalizedRole,

        ...(normalizedRole === 'artist' && {
          artistProfile: {
            create: {
              artistName: normalizedArtistName,
              username,
            },
          },
        }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        artistProfile: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: serializeUser(user),
      profile: user.artistProfile,
      token,
    };
  } catch (error) {
    handleAuthPrismaError(error);
  }
}

export async function loginUser(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,

      artistProfile: true,
    },
  });

  if (!user) {
    throw createHttpError(
      'Credenciales inválidas',
      'INVALID_CREDENTIALS',
      401,
    );
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createHttpError(
      'Credenciales inválidas',
      'INVALID_CREDENTIALS',
      401,
    );
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: serializeUser(user),
    profile: user.artistProfile,
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,

      artistProfile: true,
    },
  });

  if (!user) {
    throw createHttpError(
      'Usuario no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return {
    user: serializeUser(user),
    profile: user.artistProfile,
  };
}