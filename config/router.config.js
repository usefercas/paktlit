// router.config.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');
const recomendacionesController = require('../controllers/recomendacionesController');



// Auth
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser);
router.post('/users', upload.single('avatar'), usersController.create);

//recetas generador 
router.post('/recipes', recomendacionesController.generarRecetas);

module.exports = router; 
