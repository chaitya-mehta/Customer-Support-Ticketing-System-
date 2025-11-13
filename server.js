const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const dotenv = require('dotenv');
dotenv.config();

const apiRoutes = require('./routes/index');

const connectDB = require('./config/database');
const { errorMessages } = require('./constants/common');
const { errorHandler } = require('./middleware/error.middleware');
connectDB();

const app = express();

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api', apiRoutes);

app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: errorMessages.ROUTE_ERROR
  });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
