const router = require("express").Router();

const { createItem } = require("../controllers/clothingItems");

router.get("/", () => console.log("GET all clothing items"));
router.post("/", createItem);
router.delete("/:itemId", () => console.log("DELETE clothing items by ID"));

module.exports = router;
