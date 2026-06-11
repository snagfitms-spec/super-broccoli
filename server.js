const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   1. DEBUG START
========================= */
console.log("=== SERVER STARTING ===");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

/* =========================
   2. DATABASE CONNECTION
========================= */
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is missing. Server cannot start.");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* =========================
   3. BOOKING MODEL
========================= */
const Booking = mongoose.model("Booking", {
  name: String,
  email: String,
  service: String,
  message: String,

  // IMPORTANT for revenue system
  amount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

/* =========================
   4. ADMIN LOGIN
========================= */
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

app.post("/admin/login", (req, res) => {

  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {

    const token = jwt.sign(
      { user: "admin" },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: "Invalid login" });
});

/* =========================
   5. AUTH MIDDLEWARE
========================= */
function authMiddleware(req, res, next) {

  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "dev_secret", (err) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    next();
  });
}

/* =========================
   6. CREATE BOOKING
========================= */
app.post("/bookings", async (req, res) => {

  try {

    const { name, email, message, service, amount } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const booking = await Booking.create({
      name,
      email,
      message,
      service: service || "General",
      amount: amount || 0
    });

    res.json({ success: true, booking });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ message: "Error saving booking" });
  }
});

/* =========================
   7. GET BOOKINGS (ADMIN)
========================= */
app.get("/bookings", authMiddleware, async (req, res) => {

  try {

    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {

    res.status(500).json({ message: "Error fetching bookings" });

  }
});

/* =========================
   8. DELETE BOOKING
========================= */
app.delete("/bookings/:id", authMiddleware, async (req, res) => {

  try {

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully" });

  } catch (err) {

    res.status(500).json({ message: "Delete operation failed" });

  }
});

/* =========================
   9. REVENUE API (FIXED + CLEAN)
========================= */
app.get("/api/revenue", authMiddleware, async (req, res) => {

  try {

    const bookings = await Booking.find();

    let totalRevenue = 0;
    const serviceMap = {};

    bookings.forEach(b => {

      const amount = b.amount || 0;

      totalRevenue += amount;

      if (!serviceMap[b.service]) {
        serviceMap[b.service] = 0;
      }

      serviceMap[b.service] += amount;
    });

    const breakdown = Object.keys(serviceMap).map(service => ({
      service,
      total: serviceMap[service]
    }));

    res.json({
      totalRevenue,
      breakdown
    });

  } catch (err) {

    console.error("Revenue API error:", err);

    res.status(500).json({ message: "Analytics error" });

  }
});

/* =========================
   10. START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
