const {
  OK_STATUS_CODE,
  // CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
// const createdStatusCode = CREATED_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
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
        res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred with the request" });
      }
      res
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
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(okStatusCode).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(notFoundStatusCode).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred with the request" });
      }
      res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.param;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.status(okStatusCode).send({ data: item }))
//     .catch((e) => {
//       res.status(internalServerStatusCode).send({ message: "Error from updateItems"});
//     });
// };

module.exports = { createItem, getItems, deleteItem };
