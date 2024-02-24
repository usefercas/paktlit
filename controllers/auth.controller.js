const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const { StatusCodes } = require('http-status-codes')
const User = require("../models/User.model");

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const LOGIN_ERROR_MESSAGE = 'Email or password invalid';

  const errorFn = () => next(createError(StatusCodes.BAD_REQUEST, LOGIN_ERROR_MESSAGE));

  if (!email || !password) {
    return errorFn();
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        errorFn();
      } else {

        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              errorFn();
            } else {

              const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'test',
                { expiresIn: '1d' }
              )

              res.json({ accessToken: token });
            }
          })
      }
    })
    .catch(next)
}