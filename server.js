const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(cors());

/* ================= DATABASE ================= */
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const Booking = mongoose.model("Booking", {
  name: String,
  email: String,
  service: String,
  message: String,
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

/* ================= LIVE BROADCAST ENGINE ================= */
async function broadcastStats() {
    try {
        const stats = await Booking.aggregate([
            { $group: { 
                _id: "$service", 
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }}
        ]);
        const totalRevenue = stats.reduce((acc, curr) => acc + curr.total, 0);
        const totalBookings = await Booking.countDocuments();
        io.emit("dashboard:update", { totalRevenue, totalBookings, breakdown: stats });
    } catch (err) { console.error("Aggregation error:", err); }
}

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
  broadcastStats();
});

/* ================= ROUTES ================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false });
});

app.post("/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    await broadcastStats();
    res.json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    await broadcastStats();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/bookings", async (req, res) => {
  const data = await Booking.find().sort({ createdAt: -1 });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
