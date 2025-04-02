import { createLogger, format, transports } from "winston";
import { CodeFlowType } from "../enums/codeFlowType.js";
import { format as dateFormat } from "date-fns";
import { colorize } from "json-colorizer";
import "winston-mongodb";

const { combine, timestamp, printf, json } = format;

const consoleFormat = printf(
  ({ level, message, timestamp, service, subservice, ...rest }) => {
    return `${timestamp} - [${subservice || service}] ${level}: ${message} ${
      Object.keys(rest).length ? colorize(rest) : ""
    }`;
  }
);

const childLoggers = [
  CodeFlowType.FORMDS,
  CodeFlowType.BUSINESS_NEWS,
  CodeFlowType.INDEED,
  CodeFlowType.LINKEDIN_JOB_POST,
  CodeFlowType.NEW_HIRES,
  CodeFlowType.GOOGLE_FUNDING,
  "EXPRESS_SERVER",
].map((source) => {
  const date = dateFormat(new Date(), "yyyy-MM-dd");
  const log = createLogger({
    level: "info",
    format: combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.File({ filename: `logs/${date}/${source}.log` }),
      new transports.Console({
        level: "silly",
        format: format.combine(
          format.colorize(),
          format.simple(),
          timestamp(),
          consoleFormat
        ),
      }),
    ],
  });

  log.defaultMeta = { service: source };
  return log;
});

const [
  formDsLogger,
  businessNewsLogger,
  indeedLogger,
  linkedInJobLogger,
  newHiresLogger,
  googleFundingLogger,
  expressServerLogger,
] = childLoggers;

export {
  formDsLogger,
  indeedLogger,
  linkedInJobLogger,
  newHiresLogger,
  businessNewsLogger,
  googleFundingLogger,
  expressServerLogger,
};
