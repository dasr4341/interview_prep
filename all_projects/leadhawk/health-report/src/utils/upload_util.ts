import fs from 'node:fs/promises';
import path from 'path';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { formatInTimeZone } from 'date-fns-tz';

import { config } from '../config/config.js';
import { Content_Type, File_Extension, Source_System, Timezone } from '../enum/enum.js';
import { zoned_time } from '../helper/timezone_helper.js';
import { Screenshot } from '../interface/report_interface.js';
// import { s3_check_if_file_exist } from './s3_util.js';
import { sentry_capture } from './sentry_util.js';

const s3_client = new S3Client({ region: config.aws.default_region });
const sqs_client = new SQSClient({ region: config.aws.default_region });
const sns_client = new SNSClient({ region: config.aws.default_region });

export async function upload_report(
  id: string,
  pdf_buffer: Buffer | Uint8Array,
  report_date: string,
  report_time: string | null,
  report_id: string,
  report_data_uuid: string,
  report_sqs_name: string,
  report_sqs_set_url: string,
  report_tag: string,
  report_tag_time: string,
  anomaly_type: string | null,
  biometrics_score: number | null,
  screenshot: Screenshot,
  source_system: Source_System,
  file_prefix: string | null,
  timezone: Timezone,
  user_id: string
) {
  try {
    /* s3 */
    const file_name = `${file_prefix ?? id}:${report_date}${report_tag}${report_tag_time}.pdf`;
    const file_uri = `s3://${config.aws.s3.report_bucket}/${file_name}`;

    const s3_input: PutObjectCommandInput = {
      Body: Buffer.from(pdf_buffer),
      Bucket: config.aws.s3.report_bucket,
      ContentType: 'application/pdf',
      Key: file_name,
    };

    // const is_file_exist = await s3_check_if_file_exist(s3_input.Bucket as string, s3_input.Key as string);
    // console.log('upload_report: is_file_exist:', is_file_exist);
    // if (is_file_exist) {
    //   const new_file_name = `${file_prefix ?? id}:${report_date}${formatInTimeZone(
    //     new Date(),
    //     'UTC',
    //     'HH:mm:ss'
    //   )}${report_tag}${report_tag_time}.pdf`;

    //   file_uri = `s3://${config.aws.s3.report_bucket}/${new_file_name}`;
    //   s3_input.Key = new_file_name;
    // }

    const s3_command = new PutObjectCommand(s3_input);
    await s3_client.send(s3_command);

    /* sqs */
    const sqs_input: SendMessageCommandInput = {
      MessageBody: JSON.stringify({
        id: id,
        file: file_uri,
        type: report_sqs_name,
        rawData: report_data_uuid,
        time: report_time,
        anomalyType: anomaly_type,
        reportId: report_id,
        heart_img1: screenshot.heart_img_1,
        steps_img1: screenshot.steps_img_1,
        heart_img2: screenshot.heart_img_2,
        steps_img2: screenshot.steps_img_2,
        heart_img3: screenshot.heart_img_3,
        steps_img3: screenshot.steps_img_3,
        biometrics_score: biometrics_score,
        source_system: source_system,
        file_prefix: file_prefix,
        timezone: timezone,
        user_id: user_id,
      }),
      QueueUrl: report_sqs_set_url,
    };

    const sqs_command = new SendMessageCommand(sqs_input);
    await sqs_client.send(sqs_command);

    console.log('upload_report: success', file_uri);

    return file_uri;
  } catch (error) {
    console.log('upload_report: error', error);
    await notify('upload_report: error', error);
  }
}

export async function upload_data(data_buffer: Buffer, report_data_uuid: string) {
  try {
    const file_name = `${report_data_uuid}.json`;

    const input: PutObjectCommandInput = {
      Body: Buffer.from(data_buffer),
      Bucket: config.aws.s3.data_bucket,
      ContentType: 'application/json',
      Key: file_name,
    };

    const s3_command = new PutObjectCommand(input);
    await s3_client.send(s3_command);

    const data_uri = `s3://${input.Bucket}/${report_data_uuid}.json`;

    console.log('upload_data: success', data_uri);

    return data_uri;
  } catch (error) {
    console.log('upload_data: error', error);
    await notify('upload_data: error', error);
  }
}

export async function upload_raw(bucket: string, data_buffer: Buffer, file_name: string, extension: File_Extension) {
  try {
    let content_type: Content_Type | undefined = undefined;
    switch (extension) {
      case File_Extension.JSON:
        content_type = Content_Type.JSON;
        break;
      case File_Extension.PDF:
        content_type = Content_Type.PDF;
        break;
      case File_Extension.PNG:
        content_type = Content_Type.PDF;
        break;
      case File_Extension.TEXT:
        content_type = Content_Type.TEXT;
        break;
      default:
        content_type = undefined;
        break;
    }

    const input: PutObjectCommandInput = {
      Body: Buffer.from(data_buffer),
      Bucket: bucket,
      ContentType: content_type,
      Key: `${file_name}${extension}`,
    };

    const s3_command = new PutObjectCommand(input);
    await s3_client.send(s3_command);

    const raw_uri = `s3://${input.Bucket}/${file_name}${extension}`;

    console.log('upload_raw: success', raw_uri);

    return raw_uri;
  } catch (error) {
    console.log('upload_raw: error', error);
    await notify('upload_raw: error', error);
  }
}

export async function notify(message: string, error: any) {
  try {
    const input: PublishCommandInput = {
      Message: `${message} | ${error?.stack}`,
      TopicArn: config.aws.sns.arn,
    };

    const command = new PublishCommand(input);
    await sns_client.send(command);

    sentry_capture(error);

    /*
    save log locally for testing
    */
    if (config.dev_mode) {
      const data = {
        time: new Date().toISOString(),
        error: error?.stack,
      };
      await fs.writeFile(path.join(process.cwd(), 'log', 'error_log.log'), `${JSON.stringify(data, null, 2)}\n\n`, {
        flag: 'a+',
        encoding: 'utf-8',
      });
    }

    console.log('notify: success');
  } catch (error) {
    console.log('notify: error', error);
  }
}

export async function dead_letter(id: string, timezone: Timezone, report_sqs_name: string, message: string) {
  try {
    const _zoned_time = await zoned_time(timezone);
    const date = formatInTimeZone(_zoned_time, 'UTC', 'yyyy-MM-dd');

    const input: SendMessageCommandInput = {
      MessageBody: JSON.stringify({
        id: id,
        type: report_sqs_name,
        reason: message,
        date: date,
      }),
      QueueUrl: config.aws.sqs.dead_letter,
    };

    const command = new SendMessageCommand(input);
    const response = await sqs_client.send(command);
    console.log('dead_letter', response);

    console.log('dead_letter: success');
  } catch (error) {
    console.log('dead_letter: error', error);
    await notify('dead_letter: error', error);
  }
}
