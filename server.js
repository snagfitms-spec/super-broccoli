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


/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const Booking = require("./Booking");

