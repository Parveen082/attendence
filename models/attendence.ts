import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  userName: string;
  latitude: number;
  longitude: number;
  simplifiedLocation: string;
  timestamp: number;
  type: "checkin" | "checkout";
}

const AttendanceSchema: Schema = new Schema({
  userName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  simplifiedLocation: { type: String, required: true },
  timestamp: { type: Number, required: true },
  type: { type: String, enum: ["checkin", "checkout"], required: true },
});

export default mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);
