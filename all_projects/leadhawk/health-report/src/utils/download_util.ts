import fs from 'node:fs';
import path from 'node:path';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { config } from '../config/config.js';
import { notify } from './upload_util.js';

const s3_sclient = new S3Client({ region: config.aws.default_region });

export async function download_data(file_name: string) {
  try {
    const input: GetObjectCommandInput = {
      Bucket: config.aws.s3.data_bucket,
      Key: file_name,
    };

    const command = new GetObjectCommand(input);
    const response = await s3_sclient.send(command);
    const data = JSON.parse((await response.Body?.transformToString()) as string);

    console.log('download_data: success');

    return data;
  } catch (error) {
    console.log('download_data: error', error);
    await notify('download_data: error', error);
  }
}

export async function get_signed_url(bucket: string, file_name: string) {
  try {
    const input: GetObjectCommandInput = {
      Bucket: bucket,
      Key: file_name,
    };
    const command = new GetObjectCommand(input);
    const url = await getSignedUrl(s3_sclient, command, { expiresIn: 120 });

    return url;
  } catch (error) {
    console.log('get_signed_url: error', error);
    await notify('get_signed_url: error', error);
  }
}

export async function download_report(file_name: string, need_buffer: boolean) {
  try {
    const input: GetObjectCommandInput = {
      Bucket: config.aws.s3.report_bucket,
      Key: file_name,
    };

    const command = new GetObjectCommand(input);
    const response = await s3_sclient.send(command);
    const data = await response.Body?.transformToByteArray();

    console.log('download_report: success');

    if (data) {
      if (need_buffer) {
        return Buffer.from(data);
      } else {
        fs.writeFileSync(path.join(process.cwd(), 'debug', 'pdf', file_name), Buffer.from(data), { encoding: 'utf-8' });
        console.log(`download_report: file ${file_name} saved in /debug/pdf`);
      }
    }
  } catch (error) {
    console.log('download_report: error', error);
    await notify('download_report: error', error);
  }
}
