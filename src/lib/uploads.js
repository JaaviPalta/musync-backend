import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function buildPublicFileUrl(fileName, folder = 'uploads') {
  const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  const normalizedBase = baseUrl.replace(/\/$/, '');

  return new URL(`/${folder}/${fileName}`, normalizedBase).toString();
}

export async function saveUploadedFile(file, folder = 'uploads') {
  if (!file) {
    return null;
  }

  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new Error('Solo se permiten imágenes JPG, PNG o WebP');
  }

  const destinationDir = path.join(ROOT_DIR, folder);
  await fs.mkdir(destinationDir, { recursive: true });

  const extension = path.extname(file.originalname || '').toLowerCase() || '.png';
  const safeFileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const targetPath = path.join(destinationDir, safeFileName);

  await fs.writeFile(targetPath, file.buffer || Buffer.alloc(0));

  return {
    fileName: safeFileName,
    url: buildPublicFileUrl(safeFileName, folder),
    mimeType: file.mimetype,
    size: file.size ?? (file.buffer?.length ?? 0),
  };
}
