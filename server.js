const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const dotenv = require("dotenv");
dotenv.config();

const apiRoutes = require("./routes/index");

const connectDB = require("./config/database");
const { errorMessages } = require("./constants/common");
connectDB();

const app = express();

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api", apiRoutes);

app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: errorMessages.ROUTE_ERROR,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Resource not found",
    });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
