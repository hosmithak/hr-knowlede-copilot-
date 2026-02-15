import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

console.log("MONGO_URI CHECK:", process.env.MONGO_URI);
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Atlas connected successfully");
    return client.db();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
