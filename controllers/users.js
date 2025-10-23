const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const secretKey = JWT_SECRET;

const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;

const User = require("../models/user");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    next(new Error("Invalid data"));
    return;
  }
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(createdStatusCode).send(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new Error("Invalid data"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new Error("Document not found"));
      }
      return res.status(okStatusCode).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new Error("Invalid parameter"));
      }
      return next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new Error("User not found"));
      }
      return res.status(okStatusCode).send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new Error("Invalid data"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "7d",
      });
      res.status(okStatusCode).send({ token, user });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new Error("Forbidden: Your access is not permitted"));
      }
      next(err);
    });
};

const logout = (req, res) =>
  res.status(okStatusCode).send({ message: "Logged out successfully" });

module.exports = {
  getCurrentUser,
  createUser,
  login,
  logout,
  updateCurrentUser,
};
