const bcrypt = require("bcryptjs");

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
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
  // const { name, avatar, email, password } = req.body;
  //  User.create({ name, avatar, email, password });
  bcrypt
    .hash(req.body.password, 10, (err, hash) => {
      if (err) {
      }
    })
    .orFail()
    .then((hash) =>
      User.create({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => res.status(createdStatusCode).send(user))
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

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
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

module.exports = { getUsers, getUserById, createUser };
