import fs from 'fs/promises';
import path from 'path';

export const serverHelper = {
  createJson: async (arrData: { data: any; fileName: string }[], pathArray = ['debug', 'output']) => {
    for (const x of arrData) {
      await fs.writeFile(path.join(process.cwd(), ...pathArray, `${x.fileName}.json`), JSON.stringify(x.data, null, 2));
    }
  },
};
