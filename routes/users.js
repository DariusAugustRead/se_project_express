const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateCurrentUser,
  login,
  logout,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
