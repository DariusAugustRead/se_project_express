const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../utils/config");

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
const unauthorizedStatusCode = UNAUTHORIZED_STATUS_CODE;
const notFoundStatusCode = NOT_FOUND_STATUS_CODE;
const internalServerStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;

const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(okStatusCode).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    res.status(badRequestStatusCode).send({ message: "Invalid data" });
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
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid data" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid parameter" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
};


const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "7d",
      });
      res.status(createdStatusCode).send({ token });
    })
    .catch((err) => {
      res.status(unauthorizedStatusCode).send({ message: err.message });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updatedUser) => res.status(okStatusCode).send(updatedUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "User not found" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
};


module.exports = { getUsers, getCurrentUser, createUser, login, updateCurrentUser };
