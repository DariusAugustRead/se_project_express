const { OK_STATUS_CODE } = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;

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
        next(new Error("Document not found"));
      }
      if (err.name === "CastError") {
        next(new Error("Invalid parameter"));
      }
      next(err);
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
        next(new Error("Document not found"));
      }
      if (err.name === "CastError") {
        next(new Error("Invalid parameter"));
      }
      next(err);
    });
