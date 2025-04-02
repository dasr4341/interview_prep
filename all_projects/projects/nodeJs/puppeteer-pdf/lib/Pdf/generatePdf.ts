import fs from "fs/promises";
import path from "path";
import puppeteer, { BoundingBox, Page } from "puppeteer";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzVmN2FmMS1iOTg0LTQwNTctOWYxNC1lNDdiODgzYjA1ZjMiLCJhZG1pbiI6ZmFsc2UsInBhcmVudFRva2VuIjoiIiwicGFyZW50TG9nSWQiOiIiLCJjb2RlIjoiIiwiaWF0IjoxNjk3MDIzNDQ4LCJleHAiOjE2OTcwMzA2NDh9.bZBKiu3jGNLurcsjpRhLGJr6SapDiLXw3oZL6-KfppY';
const userId = '';
const surveyId = '';

const link = `http://localhost:3000/downloadPdf/${userId}/${surveyId}/${token}?chart-visibility=false`;



export const generatePdf = async (data: string) => {
  const browser = await puppeteer
    .launch({
      headless: 'new',
      args: ["--disable-features=site-per-process", "--auto-open-devtools-for-tabs", '--disable-web-security', '--no-sandbox'],
      devtools: true,
      // args: ['--disable-web-security', '--no-sandbox'],
    })
    .catch((err) => {
      console.log("launch: ", err);
    });

  const page = (await browser?.newPage().catch((err) => {
    console.log("page: ", err);
  })) as Page;


  await page
    ?.goto(link)
    .catch((err) => {
      console.log("goto: ", err);
    });
  // ----------------------------

  // await page.waitForTimeout(2000);

  // const finalRequest = await page.waitForRequest(
  //   request => {
  //     console.log('request', request);
  //     const pd = request.postData();
  //     console.log(pd)
  //     if (!pd) {
  //       return false
  //     }
  
  //     return pd?.includes('FacilitySurveyWithAnswer')
  //   }
  // );

  // console.log('response', finalRequest.response()?.ok());

  await page.waitForNetworkIdle({idleTime: 5000})



  // await page.exposeFunction('chartRendered', () => {
  //   console.log('asdasd');
  // })


  // ----------------------------
  // await page.emulateMediaType('print');
  await page.screenshot({ path: "chart.png" });

  const pdf = await page
    ?.pdf({
      format: "a4",
      margin: {
        top: "1cm",
        bottom: "70px",
      },
      printBackground: true,
    })
    .catch((err) => {
      console.log("page.pdf: ", err);
    });
  if (pdf) {
    fs.writeFile('asdasd.pdf', pdf);
  }

  return pdf as Buffer;
};
