const router = require("express").Router();

router.get("/", () => console.log("GET all clothing items"));
router.post("/", () => console.log("CREATE new clothing items"));
router.delete("/:itemId", () => console.log("DELETE clothing items by ID"));

module.exports = router;
