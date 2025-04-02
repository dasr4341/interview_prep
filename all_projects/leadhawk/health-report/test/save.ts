import fs from 'node:fs/promises';
import path from 'node:path';

import { download_data } from '../src/utils/download_util.js';

async function main(date: string, event_json_id: string) {
  try {
    const base_filename = event_json_id;
    const base_folder = date;

    const _path = path.join(process.cwd(), 'test', 'files', 'daily_report', base_folder);
    try {
      await fs.mkdir(_path);
    } catch (error) {
      console.log(`${base_folder} - dir already existes`);
    }

    const file_arr = ['heart', 'steps', 'sleep', 'spo2', 'hrv', 'temp'].map((e) => {
      return `${base_filename}-${e}.json`;
    });

    for (const e of file_arr) {
      const file = await download_data(e);
      await fs.writeFile(path.join(_path, `${base_folder}-${e.split('-')[e.split('-').length - 1]}`), JSON.stringify(file, null, 2), {
        encoding: 'utf-8',
      });
    }
  } catch (error) {
    console.log('save error', error);
  }
}

const dates = [
  '2023-10-01',
  '2023-10-02',
  '2023-10-03',
  '2023-10-04',
  '2023-10-05',
  '2023-10-06',
  '2023-10-07',
  '2023-10-08',
  '2023-10-09',
  '2023-10-10',
  '2023-10-11',
  '2023-10-12',
  '2023-10-13',
  '2023-10-14',
  '2023-10-15',
  '2023-10-16',
  '2023-10-17',
  '2023-10-18',
  '2023-10-19',
  '2023-10-20',
  '2023-10-21',
  '2023-10-22',
  '2023-10-23',
  '2023-10-24',
  '2023-10-25',
  '2023-10-26',
  '2023-10-27',
  '2023-10-28',
  '2023-10-29',
  '2023-10-30',
  '2023-10-31',
  '2023-11-01',
  '2023-11-02',
  '2023-11-03',
  '2023-11-04',
  '2023-11-05',
  '2023-11-06',
  '2023-11-07',
  '2023-11-08',
  '2023-11-09',
  '2023-11-10',
  '2023-11-11',
  '2023-11-12',
  '2023-11-13',
  '2023-11-14',
  '2023-11-15',
  '2023-11-16',
  '2023-11-17',
  '2023-11-18',
  '2023-11-19',
];

const event_json_ids = [
  '0be9839a-ae9c-458b-9524-3e8100ce65c6',
  'aa55a244-f470-49f9-835a-c0da113372c5',
  '6b5f5ea3-9b6b-42ec-9e43-60ca244cdb13',
  '2bb39e46-e5e3-4274-8ef7-789ecaa8ccd6',
  '16dc4163-c1a4-4e8a-9949-672eb77e6d10',
  '26f8d0f0-068b-4963-8f00-fd9ab6502d1a',
  '202967d0-26c4-4be3-b921-ea65ef75ff20',
  '8bb2303d-f76c-4870-a6cd-c1faf1e7ee41',
  '2bea9cfc-423b-4169-9efa-6573164e0b40',
  'a2e4cfc1-8198-4c9c-b7f6-d56540249b5b',
  '97d5256f-d588-4238-8807-ee9fad7983d6',
  '6ecacc09-9e3f-4d55-b2bc-bcd5308a804b',
  '0ea589ad-2ec5-4040-8cce-d9077f67632a',
  '6ebd5cec-d531-4c23-9f9b-9cf180186752',
  'b6a8686b-ffe7-480a-85c8-9fb7a6095011',
  '20f6293d-f728-4c10-9d6a-4d3bbaccc388',
  'f2d41825-c832-4a04-add1-47fd45e9ac1c',
  'ebfa496d-6705-4dde-86e7-dfca93c9779c',
  '8182530b-51be-481e-b2a3-9d0fd6aa1785',
  'aa182d69-e708-434c-a199-3b3492c280a8',
  'e3f95e3a-4f42-46d1-aa7b-6b7a26de1116',
  'b31489b0-64b7-438e-82d7-472f13688bcb',
  '1d4099b4-1c61-4800-9908-b313b9d1922c',
  '0dd1d2e8-7a09-48fd-b786-d10e455f1737',
  '83bd913d-9151-4282-a757-fcb5018b9234',
  '83d3a564-1e59-4426-8b8c-060c789d0908',
  '003b8e9a-0c7a-461e-963b-a9f607c4296f',
  'b24bddcf-4279-4cbd-9114-35f96b121abb',
  'a3d715cc-3df2-4a03-a9ac-c5cf81d05091',
  'd06d6f1c-d785-4d90-bbfb-9a966c67368c',
  'e3c5b58e-b9aa-4f37-8a30-3642a25f926b',
  '2f839ca3-29ca-4d7f-928d-5a16d0e65a18',
  'b64e6337-7ca8-4b9e-be3a-b37f81a96f00',
  '05f55d84-41d6-4335-b60d-a00623361a9f',
  'cd87874a-5caf-4598-bfd5-fb047ee9bef5',
  'ff3b0171-2ad5-48f1-8127-be009a98e336',
  'bb7fbbb5-a58c-4402-832b-9a0b1a87ff5c',
  'a42c723c-937a-4384-b595-aa0df0195f22',
  'ec6874d3-0854-46d5-a086-1f67cee7e7a8',
  'f0e1d8b5-21f1-4301-8e80-ec47d930952f',
  '8f1e0c3b-1524-4619-bede-d873c28860b8',
  '175743ef-7bf5-43c5-a2d5-d9018bcc3115',
  'e5cfe843-ab9a-4acd-9be2-3b71fb58aa4f',
  '9e514b4f-6337-4dd2-9149-76474cbf4677',
  '30e27c04-aac1-46ea-892e-943840c8966e',
  'ca287882-5f7d-40b0-8fcc-a461072ef294',
  '60f10d7a-8f9c-4b1b-af03-3e4a5e48a407',
  '7d3082a6-4a92-48b6-bd95-83513d5280f3',
  '42aa869f-c4b3-48c0-9493-9d3ea9bbaaf8',
  'ffa8a695-5491-4640-aab5-204b74f39456',
];

const combined = dates.map((e, i) => ({ date: e, event_json_id: event_json_ids[i] }));

for (const e of combined) {
  // await main(e.date, e.event_json_id);
}
