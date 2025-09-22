const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateCurrentUser,
  logout,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);
router.post("/logout", logout);

module.exports = router;
