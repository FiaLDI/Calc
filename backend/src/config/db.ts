import mongoose from "mongoose";

import { env } from "./env.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDb = () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set("strictQuery", true);

  connectionPromise = mongoose
    .connect(env.mongo.uri, {
      dbName: env.mongo.dbName,
    })
    .then((connection) => {
      console.log(`MongoDB connected: ${env.mongo.dbName}`);
      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

export const disconnectDb = async () => {
  connectionPromise = null;
  await mongoose.disconnect();
};

export const getDbConnectionState = () => mongoose.connection.readyState;
