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
  console.log("Incoming signup payload:", req.body);

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
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new Error("Document not found"));
      }
      if (err.name === "CastError") {
        next(new Error("Invalid parameter"));
      }
      next(err);
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

const logout = (req, res) => {
  return res.status(okStatusCode).send({ message: "Logged out successfully" });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updatedUser) => res.status(okStatusCode).send(updatedUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new Error("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new Error("User not found"));
      }
      next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  logout,
  updateCurrentUser,
};
