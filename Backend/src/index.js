//src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const predictRoutes = require("./routes/predictRoutes");
const chatSessionRoutes = require("./routes/chatSessionRoutes");
const chatMessageRoutes = require("./routes/chatMessageRoutes");

dotenv.config();
connectDB();

const app = express();
// Enable CORS for the frontend origin
app.use(cors({
  origin: "http://localhost:5173", // Adjust if your frontend port differs
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/chat-messages", chatMessageRoutes);
app.use("/api/chat", predictRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));