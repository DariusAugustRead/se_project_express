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

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(okStatusCode).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(notFoundStatusCode).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        res.status(badRequestStatusCode).send({ message: "Invalid parameter" });
      }
      res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(okStatusCode).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(notFoundStatusCode).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        res.status(badRequestStatusCode).send({ message: "Invalid parameter" });
      }
      res
        .status(internalServerStatusCode)
        .send({ message: "An error has occurred on the server" });
    });
