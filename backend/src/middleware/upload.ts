import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const allowedImageTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.resolve(process.cwd(), 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const extension = allowedImageTypes.get(file.mimetype);
    if (!extension) {
      return cb(new Error('Unsupported image type'), '');
    }
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => cb(null, allowedImageTypes.has(file.mimetype)),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
    fields: 20,
    parts: 30,
    fieldNameSize: 100,
    fieldSize: 20 * 1024,
  },
});
