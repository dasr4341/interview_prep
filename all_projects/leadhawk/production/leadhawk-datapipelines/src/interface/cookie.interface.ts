import type {
  CookiePriority,
  CookieSameSite,
  CookieSourceScheme,
} from "puppeteer";

export interface ICookie {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: CookieSameSite;
  expirationDate?: number;
  priority?: CookiePriority;
  sameParty?: boolean;
  sourceScheme?: CookieSourceScheme;
  partitionKey?: string;
  storeId: string;
  id: number;
}
