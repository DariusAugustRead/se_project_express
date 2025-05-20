const router = require("express").Router();

const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/items/:id/likes", likeItem);
router.delete("/items/:id/likes", dislikeItem);

module.exports = router;
