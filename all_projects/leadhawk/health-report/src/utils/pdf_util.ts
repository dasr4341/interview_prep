import path from 'path';
import puppeteer from 'puppeteer';
import report from 'puppeteer-report';

import { config } from '../config/config.js';
import { File_Extension } from '../enum/enum.js';
import { Daily_Report_Data, Monthly_Report_Data, Special_Report_Data, Weekly_Report_Data } from '../interface/report_interface.js';
import { notify, upload_raw } from './upload_util.js';

declare global {
  interface Window {
    pdfData: any;
  }
}

export async function create_pdf(data: Daily_Report_Data | Special_Report_Data | Weekly_Report_Data | Monthly_Report_Data, html: string) {
  const browser = await puppeteer.launch({
    args: [
      '--window-size=1240,1754',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote',
    ],

    headless: true,
    defaultViewport: null,
    executablePath: config.dev_mode ? undefined : '/usr/bin/chromium-browser',
    timeout: 0,
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('report');

    await page.evaluateOnNewDocument(
      ({ data }) => {
        window.pdfData = data;
      },
      { data }
    );

    await page.goto(`file:${path.join(process.cwd(), 'html', html)}`, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });

    const pdf_buffer = await report.pdfPage(page, {
      format: 'a4',
      ...(config.dev_mode && {
        path: path.join(process.cwd(), 'debug', 'pdf', `${data.reportType}_${data.id}_${data.pdfDate}.pdf`),
      }),
    });

    await browser.close();

    return pdf_buffer;
  } catch (error) {
    await browser.close();
    console.log('create_pdf: error', error);
    await notify('create_pdf: error', error);
  }
}

export async function screenshot(data: Daily_Report_Data | Special_Report_Data | Weekly_Report_Data | Monthly_Report_Data, html: string) {
  if (!data?.heart?.heartCurrentDay) {
    return {
      heart_img_1: null,
      steps_img_1: null,
      heart_img_2: null,
      steps_img_2: null,
      heart_img_3: null,
      steps_img_3: null,
    };
  }

  const browser = await puppeteer.launch({
    args: [
      '--window-size=1240,1754',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote',
    ],

    headless: true,
    defaultViewport: null,
    executablePath: config.dev_mode ? undefined : '/usr/bin/chromium-browser',
    timeout: 0,
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('report');

    await page.evaluateOnNewDocument((data) => {
      window.pdfData = data;
    }, data);

    await page.goto(`file:${path.join(process.cwd(), 'html', html)}`, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });

    const heart_chart_1 = await page.$('#heartRateChart1');
    const steps_chart_1 = await page.$('#stepsChart1');
    const heart_sc_1 = await heart_chart_1?.screenshot();
    const steps_sc_1 = await steps_chart_1?.screenshot();

    const heart_chart_2 = await page.$('#heartRateChart2');
    const steps_chart_2 = await page.$('#stepsChart2');
    const heart_sc_2 = await heart_chart_2?.screenshot();
    const steps_sc_2 = await steps_chart_2?.screenshot();

    const heart_chart_3 = await page.$('#heartRateChart3');
    const steps_chart_3 = await page.$('#stepsChart3');
    const heart_sc_3 = await heart_chart_3?.screenshot();
    const steps_sc_3 = await steps_chart_3?.screenshot();

    await Promise.all([
      upload_raw(config.aws.s3.data_bucket, heart_sc_1 as Buffer, `${data.dataId}-heart-img-1`, File_Extension.PNG),
      upload_raw(config.aws.s3.data_bucket, steps_sc_1 as Buffer, `${data.dataId}-steps-img-1`, File_Extension.PNG),
      upload_raw(config.aws.s3.data_bucket, heart_sc_2 as Buffer, `${data.dataId}-heart-img-2`, File_Extension.PNG),
      upload_raw(config.aws.s3.data_bucket, steps_sc_2 as Buffer, `${data.dataId}-steps-img-2`, File_Extension.PNG),
      upload_raw(config.aws.s3.data_bucket, heart_sc_3 as Buffer, `${data.dataId}-heart-img-3`, File_Extension.PNG),
      upload_raw(config.aws.s3.data_bucket, steps_sc_3 as Buffer, `${data.dataId}-steps-img-3`, File_Extension.PNG),
    ]);

    await browser.close();

    return {
      heart_img_1: `${data.dataId}-heart-img-1.png`,
      steps_img_1: `${data.dataId}-steps-img-1.png`,
      heart_img_2: `${data.dataId}-heart-img-2.png`,
      steps_img_2: `${data.dataId}-steps-img-2.png`,
      heart_img_3: `${data.dataId}-heart-img-3.png`,
      steps_img_3: `${data.dataId}-steps-img-3.png`,
    };
  } catch (error) {
    await browser.close();
    console.log('screenshot: error', error);
    await notify('screenshot: error', error);
  }
}
