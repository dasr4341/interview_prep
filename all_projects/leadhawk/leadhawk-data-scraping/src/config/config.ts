import "dotenv/config";

export const config = {
  port: process.env.PORT ?? "",
  formDsBaseUrl: process.env.FORMDS_URL ?? "",
  mongoLocalURI: process.env.CONNECTION_URL ?? "",
};
