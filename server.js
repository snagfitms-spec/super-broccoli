const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// PORT (Render gives its own port, so we use this fallback)
const PORT = process.env.PORT || 3000;

/* =========================
   MONGOOSE / MONGODB CONNECT
   ========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

/* =========================
   BASIC TEST ROUTES
   ========================= */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.post("/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).send("Booking saved successfully!");
  } catch (err) {
    res.status(500).send("Error saving booking: " + err.message);
  }
});

// GET route to view all bookings
app.get("/bookings", async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.status(200).json(allBookings);
  } catch (err) {
    res.status(500).send("Error fetching bookings: " + err.message);
  }
});


/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const Booking = require("./Booking");

// DELETE route to remove a booking by ID
app.delete("/bookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).send("Booking not found");
    }
    res.status(200).send("Booking deleted successfully!");
  } catch (err) {
    res.status(500).send("Error deleting booking: " + err.message);
  }
});

// PATCH route to update a specific field of a booking by ID
app.patch("/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only updates the fields you send in the body
      { new: true }       // Returns the updated version of the document
    );
    if (!updatedBooking) {
      return res.status(404).send("Booking not found");
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).send("Error updating booking: " + err.message);
  }
});



