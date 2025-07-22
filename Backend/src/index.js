// src/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const predictRoutes = require("./routes/predictRoutes");

dotenv.config();
connectDB(); // Connect MongoDB before routes

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/history", historyRoutes);

app.use("/api/predict", predictRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));