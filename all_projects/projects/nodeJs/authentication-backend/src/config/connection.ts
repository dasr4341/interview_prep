import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "./config.js";
import mongoose from "mongoose";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export function connection() {
  mongoose.connect(config.mongoUri);
  mongoose.connection.on('error', (error: Error) => console.log(error));
}
