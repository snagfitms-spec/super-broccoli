const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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
  createdAt: { type: Date, default: Date.now }
});

// =========================
// AUTH ROUTES & MIDDLEWARE
// =========================
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

app.post("/admin/login", (req, res) => {
  // DIAGNOSTIC LOG: This shows up in your Render Logs dashboard
  console.log("Login attempt received:", req.body);

  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token: token });
  }

  return res.status(401).json({ success: false, message: "Invalid login" });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ message: "No token provided" });

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    next();
  });
}

// =========================
// BOOKING ROUTES
// =========================
app.post("/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: "Error saving booking" });
  }
});

app.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

app.delete("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));




