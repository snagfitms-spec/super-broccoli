const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
    res.send("Backend is running");
});

/* =========================
   START SERVER
========================= */

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
