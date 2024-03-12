const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
//const upload = require('./storage.config');//
const recomendacionesController = require('../controllers/recomendacionesController');
const planController = require ('../controllers/plan.controller');



// Auth
/*router.post('/login',authMiddleware.isAuthenticated, authController.login);*/
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser);
router.post('/users', usersController.create);

//recetas generador 
router.post('/recipes', authMiddleware.isAuthenticated, recomendacionesController.generarRecetas);
router.get('/recipes',authMiddleware.isAuthenticated, planController.getPlan);
//plan 
router.put('/plan/confirmar',authMiddleware.isAuthenticated, planController.confirmar);

module.exports = router; 