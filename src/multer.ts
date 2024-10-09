import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const storage = diskStorage({
  destination: (req, _, cb) => {
    let dir = './public/images';

    if (req.url.includes('/artists')) {
      dir = './public/images/artists';
    }

    if (req.url.includes('/albums')) {
      dir = './public/images/albums';
    }

    fs.mkdir(dir, { recursive: true }, () => {
      cb(null, dir);
    });
  },
  filename: (_, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});
