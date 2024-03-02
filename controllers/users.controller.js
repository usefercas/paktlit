const { StatusCodes } = require('http-status-codes'); 
const createError = require('http-errors');
const User = require("../models/User.model"); 

module.exports.create = (req, res, next) => {
  const userToCreate = req.body;

  User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .then(user => {
      if (user) { 
        next(createError(StatusCodes.BAD_REQUEST, 'Username or email already in use')); 
        return User.create(userToCreate)
          .then(userCreated => { 
            res.status(StatusCodes.CREATED).json(userCreated); 
          })
        }
      })
    .catch(next); 
}
const getUser = (id, req, res, next) => {
  User.findById(id)
    .then(user => {
      if (!user) { 
        next(createError(StatusCodes.NOT_FOUND, 'User not found')); 
      } else { 
        res.json({ data: user });
      }
    })
    .catch(next); 
}

module.exports.getCurrentUser = (req, res, next) => {
  getUser(req.currentUserId, req, res, next); 
}

module.exports.getUser = (req, res, next) => {
  getUser(req.params.id, req, res, next); 
}