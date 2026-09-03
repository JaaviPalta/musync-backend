import test from 'node:test';
import assert from 'node:assert/strict';

import { buildPublicFileUrl, saveUploadedFile } from '../src/lib/uploads.js';

test('buildPublicFileUrl creates a public URL for uploaded assets', () => {
  const url = buildPublicFileUrl('profile-avatar.png');

  assert.match(url, /\/uploads\/profile-avatar\.png$/);
  assert.ok(url.startsWith('http://localhost:3000') || url.includes('localhost'));
});

test('saveUploadedFile stores an uploaded image and returns a public URL', async () => {
  const file = {
    originalname: 'test-profile.png',
    mimetype: 'image/png',
    buffer: Buffer.from('fake-image-content'),
  };

  const result = await saveUploadedFile(file);

  assert.ok(result?.url);
  assert.match(result.url, /\/uploads\//);
  assert.ok(result.fileName.length > 0);
});
