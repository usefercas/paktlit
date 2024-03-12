const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROUNDS = 10;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [EMAIL_REGEX, 'Invalid email format'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password should have at least 8 characters"],
    },
    avatar: {
      type: String
    },
    idPlan: {
      type: String
    },
    // otros campos...
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password; // Ocultar la contraseña y __v en la salida JSON
      },
    },
  }
);

userSchema.virtual('messages', {
  ref: 'GPTMessage', // El modelo al que se hace referencia
  localField: '_id', // El campo en el modelo User que se utiliza para la correspondencia
  foreignField: 'userId', // El campo en GPTMessage que contiene el _id del User
});

userSchema.methods.checkPassword = function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, ROUNDS)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
