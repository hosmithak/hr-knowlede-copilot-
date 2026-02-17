import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

let dbInstance;

export async function connectDB() {
  if (!dbInstance) {
    try {
      await client.connect();
      dbInstance = client.db("hr_copilot"); // explicitly set DB name
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1);
    }
  }

  return dbInstance;
}
