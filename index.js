const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://parveenchouhan082:delllatitude7480e@cluster0.na2jf.mongodb.net/myDatabase");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  userName: String,
  latitude: Number,
  longitude: Number,
  simplifiedLocation: String,
  date: String,
  checkInTime: String,
  checkOutTime: String,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// Express setup
const app = express();
app.use(bodyParser.json());

// 📌 POST API (Check-in / Check-out)
app.post("/attendance", async (req, res) => {
  try {
    const { userName, latitude, longitude, simplifiedLocation, timestamp, type } = req.body;

    if (!userName || !timestamp || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const today = new Date(timestamp).toISOString().split("T")[0];
    let record = await Attendance.findOne({ userName, date: today });

    if (type === "checkin") {
      if (record) {
        return res.status(400).json({ error: "Already checked in today" });
      }

      record = new Attendance({
        userName,
        latitude,
        longitude,
        simplifiedLocation,
        date: today,
        checkInTime: timestamp,
      });
      await record.save();

      return res.status(201).json({ success: true, message: "Checked in successfully", record });
    }

    if (type === "checkout") {
      if (!record) {
        return res.status(404).json({ error: "No check-in found for today" });
      }
      if (record.checkOutTime) {
        return res.status(400).json({ error: "Already checked out today" });
      }

      record.checkOutTime = timestamp;
      await record.save();

      return res.status(200).json({ success: true, message: "Checked out successfully", record });
    }

    return res.status(400).json({ error: "Invalid type. Must be 'checkin' or 'checkout'." });

  } catch (err) {
    console.error("Attendance Error:", err.message);
    return res.status(500).json({ error: "Failed to save attendance" });
  }
});

// 📌 GET API (Fetch attendance records)
app.get("/attendance", async (req, res) => {
  try {
    const { username } = req.query;

    let query = {};
    if (username) {
      query.userName = username;
    }

    // latest first
    const records = await Attendance.find(query).sort({ checkInTime: -1 });

    return res.status(200).json({ success: true, records });
  } catch (err) {
    console.error("GET Attendance Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
