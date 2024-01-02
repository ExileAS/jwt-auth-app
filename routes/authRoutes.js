const { Router } = require("express");
const {
  login_get,
  login_post,
  singup_get,
  singup_post,
  logout_get,
} = require("../controllers/authController");

const router = Router();

router.get("/signup", singup_get);
router.post("/signup", singup_post);
router.get("/login", login_get);
router.post("/login", login_post);
router.get("/logout", logout_get);

module.exports = router;
