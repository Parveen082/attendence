import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://parveenchouhan082:delllatitude7480e@cluster0.na2jf.mongodb.net/myDatabase";

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add MONGODB_URI in .env.local");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
};
