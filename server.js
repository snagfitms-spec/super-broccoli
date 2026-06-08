const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// =========================
// DATABASE
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// =========================
// BOOKING MODEL
// =========================
const Booking = mongoose.model("Booking", {
  name: String,
  email: String,
  service: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =========================
// SIMPLE ADMIN AUTH (STABLE VERSION)
// =========================
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";
const ADMIN_TOKEN = "secure-token-123";

// LOGIN ROUTE
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid login"
  });
});

// =========================
// AUTH MIDDLEWARE
// =========================
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(403).json({ message: "No token" });
  }

  const token = auth.split(" ")[1];

  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
}

// =========================
// BOOKING ROUTES
// =========================

// CREATE BOOKING (PUBLIC)
app.post("/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: "Error saving booking" });
  }
});

// GET BOOKINGS (PROTECTED)
app.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// DELETE BOOKING (PROTECTED)
app.delete("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// =========================

// SERVER START
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
}
});

