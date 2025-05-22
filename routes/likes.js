const router = require("express").Router();

const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;