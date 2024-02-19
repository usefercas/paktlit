const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller'); // Importa el controlador de autenticación
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');

// Auth
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser);
router.post('/users', upload.single('avatar'), usersController.create);

module.exports = router;
