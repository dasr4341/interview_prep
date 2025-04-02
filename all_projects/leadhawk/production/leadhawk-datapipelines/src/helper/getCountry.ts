import { config } from "../config/config.js";
import type { IGeoNames } from "../interface/geoNames.interface.js";
import type { Logger } from "winston";

export async function getCountry(location: string | null, logger: Logger) {
  if (!location) return null;
  if (location === config.geoName.ignore.location)
    return config.geoName.ignore.data;

  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
    location
  )}&maxRows=${config.geoName.maxRows}&username=${config.geoName.userName}`;

  try {
    logger.info(`URL : ${url}`);
    const response$ = await fetch(url);
    const response = (await response$.json()) as IGeoNames;

    if (!response.geonames?.length) {
      throw new Error("No corresponding data found for the location");
    }

    logger.silly(`${location} resides in ${response.geonames[0].countryCode}`);
    const place = response.geonames[0];
    return {
      state: place.adminName1,
      country: place.countryCode,
      city: place.name,
    };
  } catch (error) {
    console.error(`Error fetching data for ${location}:`, error);
    return null;
  }
}
