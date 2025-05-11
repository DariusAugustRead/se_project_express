const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      // throw Error("AHH!!");
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const getUsersById = (req, res) => {
  User.findById({});
};

const postUsers = (req, res) => {
  User.find({});
};

module.exports = { getUsers, getUsersById, postUsers };
