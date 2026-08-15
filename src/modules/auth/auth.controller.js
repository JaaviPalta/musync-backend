import prisma from '../../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../../lib/auth.js';

const normalizeArtistName = (artistName, fallbackName) => {
  if (artistName && String(artistName).trim()) return String(artistName).trim();
  return String(fallbackName).trim();
};

export async function registerController(req, res, next) {
  try {
    const { name, artistName, artist_name, username, email, password } = req.body;

    const normalizedUsername = String(username).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedArtistName = normalizeArtistName(artistName ?? artist_name, name);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { artistProfile: { username: normalizedUsername } }] },
      include: { artistProfile: true },
    });

    if (existingUser) {
      return res.status(409).json({
        error: { code: 'CONFLICT', message: 'El email o nombre de usuario ya está registrado' },
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        artistProfile: {
          create: {
            artistName: normalizedArtistName,
            username: normalizedUsername,
          },
        },
      },
      include: { artistProfile: true },
    });

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        profile: user.artistProfile,
        token,
      },
      message: 'Usuario registrado correctamente',
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      include: { artistProfile: true },
    });

    if (!user) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' },
      });
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' },
      });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        profile: user.artistProfile,
        token,
      },
      message: 'Sesión iniciada correctamente',
    });
  } catch (error) {
    next(error);
  }
}

export async function meController(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { artistProfile: true },
    });

    if (!user) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Usuario no encontrado' },
      });
    }

    return res.status(200).json({
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        profile: user.artistProfile,
      },
    });
  } catch (error) {
    next(error);
  }
}
