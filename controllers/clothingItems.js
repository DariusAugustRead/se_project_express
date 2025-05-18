// const okStatusCode = require("../utils/errors");
// const createdStatusCode = require("../utils/errors");
// const badRequestStatusCode = require("../utils/errors");
// const notFoundStatusCode = require("../utils/errors");
// const serverErrorStatusCode = require("../utils/errors");

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

module.exports = { createItem };
