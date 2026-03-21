import mongoose from "mongoose";

export async function connectDB() {
  if(!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not set in environment variables");
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  }
}
