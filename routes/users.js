const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validator");

const {
  getCurrentUser,
  updateCurrentUser,
  login,
  logout,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateCurrentUser);
router.post("/logout", logout);

module.exports = router;
