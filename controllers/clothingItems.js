const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(createdStatusCode).send({ data: item });
    })
    .catch((err) => {
      console.error("CreateItem error:", err);
      if (err.name === "ValidationError") {
        next(new Error("Invalid data"));
      }
      next(new Error("Error from createItem"));
    });
};

const getItems = (req, res, next) => {
  console.log("GET /items route hit");

  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send({ data: items }))
    .catch(() => {
      next(new Error("Error from getItems"));
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        next(new Error("Forbidden: Your access is not permitted"));
      }

      return ClothingItem.findByIdAndDelete(req.params.itemId).then(
        (deletedItem) => res.status(okStatusCode).send({ data: deletedItem })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new Error("Document not found"));
      } else if (err.name === "CastError") {
        next(new Error("Invalid data"));
      } else {
        next(err);
      }
    });
};

const likeItem = async (req, res, next) => {
  try {
    await ClothingItem.findByIdAndUpdate(req.params.itemId, {
      $addToSet: { likes: req.user._id },
    });

    const fullItem = await ClothingItem.findById(req.params.itemId).lean();

    if (!fullItem) {
      next(new Error("Item not found"));
    }
    res.send(fullItem);
  } catch (err) {
    next(new Error("Failed to like item"));
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    await ClothingItem.findByIdAndUpdate(req.params.itemId, {
      $pull: { likes: req.user._id },
    });

    const fullItem = await ClothingItem.findById(req.params.itemId).lean();

    if (!fullItem) {
      next(new Error("Item not found"));
    }
    res.send(fullItem);
  } catch (err) {
    next(new Error("Failed to like item"));
  }
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
