import * as dotenv from "dotenv";
import { puppeteerConfiguration } from "./constants/puppeteerConfiguration.js";
dotenv.config();

const defaultLocation = {
  code: "US",
  country: "United States"
};

export const config = {
  port: process.env.PORT,
  llmServerBaseUrl: process.env.LLM_SERVER_BASE_URL || "",
  defaultLocation,
  mongoLocalURI: process.env.CONNECTION_URL ?? "",
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "",
  businessNewsWireUrl: process.env.BUSINESSWIRE_URL ?? "",
  prNewsWireUrl: process.env.PRNEWSWIRE_URL ?? "",
  confidence: {
    jobTitle: {
      max: 0.9 ,// may be greater than 0.9,
      min: 0.7
    }
  },
  puppeteer: {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    configuration: puppeteerConfiguration
  },
  googleSearch: {
    idealConfidenceLimitMin: 0.89,
    confidenceLimitMin: 0.87,
    url: process.env.GOOGLE_URL || "",
    vertex: {
      authUrl: "https://www.googleapis.com/auth/cloud-platform",
      baseUrl: process.env.GOOGLE_SEARCH_URL!
    }
  },
  oxyLab: {
    username:process.env.OXYLAB_USER,
    password:process.env.OXYLAB_PASSWORD,
  },
  geoName: {
    userName: "ankititobuz",
    maxRows: 1,
    ignore: {
       // San Francisco is also a city in Honduras. And API is returning HN.
      location: 'San Francisco',
      data: {
        state: 'California',
        country: defaultLocation.code,
        city: 'San Francisco'
      }
    }
  },
  formDs: {
    ignore: {
      investmentType: 'Pooled'
    },
    maxSearchLimit: Number(process.env.FORMDS_MAX_SEARCH_LIMIT ?? 0),
    searchLimit: Number(process.env.FORMDS_SEARCH_LIMIT ?? 0),
    singlePageLength: Number(process.env.FORMDS_SINGLE_PAGE_RECORD ?? 0),
    getFromDsNthPage: (pageNo: number) =>
      `${process.env.FORM_DS_URL}?page=${pageNo}`,
  },
  indeed: {
    url: `${process.env.INDEED_URL}/stc` || "",
    baseUrl: process.env.INDEED_URL,
    searchLimit: Number(process.env.INDEED_SEARCH_LIMIT ?? 0),
    singlePageLength: Number(process.env.INDEED_SINGLE_PAGE_JOB_NO ?? 0),
  },
  linkedIn: {
    url: process.env.LINKEDIN_URL || "",
    loginUrl: `${process.env.LINKEDIN_URL}login`,
    userPostBaseUrl: `${process.env.LINKEDIN_URL}search/results/content/?origin=FACETED_SEARCH&sortBy="date_posted"`,
    userJobPostPageLength: Number(process.env.NEW_HIRES_SCROLL_LIMIT ?? 0),
  },
  aws: {
    default_region: process.env.AWS_DEFAULT_REGION ?? "",
  },
  leadhawk: {
    filterServiceUrl: process.env.LEADHAWK_FILTER_SERVICE ?? "",
  },
  googleNews: {
    url: 'https://news.google.com/rss/search?q=raises+funding&hl=en-US&gl=US&ceid=US:en'
  }
};
