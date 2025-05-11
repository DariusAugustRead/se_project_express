const router = require("express").Router();
const { getUsers, getUsersById, postUsers } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUsersById);
router.post("/", postUsers);

module.exports = router;
