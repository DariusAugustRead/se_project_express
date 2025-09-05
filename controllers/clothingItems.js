const {
  OK_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
const forbiddenStatusCode = FORBIDDEN_STATUS_CODE;
const notFoundStatusCode = NOT_FOUND_STATUS_CODE;
const internalServerStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: "Invalid data" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send({ data: items }))
    .catch(() => {
      res
        .status(internalServerStatusCode)
        .send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res.status(forbiddenStatusCode).send({ message: "Forbidden: Your access is not permitted" });
      }

      return ClothingItem.findByIdAndDelete(req.params.itemId)
        .then((deletedItem) => res.status(okStatusCode).send({ data: deletedItem }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(notFoundStatusCode).send({ message: "Document not found" });
      } else if (err.name === "CastError") {
        res.status(badRequestStatusCode).send({ message: "Invalid data" });
      } else {
        res.status(internalServerStatusCode).send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = { createItem, getItems, deleteItem };
