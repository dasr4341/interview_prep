import mongoose, { type Connection } from "mongoose";
import { config } from "./config.js";
import type { Logger } from "winston";

function checkMongooseConnection(logger: Logger) {
  const state = mongoose.connection.readyState;

  switch (state) {
    case 0:
      logger.silly("Mongoose connection is disconnected");
      break;
    case 1:
      logger.silly("Mongoose connection is connected");
      break;
    case 2:
      logger.silly("Mongoose connection is connecting");
      break;
    case 3:
      logger.silly("Mongoose connection is disconnecting");
      break;
    default:
      logger.silly("Unknown Mongoose connection state");
  }
}
export async function connectDatabase(logger: Logger): Promise<Connection> {
  try {
    const connection = mongoose.connection;
    if (connection.readyState === 1) {
      logger.silly("Mongoose is connected. Not starting a new connection");
      return connection;
    }

    await mongoose.connect(config.mongoLocalURI);

    connection.on("error", async (error) => {
      logger.error(`Error in MongoDb connection - ${error.message}`, error);
      await mongoose.disconnect();
      throw new Error(error);
    });

    connection.once("open", () => {
      logger.info("Database Connected successfully ✅");
    });

    return connection;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Failed to connect to database - ${err.message}`, err);
    } else {
      logger.error(
        "Caught an unknown error while connecting to database - ",
        err
      );
    }

    return mongoose.connection;
  }
}

export async function disconnectDb(logger: Logger) {
  logger.warn("⚠️ Disconnecting db");
  await mongoose.disconnect();
}
