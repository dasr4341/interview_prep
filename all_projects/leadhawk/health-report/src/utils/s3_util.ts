import { HeadObjectCommand, HeadObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { config } from '../config/config.js';
import { notify } from './upload_util.js';

const s3_client = new S3Client({ region: config.aws.default_region });

export async function s3_check_if_file_exist(bucket: string, key: string) {
  try {
    const input: HeadObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };
    const command = new HeadObjectCommand(input);
    const response = await s3_client.send(command);
    const http_status_code = response.$metadata.httpStatusCode;

    if (http_status_code === 200) return true;
    return false;
  } catch (error) {
    console.log('s3_check_if_file_exist: error', error);
    return false;
  }
}
