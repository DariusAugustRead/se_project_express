const router = require("express").Router();
const auth = require("../middlewares/auth")

const {
  createItem,
  getItems,
  deleteItem
} = require("../controllers/clothingItems");

const {  likeItem, dislikeItem } = require('../controllers/likes')

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/items/:itemId/likes", auth, dislikeItem);

module.exports = router;
