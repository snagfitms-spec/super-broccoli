const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO SETUP ================= */
const io = new Server(server, {
  cors: {
    origin: "*", // we will lock this later for security
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

/* ================= SOCKET CONNECTION ================= */
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* ================= ENV DEBUG ================= */
console.log("=== SERVER STARTING ===");

/* ================= DATABASE ================= */
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

/* ================= MODEL ================= */
const Booking = mongoose.model("Booking", {
  name: String,
  email: String,
  service: String,
  message: String,
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

/* ================= LOGIN ================= */
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

  res.status(401).json({ success: false });
});

/* ================= MIDDLEWARE ================= */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "dev_secret", (err) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    next();
  });
}

/* ================= CREATE BOOKING ================= */
app.post("/bookings", async (req, res) => {
  try {

    const booking = await Booking.create(req.body);

    /* 🔥 REAL TIME UPDATE */
    io.emit("booking-created", booking);

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET BOOKINGS ================= */
app.get("/bookings", auth, async (req, res) => {
  const data = await Booking.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ================= DELETE BOOKING ================= */
app.delete("/bookings/:id", auth, async (req, res) => {

  await Booking.findByIdAndDelete(req.params.id);

  /* 🔥 REAL TIME UPDATE */
  io.emit("booking-deleted", req.params.id);

  res.json({ success: true });
});

/* ================= REVENUE API (LIVE) ================= */
app.get("/api/revenue", auth, async (req, res) => {

  const bookings = await Booking.find();

  let totalRevenue = 0;
  const serviceMap = {};

  bookings.forEach(b => {

    const amount = b.amount || 0;
    totalRevenue += amount;

    serviceMap[b.service] = (serviceMap[b.service] || 0) + amount;
  });

  const breakdown = Object.keys(serviceMap).map(key => ({
    service: key,
    total: serviceMap[key]
  }));

  res.json({
    totalRevenue,
    breakdown
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
