import fs from 'node:fs/promises';
import path from 'node:path';

export async function cleanup() {
  try {
    const _path_json = path.join(process.cwd(), 'debug', 'json');
    const _path_pdf = path.join(process.cwd(), 'debug', 'pdf');
    const _path_img = path.join(process.cwd(), 'debug', 'img');

    const _dir_json = await fs.readdir(_path_json);
    const _dir_pdf = await fs.readdir(_path_pdf);
    const _dir_img = await fs.readdir(_path_img);

    for (const e of _dir_json) {
      if (e.includes('.json')) {
        await fs.unlink(path.join(_path_json, e));
      }
    }
    for (const e of _dir_pdf) {
      if (e.includes('.pdf')) {
        await fs.unlink(path.join(_path_pdf, e));
      }
    }
    for (const e of _dir_img) {
      if (e.includes('.img')) {
        await fs.unlink(path.join(_path_img, e));
      }
    }

    console.log('cleanup: success');
  } catch (error) {
    console.log('cleanup error', error);
  }
}

if (process.argv[2] === 'clean') cleanup();
