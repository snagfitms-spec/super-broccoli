const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const Booking = require("./Booking");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

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
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).send("Booking not found");
    res.status(200).send("Booking deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting booking");
  }
});

app.patch("/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) return res.status(404).send("Booking not found");
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).send("Error updating booking");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
