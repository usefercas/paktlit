require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const routes = require('./config/router.config');

require('./config/db.config.js');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json());
app.use(logger('dev'));
app.use('/api', routes);

app.use((req, res, next) => {
  next(createError(StatusCodes.NOT_FOUND, "Route not found"));
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error);
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(400, "Resource not found");
  } else if (error.message.includes("E11000")) {
    error = createError(400, "Resource already exists");
  } else if (error instanceof jwt.JsonWebTokenError) {
    error = createError(401, error);
  } else if (!error.status) {
    error = createError(500);
  }

  const data = {
    message: error.message,
    errors: error.errors
      ? Object.keys(error.errors).reduce((errors, key) => {
          return {
            ...errors,
            [key]: error.errors[key].message || error.errors[key],
          };
        }, {})
      : undefined,
  };

  res.status(error.status).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App started on port: ${PORT} 🚀`);
});
