import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";

dotenv.config();

const app = express();

// ===============================
// CONNECT DATABASE
// ===============================
connectDB();

// ===============================
// MIDDLEWARE
// ===============================
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "https://client-six-tau-53.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/pets", petRoutes);

app.use("/api/adoptions", adoptionRoutes);

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {

  res.send("Pet Adoption API Running 🚀");

});

// ===============================
// 404 ROUTE HANDLER
// ===============================
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });

});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});