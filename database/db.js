import mongoose from "mongoose";
import dotenv from "dotenv";

// Database Connection From ENV
dotenv.config();
export const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

const connectDB = async() => {
    try {
      await mongoose.connect(MONGO_URL);
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      process.exit(1);
    }
}; 

export default connectDB;