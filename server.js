const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const Booking = require("./Booking");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// Admin Login Route
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  // Replace these hardcoded values with your database check logic later
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username: username }, "your_secret_key", { expiresIn: "1h" });
    res.status(200).json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Booking Routes
app.post("/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).send("Error saving booking");
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.status(200).json(allBookings);
  } catch (err) {
    res.status(500).send("Error fetching bookings");
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (err) {
    res.status(500).send("Error deleting");
  }
});

app.patch("/bookings/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send("Error updating");
  }
});

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

