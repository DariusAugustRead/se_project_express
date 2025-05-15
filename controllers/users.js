const User = require("../models/user");

const okStatusCode = require("../utils/errors");
const createdStatusCode = require("../utils/errors");
const badRequestStatusCode = require("../utils/errors");
const notFoundStatusCode = require("../utils/errors");
const serverErrorStatusCode = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(okStatusCode).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(serverErrorStatusCode).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(createdStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res.status(serverErrorStatusCode).send({ message: err.message });
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
        return res.status(notFoundStatusCode).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res.status(serverErrorStatusCode).send({ message: err.message });
    });
};

module.exports = { getUsers, getUserById, createUser };
