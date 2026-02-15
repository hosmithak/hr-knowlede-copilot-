import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
    return client.db();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
