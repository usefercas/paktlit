// Importa Express para crear la aplicación web
const express = require('express');

// Importa Morgan para el logging de solicitudes HTTP
const logger = require('morgan');

// Importa Mongoose para la interacción con la base de datos MongoDB
const mongoose = require('mongoose');

// Importa JSON Web Token para la autenticación basada en tokens
const jwt = require('jsonwebtoken');

// Importa CORS para habilitar el intercambio de recursos entre dominios
const cors = require('cors');

// Importa createError para generar errores HTTP personalizados
const createError = require('http-errors');

// Importa StatusCodes para el manejo de códigos de estado HTTP
const { StatusCodes } = require('http-status-codes');

// Importa la configuración de la base de datos desde el archivo db.config.js
require('./config/db.config.js');

// Creamos la instancia de la app Express
const app = express();

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173' // Define el origen permitido para las solicitudes CORS
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Middleware para el logging de solicitudes HTTP
app.use(logger('dev'));

// Importa las rutas definidas en el archivo router.config.js y las monta en el prefijo '/api'
const routes = require('./config/router.config');
app.use('/api', routes);

/* Handle errors */

// Middleware para manejar las solicitudes a rutas no encontradas
app.use((req, res, next) => {
  next(createError(StatusCodes.NOT_FOUND, "Route not found"));
});

// Middleware genérico para manejar errores
app.use((error, req, res, next) => {
  console.error(error);

  // Manejo específico de diferentes tipos de errores
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

  // Formatea el objeto de error para enviar como respuesta
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

  // Envia una respuesta con el código de estado y el objeto de error formateado
  res.status(error.status).json(data);
});

// Arranque del servidor

// Obtiene el puerto del entorno o usa el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
// Inicia el servidor y muestra el puerto en el que está escuchando
app.listen(PORT, () => {
  console.log(`App started on port: ${PORT} 🚀`);
});
