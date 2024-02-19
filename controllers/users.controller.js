const { StatusCodes } = require('http-status-codes'); // Importa los códigos de estado HTTP para manejar errores
const createError = require('http-errors'); // Importa la librería para crear errores HTTP personalizados
const User = require("../models/User.model"); // Importa el modelo de usuario

// Controlador para crear un nuevo usuario
module.exports.create = (req, res, next) => {
  const userToCreate = req.body; // Obtiene los datos del usuario a partir del cuerpo de la solicitud

  // Busca si ya existe un usuario con el mismo nombre de usuario o correo electrónico
  User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .then(user => {
      if (user) { // Si ya existe un usuario con el mismo nombre de usuario o correo electrónico
        next(createError(StatusCodes.BAD_REQUEST, 'Username or email already in use')); // Devuelve un error de solicitud incorrecta
      } else { // Si no existe un usuario con el mismo nombre de usuario o correo electrónico
        // Crea un nuevo usuario con los datos proporcionados
        return User.create(userToCreate)
          .then(userCreated => { // Cuando se crea el usuario exitosamente
            res.status(StatusCodes.CREATED).json(userCreated); // Devuelve el usuario creado con el código de estado 201 (Creado)
          })
        }
      })
    .catch(next); // Maneja cualquier error que ocurra durante la operación
}

// Función para obtener un usuario por su ID
const getUser = (id, req, res, next) => {
  // Busca el usuario por su ID en la base de datos
  User.findById(id)
    .then(user => {
      if (!user) { // Si no se encuentra el usuario
        next(createError(StatusCodes.NOT_FOUND, 'User not found')); // Devuelve un error de usuario no encontrado
      } else { // Si se encuentra el usuario
        res.json({ data: user }); // Devuelve el usuario encontrado en formato JSON
      }
    })
    .catch(next); // Maneja cualquier error que ocurra durante la operación
}

// Controlador para obtener el usuario actual
module.exports.getCurrentUser = (req, res, next) => {
  getUser(req.currentUserId, req, res, next); // Llama a la función para obtener un usuario pasándole el ID del usuario actual
}

// Controlador para obtener un usuario por su ID
module.exports.getUser = (req, res, next) => {
  getUser(req.params.id, req, res, next); // Llama a la función para obtener un usuario pasándole el ID del usuario especificado en la URL
}
